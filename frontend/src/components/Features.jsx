import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { styles } from './Features.styles'
import { FEATURES } from './Features.data'

export default function Features() {
  return (
    <section id="ecosysteme" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>L'écosystème central 54Devs</h2>
        <p className={styles.subtitle}>
          Passer du talent individuel à la création collective à travers 54 nations.
        </p>
        <div className={styles.grid}>
          {FEATURES.map(f => (
            <article key={f.title} className={styles.card}>
              <div>
                <div className={`${styles.iconContainer} ${f.iconBg}`}>
                  <f.icon size={26} className={f.iconColor} />
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDescription}>{f.description}</p>
              </div>
              <Link to={f.to} className={styles.featureLink}>
                <span>{f.link}</span>
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
