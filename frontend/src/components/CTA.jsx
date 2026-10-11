import { Link } from 'react-router-dom'
import { styles } from './CTA.styles'

export default function CTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Vous avez une idée à faire grandir ?
        </h2>
        <p className={styles.subtitle}>
          Rejoignez 54Devs et trouvez des personnes avec qui la concrétiser.
        </p>
        <div className={styles.buttonsRow}>
          <Link to="/register" className={styles.primaryButton}>
            Créer mon compte
          </Link>
          <Link to="/projects" className={styles.secondaryButton}>
            Voir les projets
          </Link>
        </div>
      </div>
    </section>
  )
}
