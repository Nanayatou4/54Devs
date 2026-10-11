import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2, MapPin, Users } from 'lucide-react'
import { getToken, publicApi, STATUT_PROJET } from '../api'
import { styles } from './Projects.styles'
import { STATUT_COLORS } from './Projects.data'

export default function Projects() {
  const token = getToken()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setErreur('')
    publicApi.projets(6)
      .then(data => { if (active) setProjects(Array.isArray(data) ? data : []) })
      .catch(err => { if (active) setErreur(err.message || 'Impossible de charger les projets publics.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [retry])

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Des idées à faire avancer ensemble</h2>
            <p className={styles.subtitle}>Découvrez les projets de la communauté, rejoignez une équipe ou partagez votre propre idée.</p>
          </div>
          <Link to={token ? '/projects' : '/register'} className={styles.viewAllButton}>Voir tous les projets</Link>
        </div>

        {loading ? <div className={styles.loadingWrapper}><Loader2 size={28} className={styles.loadingIcon} /></div>
          : erreur ? <div className={styles.emptyStateWrapper}><p className={styles.emptyStateTextAlt}>{erreur}</p><button onClick={() => setRetry(value => value + 1)} className={styles.emptyStateLink}>Réessayer</button></div>
            : projects.length ? <div className={styles.grid}>
              {projects.map(project => <article key={project.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={`${styles.statusBadge} ${STATUT_COLORS[project.statut] || styles.statusBadgeFallback}`}>{STATUT_PROJET[project.statut] || project.statut}</span>
                  {project.categorie && <span className={styles.techTag}>{project.categorie}</span>}
                </div>
                <h3 className={styles.cardTitle}>{project.nom}</h3>
                <p className={styles.cardDescription}>{project.extrait}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                  <span className="inline-flex items-center gap-1"><Users size={13} />{project.nombreMembres} membre{project.nombreMembres === 1 ? '' : 's'}</span>
                  {project.placesRestantes > 0 && <span className="text-emerald-300">{project.placesRestantes} place{project.placesRestantes === 1 ? '' : 's'} restante{project.placesRestantes === 1 ? '' : 's'}</span>}
                </div>
                {(project.technologies || '').split(',').map(value => value.trim()).filter(Boolean).length > 0 && <div className={styles.techTagsRow}>
                  {(project.technologies || '').split(',').map(value => value.trim()).filter(Boolean).slice(0, 3).map(technology => <span key={technology} className={styles.techTag}>{technology}</span>)}
                </div>}
                {project.competencesRecherchees?.length > 0 && <div className="flex flex-wrap gap-2 mb-5">{project.competencesRecherchees.slice(0, 3).map(skill => <span key={skill} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-gray-400">{skill}</span>)}</div>}
                {(project.createurPseudo || project.createurPays) && <p className="text-xs text-gray-500 mb-4">Par {project.createurPseudo || 'un membre'}{project.createurPays ? <span className="inline-flex items-center gap-1 ml-2"><MapPin size={12} />{project.createurPays}</span> : null}</p>}
                <Link to={`/projects/${project.id}`} className={styles.ctaButton}>Voir le projet <ArrowRight size={15} className="inline ml-1" /></Link>
              </article>)}
            </div> : <div className={styles.emptyStateWrapper}><p className={styles.emptyStateTextAlt}>Aucun projet public pour le moment.</p><Link to={token ? '/projects/create' : '/register'} className={styles.emptyStateLink}>{token ? 'Publier un projet' : 'Créer un compte'}</Link></div>}
      </div>
    </section>
  )
}
