import { apiRequest } from './client'

export const mentorsApi = {
  /**
   * Mon profil de mentor (retourne { estMentor, presentation, nombreMentoresMax, actif, placesRestantes })
   */
  monProfil: () => apiRequest('/mentors/moi'),

  /**
   * Enregistrer / mettre à jour mon profil mentor
   * @param {{ presentation: string, nombreMentoresMax: number, actif: boolean }} data
   */
  enregistrerProfil: (data) => apiRequest('/mentors/moi', { method: 'PUT', body: data }),

  /**
   * Recherche paginée de mentors
   */
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

  /**
   * Détail d'un mentor par son identifiant utilisateur
   */
  getById: (utilisateurId) => apiRequest(`/mentors/${utilisateurId}`),
}
