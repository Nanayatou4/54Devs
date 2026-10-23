import { apiRequest } from './client'

/** API pour les compétences */
export const competencesApi = {
  lister: (categorie) => {
    const q = categorie?.trim() ? `?categorie=${encodeURIComponent(categorie.trim())}` : ''
    return apiRequest(`/competences${q}`)
  },
  creer: (nom, categorie = 'Autre') => {
    return apiRequest('/competences', {
      method: 'POST',
      body: { nom: nom.trim(), categorie },
    })
  },
}
