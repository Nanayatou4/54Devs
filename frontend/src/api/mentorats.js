import { apiRequest } from './client'

export const mentoratsApi = {
  /**
   * Envoyer une demande de mentorat à un mentor
   * @param {{ mentorId: number, sujet?: string, message?: string }} data
   */
  demander: (data) => apiRequest('/mentorats', { method: 'POST', body: data }),

  /**
   * Récupérer mes mentorats (en tant que mentor et en tant que mentoré)
   * retourne { commeMentor: MentoratDto[], commeMentore: MentoratDto[] }
   */
  mesMentorats: () => apiRequest('/mentorats/mes-mentorats'),

  /**
   * Détail d'un mentorat avec séances et bilans
   */
  detail: (id) => apiRequest(`/mentorats/${id}`),

  /**
   * Accepter ou refuser une demande de mentorat
   * @param {number} id
   * @param {'ACCEPTE' | 'REFUSE'} decision
   */
  decider: (id, decision) =>
    apiRequest(`/mentorats/${id}`, {
      method: 'PATCH',
      body: { decision },
    }),

  /**
   * Planifier une nouvelle séance de mentorat
   * @param {number} id
   * @param {{ date: string, dureeMinutes: number, sujet?: string }} data
   */
  planifierSeance: (id, data) =>
    apiRequest(`/mentorats/${id}/seances`, {
      method: 'POST',
      body: data,
    }),

  /**
   * Enregistrer le compte-rendu d'une séance (par le mentor)
   * @param {number} id
   * @param {number} seanceId
   * @param {{ compteRendu: string }} data
   */
  compteRenduSeance: (id, seanceId, data) =>
    apiRequest(`/mentorats/${id}/seances/${seanceId}/compte-rendu`, {
      method: 'PUT',
      body: data,
    }),

  /**
   * Clôturer un mentorat avec bilan optionnel
   * @param {number} id
   * @param {{ bilan?: string }} data
   */
  terminer: (id, data = {}) =>
    apiRequest(`/mentorats/${id}/terminer`, {
      method: 'PATCH',
      body: data,
    }),

  /**
   * Écrire ou mettre à jour son bilan final pour un mentorat terminé
   * @param {number} id
   * @param {{ bilan: string }} data
   */
  bilan: (id, data) =>
    apiRequest(`/mentorats/${id}/bilan`, {
      method: 'PUT',
      body: data,
    }),
}
