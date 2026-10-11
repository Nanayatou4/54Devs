import { apiRequest } from './client'

export const challengesApi = {
  lister: ({ type, difficulte, ouvert, page = 0, taille = 10 } = {}) => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (difficulte) params.set('difficulte', difficulte)
    if (ouvert !== undefined && ouvert !== null) params.set('ouvert', ouvert)
    params.set('page', page)
    params.set('taille', taille)
    return apiRequest(`/challenges?${params.toString()}`)
  },
  duJour: () => apiRequest('/challenges/du-jour'),
  classement: ({ page = 0, taille = 10 } = {}) => apiRequest(`/challenges/classement?page=${page}&taille=${taille}`),
  getById: (id) => apiRequest(`/challenges/${id}`),
  repondre: (id, reponse) => apiRequest(`/challenges/${id}/reponses`, { method: 'POST', body: { reponse } }),
}
