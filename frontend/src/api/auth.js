import { apiRequest } from './client'

/** POST /api/auth/* et GET /api/auth/moi */
export const authApi = {
  inscription: (body) =>
    apiRequest('/auth/inscription', { method: 'POST', body, auth: false }),

  connexion: (body) =>
    apiRequest('/auth/connexion', { method: 'POST', body, auth: false }),

  github: (code) =>
    apiRequest('/auth/github', { method: 'POST', body: { code }, auth: false }),

  google: (code) =>
    apiRequest('/auth/google', { method: 'POST', body: { code }, auth: false }),

  moi: () => apiRequest('/auth/moi'),
}
