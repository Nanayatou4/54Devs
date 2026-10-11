import { Link } from 'react-router-dom'
import { styles } from './Hero.styles'

export default function Hero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <span className={styles.badge}>
              Développeurs · designers · porteurs d’idées
            </span>
            <h1 className={styles.title}>
              Les bonnes idées
              <br />
              prennent vie ensemble.
            </h1>
            <p className={styles.subtitle}>
              54Devs met en relation les personnes qui veulent créer des projets numériques, partager leurs compétences et apprendre en équipe.
            </p>
            <div className={styles.buttonsRow}>
              <Link to="/register" className={styles.primaryButton}>
                Créer mon compte
              </Link>
              <Link to="/projects" className={styles.secondaryButton}>
                Découvrir les projets
              </Link>
            </div>
          </div>

          <div className={styles.imageWrapper}>
            <img
              src="/image.png"
              alt="Une équipe échange autour d’un projet numérique"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
