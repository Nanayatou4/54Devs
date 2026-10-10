import { ArrowRight } from 'lucide-react'
import { styles } from './Features.styles'
import { FEATURES } from './Features.data'

export default function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>The 54Devs Core Ecosystem</h2>
        <p className={styles.subtitle}>
          Moving from individual talent to collective creation across 54 nations.
        </p>
        <div className={styles.grid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.card}>
              <div className={`${styles.iconContainer} ${f.iconBg}`}>
                <f.icon size={24} className={f.iconColor} />
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
              <a href="#" className={styles.featureLink}>
                {f.link} <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
