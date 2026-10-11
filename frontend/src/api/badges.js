import { apiRequest } from './client'

export const badgesApi = {
  mesBadges: () => apiRequest('/badges'),
}
