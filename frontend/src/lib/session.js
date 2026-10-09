const TOKEN_KEY = 'token'
const USER_KEY = 'utilisateur'
const PHOTO_KEY = 'profile_photo'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthSession({ token, utilisateur }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(utilisateur))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(PHOTO_KEY)
}

export function setProfilePhoto(dataUrl) {
  if (dataUrl) localStorage.setItem(PHOTO_KEY, dataUrl)
  else localStorage.removeItem(PHOTO_KEY)
}

export function getProfilePhoto() {
  return localStorage.getItem(PHOTO_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
