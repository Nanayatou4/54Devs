import { apiRequest } from './client'

export const publicApi = {
  projets: (limite = 6) => apiRequest(`/public/projets?limite=${limite}`, { auth: false }),
  statistiques: () => apiRequest('/public/statistiques', { auth: false }),
}
