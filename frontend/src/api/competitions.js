import { apiRequest } from './client'

export const competitionsApi = {
  lister: () => apiRequest('/competitions'),
  soumettre: (id, submission) => apiRequest(`/competitions/${id}/soumissions`, {
    method: 'POST',
    body: submission,
  }),
}

export const adminCompetitionsApi = {
  creer: (competition) => apiRequest('/admin/competitions', {
    method: 'POST',
    body: competition,
  }),
}
