import { apiRequest } from './client'

export const projetsApi = {
  creer: (body) => apiRequest('/projets', { method: 'POST', body }),

  rechercher: ({ texte, technologie, categorie, statut, competenceId, page = 0, taille = 10 } = {}) => {
    const params = new URLSearchParams()
    if (texte?.trim()) params.set('texte', texte.trim())
    if (technologie?.trim()) params.set('technologie', technologie.trim())
    if (categorie?.trim()) params.set('categorie', categorie.trim())
    if (statut) params.set('statut', statut)
    if (competenceId) params.set('competenceId', competenceId)
    params.set('page', page)
    params.set('taille', taille)
    return apiRequest(`/projets?${params.toString()}`)
  },

  mesProjets: () => apiRequest('/projets/mes-projets'),

  getById: (id) => apiRequest(`/projets/${id}`),

  modifier: (id, body) => apiRequest(`/projets/${id}`, { method: 'PUT', body }),

  changerStatut: (id, statut) =>
    apiRequest(`/projets/${id}/statut`, { method: 'PATCH', body: { statut } }),

  // --- Demandes d'adhésion (sur un projet) ---

  envoyerDemande: (projetId, body) =>
    apiRequest(`/projets/${projetId}/demandes`, { method: 'POST', body }),

  getDemandesRecues: (projetId, statut) => {
    const q = statut ? `?statut=${encodeURIComponent(statut)}` : ''
    return apiRequest(`/projets/${projetId}/demandes${q}`)
  },

  deciderDemande: (projetId, demandeId, decision) =>
    apiRequest(`/projets/${projetId}/demandes/${demandeId}`, {
      method: 'PATCH',
      body: { decision },
    }),

  // --- Membres ---

  getMembres: (projetId) => apiRequest(`/projets/${projetId}/membres`),

  retirerMembre: (projetId, utilisateurId, motif) =>
    apiRequest(`/projets/${projetId}/membres/${utilisateurId}`, {
      method: 'DELETE',
      body: { motif },
    }),

  getDeparts: (projetId) => apiRequest(`/projets/${projetId}/departs`),

  // --- Discussions ---

  getDiscussions: (projetId, { page = 0, taille = 20 } = {}) =>
    apiRequest(`/projets/${projetId}/discussions?page=${page}&taille=${taille}`),

  posterDiscussion: (projetId, contenu) =>
    apiRequest(`/projets/${projetId}/discussions`, { method: 'POST', body: { contenu } }),
}
