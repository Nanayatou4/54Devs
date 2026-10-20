import { apiRequest } from './client'

export const questionsApi = {
  rechercher: ({ texte, categorie, resolue, tri = 'recentes', page = 0, taille = 10 } = {}) => {
    const params = new URLSearchParams()
    if (texte?.trim()) params.set('texte', texte.trim())
    if (categorie) params.set('categorie', categorie)
    if (resolue !== undefined && resolue !== null) params.set('resolue', resolue)
    params.set('tri', tri)
    params.set('page', page)
    params.set('taille', taille)
    return apiRequest(`/questions?${params.toString()}`)
  },
  lister: (params) => questionsApi.rechercher(params),
  categories: () => apiRequest('/questions/categories'),
  getById: (id) => apiRequest(`/questions/${id}`),
  creer: (body) => apiRequest('/questions', { method: 'POST', body }),
  repondre: (id, contenu) => apiRequest(`/questions/${id}/reponses`, { method: 'POST', body: { contenu } }),
  marquerSolution: (id, reponseId) => apiRequest(`/questions/${id}/reponses/${reponseId}/solution`, { method: 'PATCH' }),
}
