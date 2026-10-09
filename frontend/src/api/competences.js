import { apiRequest } from './client'

/** GET /api/competences */
export const competencesApi = {
  lister: (categorie) => {
    const q = categorie?.trim() ? `?categorie=${encodeURIComponent(categorie.trim())}` : ''
    return apiRequest(`/competences${q}`)
  },
}
