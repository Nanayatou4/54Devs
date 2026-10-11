import { Link } from 'react-router-dom'
import { styles } from './Footer.styles'
import { PLATFORM_LINKS } from './Footer.data'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className="md:col-span-2">
            <Link to="/" className={styles.logoWrapper}>
              <span className={styles.logoIcon}>&lt;/&gt;</span>{' '}
              <span className="font-extrabold">54Devs</span>
            </Link>
            <p className={styles.description}>
              Un espace d’échange pour réunir les personnes qui veulent imaginer, construire et faire avancer des projets.
            </p>
          </div>

          <div>
            <h4 className={styles.sectionTitle}>Explorer</h4>
            <ul className={styles.linkList}>
              {PLATFORM_LINKS.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className={styles.link}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            &copy; 2026 54Devs
          </p>
        </div>
      </div>
    </footer>
  )
}
