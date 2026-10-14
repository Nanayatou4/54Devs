import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2, MapPin, Users, Sparkles } from 'lucide-react'
import { getToken, publicApi, STATUT_PROJET } from '../api'
import { styles } from './Projects.styles'

const FALLBACK_PROJECTS = [
  {
    id: 1,
    nom: 'AgroTech Hub Kenya',
    statut: 'EN_DEVELOPPEMENT',
    statutLabel: 'IN DEVELOPMENT',
    badgeColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
    extrait: 'Mise en relation des petits exploitants agricoles avec des marchés directs via la traçabilité blockchain.',
    technologies: 'React, Django, Python',
    nombreMembres: 6,
    placesRestantes: 2,
    cta: 'Rejoindre l\'équipe',
  },
  {
    id: 2,
    nom: 'EduFree Pan-Africa',
    statut: 'IDEE',
    statutLabel: 'IDEA STAGE',
    badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    extrait: 'Système d\'apprentissage offline-first adapté aux écoles rurales et zones à faible connectivité en Afrique.',
    technologies: 'Flutter, Go',
    nombreMembres: 3,
    placesRestantes: 4,
    cta: 'Soutenir le projet',
  },
  {
    id: 3,
    nom: 'SolarPay Nigeria',
    statut: 'LANCEMENT',
    statutLabel: 'LAUNCHING',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    extrait: 'Infrastructure de micro-paiement mobile pour les installations solaires résidentielles en Afrique de l\'Ouest.',
    technologies: 'Java, Spring Boot, AWS',
    nombreMembres: 8,
    placesRestantes: 1,
    cta: 'Voir les postes',
  },
]

export default function Projects() {
  const token = getToken()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    publicApi.projets(6)
      .then(data => {
        if (active) {
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data)
          } else {
            setProjects(FALLBACK_PROJECTS)
          }
        }
      })
      .catch(() => {
        if (active) setProjects(FALLBACK_PROJECTS)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const displayList = projects.length > 0 ? projects : FALLBACK_PROJECTS

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Discover Real Projects</h2>
            <p className={styles.subtitle}>
              Parcourez les défis, rejoignez des équipes et commencez à construire. De l'idée au lancement, chaque étape est soutenue.
            </p>
          </div>
          <Link to="/projects" className={styles.viewAllButton}>
            Voir tous les projets
            <ArrowRight size={16} className="ml-2 inline" />
          </Link>
        </div>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <Loader2 size={32} className={styles.loadingIcon} />
          </div>
        ) : (
          <div className={styles.grid}>
            {displayList.slice(0, 3).map(project => {
              const techList = (project.technologies || '')
                .split(',')
                .map(v => v.trim())
                .filter(Boolean)

              return (
                <article key={project.id} className={styles.card}>
                  <div>
                    <div className={styles.cardTop}>
                      <span className={`${styles.statusBadge} ${project.badgeColor || styles.statusBadgeFallback}`}>
                        {project.statutLabel || STATUT_PROJET[project.statut] || project.statut}
                      </span>
                      {project.placesRestantes > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {project.placesRestantes} place{project.placesRestantes > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <h3 className={styles.cardTitle}>{project.nom}</h3>
                    <p className={styles.cardDescription}>{project.extrait || project.description}</p>
                  </div>

                  <div>
                    {techList.length > 0 && (
                      <div className={styles.techTagsRow}>
                        {techList.slice(0, 4).map(tech => (
                          <span key={tech} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link to={`/projects/${project.id}`} className={styles.ctaButton}>
                      <span>{project.cta || 'Voir le projet'}</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
