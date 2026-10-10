import { config } from './config'
import { getToken, clearAuthSession } from '../lib/session'

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Client HTTP vers le backend Spring (`/api/...`).
 * @param {string} path - Chemin après la base (ex. `/auth/connexion`)
 */
export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${config.apiBaseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err instanceof TypeError) {
      throw new ApiError(
        'Impossible de contacter le serveur. Vérifiez que le backend est lancé.',
        0,
        null,
      )
    }
    throw err
  }

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearAuthSession()
      window.location.assign('/login?expire=1')
      return
    }
    const message =
      typeof data === 'object' && data?.message ? data.message : `Erreur ${res.status}`
    throw new ApiError(message, res.status, data)
  }

  return data
}
