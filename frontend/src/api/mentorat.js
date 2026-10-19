import { apiRequest } from './client'

export const mentorsApi = {
  moi: () => apiRequest('/mentors/moi'),
  enregistrer: (body) => apiRequest('/mentors/moi', { method: 'PUT', body }),
  rechercher: ({ texte, competenceId, pays, niveau, page = 0, taille = 10 } = {}) => {
    const params = new URLSearchParams()
    if (texte?.trim()) params.set('texte', texte.trim())
    if (competenceId) params.set('competenceId', competenceId)
    if (pays?.trim()) params.set('pays', pays.trim())
    if (niveau) params.set('niveau', niveau)
    params.set('page', page)
    params.set('taille', taille)
    return apiRequest(`/mentors?${params.toString()}`)
  },
  detail: (utilisateurId) => apiRequest(`/mentors/${utilisateurId}`),
}

export const mentoratsApi = {
  demander: (body) => apiRequest('/mentorats', { method: 'POST', body }),
  mesMentorats: () => apiRequest('/mentorats/mes-mentorats'),
  detail: (id) => apiRequest(`/mentorats/${id}`),
  decider: (id, decision) => apiRequest(`/mentorats/${id}`, { method: 'PATCH', body: { decision } }),
  planifier: (id, body) => apiRequest(`/mentorats/${id}/seances`, { method: 'POST', body }),
  compteRendu: (id, seanceId, compteRendu) => apiRequest(`/mentorats/${id}/seances/${seanceId}/compte-rendu`, { method: 'PUT', body: { compteRendu } }),
  terminer: (id, bilan) => apiRequest(`/mentorats/${id}/terminer`, { method: 'PATCH', body: { bilan: bilan || null } }),
  bilan: (id, bilan) => apiRequest(`/mentorats/${id}/bilan`, { method: 'PUT', body: { bilan } }),
}
