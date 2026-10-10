import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { projetsApi, getToken, STATUT_PROJET } from '../api'
import { styles } from './Projects.styles'
import { STATUT_COLORS } from './Projects.data'

export default function Projects() {
  const token = getToken()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(!!token)
  const [erreur, setErreur] = useState('')

  function charger() {
    setLoading(true)
    setErreur('')
    projetsApi
      .rechercher({ taille: 3 })
      .then(data => setProjects(data?.contenu || []))
      .catch(err => setErreur(err.message || 'Impossible de charger les projets.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // Le back exige d'être connecté pour lister les projets.
    if (token) charger()
  }, [token])

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Découvrez de vrais projets</h2>
            <p className={styles.subtitle}>
              Parcourez les projets, rejoignez une équipe et commencez à construire.
              De l'idée au lancement, chaque étape est accompagnée.
            </p>
          </div>
          <Link to={token ? '/projects' : '/login'} className={styles.viewAllButton}>
            {token ? 'Voir tous les projets' : 'Se connecter'}
          </Link>
        </div>

        {!token ? (
          <div className={styles.emptyStateWrapper}>
            <p className={styles.emptyStateTextAlt}>
              Connectez-vous pour découvrir les projets de la communauté.
            </p>
            <Link to="/register" className={styles.emptyStateLink}>
              Créer un compte
            </Link>
          </div>
        ) : loading ? (
          <div className={styles.loadingWrapper}>
            <Loader2 size={28} className={styles.loadingIcon} />
          </div>
        ) : erreur ? (
          <div className={styles.emptyStateWrapper}>
            <p className={styles.emptyStateTextAlt}>{erreur}</p>
            <button onClick={charger} className={styles.emptyStateLink}>Réessayer</button>
          </div>
        ) : projects.length > 0 ? (
          <div className={styles.grid}>
            {projects.map(p => (
              <div key={p.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={`${styles.statusBadge} ${STATUT_COLORS[p.statut] || styles.statusBadgeFallback}`}>
                    {STATUT_PROJET[p.statut] || p.statut}
                  </span>
                  <span className={styles.techTag}>
                    {p.nombreMembres} membre{p.nombreMembres > 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{p.nom}</h3>
                <p className={styles.cardDescription}>{p.description}</p>
                <div className={styles.techTagsRow}>
                  {(p.technologies || '').split(',').filter(t => t.trim()).slice(0, 3).map(tag => (
                    <span key={tag.trim()} className={styles.techTag}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <Link to={`/projects/${p.id}`} className={styles.ctaButton}>
                  Voir le projet
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyStateWrapper}>
            <p className={styles.emptyStateTextAlt}>Aucun projet pour l'instant. Soyez le premier à en publier un !</p>
            <Link to="/projects/create" className={styles.emptyStateLink}>
              Publier un projet
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
