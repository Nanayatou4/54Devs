import { apiRequest } from './client'

export const competitionsApi = {
  lister: () => apiRequest('/competitions'),
  soumettre: (id, submission) => apiRequest(`/competitions/${id}/soumissions`, {
    method: 'POST',
    body: submission,
  }),
  classement: (id) => apiRequest(`/competitions/${id}/classement`),
}

export const adminCompetitionsApi = {
  lister: () => apiRequest('/admin/competitions'),
  creer: (competition) => apiRequest('/admin/competitions', { method: 'POST', body: competition }),
  modifier: (id, competition) => apiRequest(`/admin/competitions/${id}`, { method: 'PUT', body: competition }),
  supprimer: (id) => apiRequest(`/admin/competitions/${id}`, { method: 'DELETE' }),
  soumissions: (id) => apiRequest(`/admin/competitions/${id}/soumissions`),
  evaluer: (competitionId, submissionId, evaluation) => apiRequest(
    `/admin/competitions/${competitionId}/soumissions/${submissionId}/evaluation`,
    { method: 'PUT', body: evaluation },
  ),
}
