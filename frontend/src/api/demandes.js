import { apiRequest } from './client'

export const demandesApi = {
  mesDemandes: () => apiRequest('/demandes/mes-demandes'),
}
