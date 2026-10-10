import { Link } from 'react-router-dom'
import { styles } from './CTA.styles'

export default function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Ready to Build for Africa?
        </h2>
        <p className={styles.subtitle}>
          Join the CADEV 2026 movement today. Create your Identity and find your team.
        </p>
        <div className={styles.buttonsRow}>
          <Link to="/register" className={styles.primaryButton}>
            Join 54Devs
          </Link>
          <Link to="/projects" className={styles.secondaryButton}>
            Review Active Plans
          </Link>
        </div>
      </div>
    </section>
  )
}
