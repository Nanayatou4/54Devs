import { apiRequest } from './client'

export const publicApi = {
  projets: (limite = 6) => apiRequest(`/public/projets?limite=${limite}`, { auth: false }),
  statistiques: () => apiRequest('/public/statistiques', { auth: false }),
  mentors: (limite = 12) => apiRequest(`/public/mentors?limite=${limite}`, { auth: false }),
  developpeurs: (limite = 100) => apiRequest(`/public/developpeurs?limite=${limite}`, { auth: false }),
}
