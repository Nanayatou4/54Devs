/** Configuration API (variables Vite pour dev / prod). */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8087/api',
  // En production, l'URL de retour OAuth suit le domaine qui sert réellement l'app.
  // VITE_APP_ORIGIN permet de la fixer explicitement si nécessaire.
  appOrigin: import.meta.env.VITE_APP_ORIGIN || (typeof window === 'undefined' ? '' : window.location.origin),
  githubClientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
}

export function getOAuthStateKey(provider) {
  return `oauth_state_${provider}`
}

function creerState(provider) {
  const state = crypto.randomUUID()
  sessionStorage.setItem(getOAuthStateKey(provider), state)
  return state
}

export function buildGitHubAuthUrl() {
  if (!config.githubClientId) {
    throw new Error('La connexion GitHub n’est pas configurée : identifiant OAuth manquant côté front.')
  }
  const params = new URLSearchParams({
    client_id: config.githubClientId,
    redirect_uri: `${config.appOrigin}/auth/callback/github`,
    scope: 'user:email',
    state: creerState('github'),
  })
  return `https://github.com/login/oauth/authorize?${params}`
}

export function buildGoogleAuthUrl() {
  if (!config.googleClientId) {
    throw new Error('La connexion Google n’est pas configurée : identifiant OAuth manquant côté front.')
  }
  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: `${config.appOrigin}/auth/callback/google`,
    response_type: 'code',
    scope: 'openid email profile',
    state: creerState('google'),
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}
