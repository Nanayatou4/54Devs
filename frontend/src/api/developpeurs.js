import { apiRequest } from './client'

export const developpeursApi = {
  rechercher: ({ texte, competenceId, type, pays, niveau, disponibilite, page = 0, taille = 10, auth = true } = {}) => {
    const params = new URLSearchParams()
    if (texte?.trim()) params.set('texte', texte.trim())
    if (competenceId) params.set('competenceId', competenceId)
    if (type) params.set('type', type)
    if (pays?.trim()) params.set('pays', pays.trim())
    if (niveau) params.set('niveau', niveau)
    if (disponibilite?.trim()) params.set('disponibilite', disponibilite.trim())
    params.set('page', page)
    params.set('taille', taille)
    return apiRequest(`/developpeurs?${params.toString()}`, { auth })
  },
  getById: (id) => apiRequest(`/developpeurs/${id}`),
}
