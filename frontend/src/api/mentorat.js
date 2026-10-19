import { apiRequest } from './client'

export const mentorsApi = {
  moi: () => apiRequest('/mentors/moi'),
  monProfil: () => apiRequest('/mentors/moi'),
  enregistrer: (body) => apiRequest('/mentors/moi', { method: 'PUT', body }),
  enregistrerProfil: (body) => apiRequest('/mentors/moi', { method: 'PUT', body }),
  rechercher: ({ texte, competenceId, pays, niveau, page = 0, taille = 10, auth = true } = {}) => {
    const params = new URLSearchParams()
    if (texte?.trim()) params.set('texte', texte.trim())
    if (competenceId) params.set('competenceId', competenceId)
    if (pays?.trim()) params.set('pays', pays.trim())
    if (niveau) params.set('niveau', niveau)
    params.set('page', page)
    params.set('taille', taille)
    return apiRequest(`/mentors?${params.toString()}`, { auth })
  },
  detail: (utilisateurId) => apiRequest(`/mentors/${utilisateurId}`),
  getById: (utilisateurId) => apiRequest(`/mentors/${utilisateurId}`),
}

export const mentoratsApi = {
  demander: (body) => apiRequest('/mentorats', { method: 'POST', body }),
  mesMentorats: () => apiRequest('/mentorats/mes-mentorats'),
  detail: (id) => apiRequest(`/mentorats/${id}`),
  decider: (id, decision) => apiRequest(`/mentorats/${id}`, { method: 'PATCH', body: { decision } }),
  planifier: (id, body) => apiRequest(`/mentorats/${id}/seances`, { method: 'POST', body }),
  planifierSeance: (id, body) => apiRequest(`/mentorats/${id}/seances`, { method: 'POST', body }),
  compteRendu: (id, seanceId, compteRendu) => apiRequest(`/mentorats/${id}/seances/${seanceId}/compte-rendu`, { method: 'PUT', body: typeof compteRendu === 'string' ? { compteRendu } : compteRendu }),
  compteRenduSeance: (id, seanceId, body) => apiRequest(`/mentorats/${id}/seances/${seanceId}/compte-rendu`, { method: 'PUT', body }),
  terminer: (id, bilan) => apiRequest(`/mentorats/${id}/terminer`, { method: 'PATCH', body: typeof bilan === 'object' && bilan !== null ? bilan : { bilan: bilan || null } }),
  bilan: (id, bilan) => apiRequest(`/mentorats/${id}/bilan`, { method: 'PUT', body: typeof bilan === 'object' && bilan !== null ? bilan : { bilan } }),
}
