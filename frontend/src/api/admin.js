import { apiRequest } from './client'

export const adminApi = {
  /**
   * Statistiques globales de la plateforme pour l'administration
   */
  statistiques: () => apiRequest('/admin/statistiques'),

  /**
   * Liste paginée des utilisateurs avec filtres
   * @param {{ texte?: string, role?: string, actif?: boolean, page?: number, taille?: number }} params
   */
  utilisateurs: ({ texte, role, actif, page = 0, taille = 10 } = {}) => {
    const params = new URLSearchParams()
    if (texte?.trim()) params.set('texte', texte.trim())
    if (role) params.set('role', role)
    if (actif !== undefined && actif !== null && actif !== '') params.set('actif', actif)
    params.set('page', page)
    params.set('taille', taille)
    return apiRequest(`/admin/utilisateurs?${params.toString()}`)
  },

  /**
   * Activer ou désactiver un utilisateur
   * @param {number} id
   * @param {boolean} actif
   */
  changerActif: (id, actif) =>
    apiRequest(`/admin/utilisateurs/${id}`, {
      method: 'PATCH',
      body: { actif },
    }),

  /**
   * Modération : Supprimer une question et ses réponses
   * @param {number} id
   */
  supprimerQuestion: (id) =>
    apiRequest(`/admin/questions/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Modération : Supprimer une réponse
   * @param {number} questionId
   * @param {number} reponseId
   */
  supprimerReponse: (questionId, reponseId) =>
    apiRequest(`/admin/questions/${questionId}/reponses/${reponseId}`, {
      method: 'DELETE',
    }),

  /**
   * Liste paginée des challenges pour administration
   * @param {{ page?: number, taille?: number }} params
   */
  challenges: ({ page = 0, taille = 10 } = {}) =>
    apiRequest(`/admin/challenges?page=${page}&taille=${taille}`),

  /**
   * Créer un challenge (réservé aux admins)
   * @param {object} challenge
   */
  creerChallenge: (challenge) =>
    apiRequest('/admin/challenges', {
      method: 'POST',
      body: challenge,
    }),
}
