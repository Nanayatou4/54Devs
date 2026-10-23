const TOKEN_KEY = 'token'
const USER_KEY = 'utilisateur'
const PHOTO_KEY = 'profile_photo'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthSession({ token, utilisateur }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(utilisateur))
  if (utilisateur?.avatarUrl) {
    localStorage.setItem(PHOTO_KEY, utilisateur.avatarUrl)
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(PHOTO_KEY)
}

export function setProfilePhoto(dataUrl) {
  if (dataUrl) localStorage.setItem(PHOTO_KEY, dataUrl)
  else localStorage.removeItem(PHOTO_KEY)

  // Met également à jour l'utilisateur dans localStorage s'il existe
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (raw) {
      const u = JSON.parse(raw)
      u.avatarUrl = dataUrl || null
      localStorage.setItem(USER_KEY, JSON.stringify(u))
    }
  } catch {}

  window.dispatchEvent(new Event('54devs_user_updated'))
}

export function getProfilePhoto() {
  return localStorage.getItem(PHOTO_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    const u = JSON.parse(raw)
    const photo = localStorage.getItem(PHOTO_KEY)
    if (photo && !u.avatarUrl) {
      u.avatarUrl = photo
    }
    return u
  } catch {
    return null
  }
}

export function updateStoredUser(patch) {
  try {
    const u = getStoredUser() || {}
    const updated = { ...u, ...patch }
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
    if (patch.avatarUrl !== undefined) {
      if (patch.avatarUrl) localStorage.setItem(PHOTO_KEY, patch.avatarUrl)
      else localStorage.removeItem(PHOTO_KEY)
    }
    window.dispatchEvent(new Event('54devs_user_updated'))
    return updated
  } catch {
    return null
  }
}

export function getHomePath(user) {
  return user?.role === 'ADMIN' ? '/admin' : '/dashboard'
}
