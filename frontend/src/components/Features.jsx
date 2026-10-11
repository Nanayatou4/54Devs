import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { styles } from './Features.styles'
import { FEATURES } from './Features.data'

export default function Features() {
  return (
    <section id="fonctionnement" className={styles.section}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>Comment ça marche</p>
        <h2 className={styles.title}>Une idée, les bonnes personnes, un projet concret.</h2>
        <p className={styles.subtitle}>
          Que vous codiez, conceviez, organisiez ou apportiez une idée, vous avez votre place dans l’équipe.
        </p>
        <div className={styles.grid}>
          {FEATURES.map(f => (
            <article key={f.title} className={styles.card}>
              <div className={`${styles.iconContainer} ${f.iconBg}`}>
                <f.icon size={24} className={f.iconColor} />
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
              <Link to={f.to} className={styles.featureLink}>
                {f.link} <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
