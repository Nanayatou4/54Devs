/** Configuration API (variables Vite pour dev / prod). */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8087/api',
  appOrigin: import.meta.env.VITE_APP_ORIGIN || 'http://localhost:5173',
  githubClientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
}

function creerState() {
  const state = crypto.randomUUID()
  sessionStorage.setItem('oauth_state', state)
  return state
}

export function buildGitHubAuthUrl() {
  const params = new URLSearchParams({
    client_id: config.githubClientId,
    redirect_uri: `${config.appOrigin}/auth/callback/github`,
    scope: 'user:email',
    state: creerState(),
  })
  return `https://github.com/login/oauth/authorize?${params}`
}

export function buildGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: `${config.appOrigin}/auth/callback/google`,
    response_type: 'code',
    scope: 'openid email profile',
    state: creerState(),
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}
