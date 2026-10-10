import { Link } from 'react-router-dom'
import { styles } from './Hero.styles'

export default function Hero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <span className={styles.badge}>
              Built for Africa, by Africa
            </span>
            <h1 className={styles.title}>
              Connect. Learn.
              <br />
              <span className={styles.titleHighlight}>Build across
              Africa.</span>
            </h1>
            <p className={styles.subtitle}>
              The pan-African ecosystem where developers move from individual talent to collective creation. Join 54 nations in building the future.
            </p>
            <div className={styles.buttonsRow}>
              <Link to="/register" className={styles.primaryButton}>
                Create Identity
              </Link>
              <Link to="/projects" className={styles.secondaryButton}>
                Explore Projects
              </Link>
            </div>
          </div>

          <div className={styles.imageWrapper}>
            <img
              src="/image.png"
              alt="African developers collaborating"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
