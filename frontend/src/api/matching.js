import { apiRequest } from './client'

export const matchingApi = {
  projetsRecommandes: (limite = 10) =>
    apiRequest(`/projets/recommandes?limite=${limite}`),

  developpeursPourProjet: (projetId, limite = 10) =>
    apiRequest(`/projets/${projetId}/developpeurs-recommandes?limite=${limite}`),

  echangesCompetences: (limite = 10) =>
    apiRequest(`/echanges-competences?limite=${limite}`),
}
