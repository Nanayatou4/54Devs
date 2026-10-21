import { apiRequest } from './client'

export const invitationsApi = {
  mesInvitations: (statut) => {
    const q = statut ? `?statut=${encodeURIComponent(statut)}` : ''
    return apiRequest(`/invitations/mes-invitations${q}`)
  },

  repondre: (id, decision, engagementAccepte) =>
    apiRequest(`/invitations/${id}`, {
      method: 'PATCH',
      body: { decision, ...(decision === 'ACCEPTEE' ? { engagementAccepte: Boolean(engagementAccepte) } : {}) },
    }),
}
