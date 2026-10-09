import { apiRequest } from './client'

/** GET/PUT /api/profil/moi et compétences */
export const profilApi = {
  getMonProfil: () => apiRequest('/profil/moi'),

  updateMonProfil: (body) => apiRequest('/profil/moi', { method: 'PUT', body }),

  getMesCompetences: () => apiRequest('/profil/moi/competences'),

  replaceMesCompetences: (body) =>
    apiRequest('/profil/moi/competences', { method: 'PUT', body }),
}
