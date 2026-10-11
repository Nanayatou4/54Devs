import { apiRequest } from './client'

export const dashboardApi = {
  get: () => apiRequest('/dashboard'),
}
