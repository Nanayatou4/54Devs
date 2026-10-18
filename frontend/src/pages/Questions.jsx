import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronLeft, ChevronRight,
  CircleHelp, MessageCircle, Plus, Search, Send, SlidersHorizontal, X,
} from 'lucide-react'
import { questionsApi } from '../api'
import { styles } from './Questions.styles'

const PAGE_SIZE = 10

function initials(user) {
  return `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase() || '?'
}

function authorName(user) {
  if (!user) return 'Membre 54Devs'
  return user.pseudo || [user.prenom, user.nom].filter(Boolean).join(' ') || 'Membre 54Devs'
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function QuestionModal({ onClose, onCreated }) {
  const [categories, setCategories] = useState([])
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [categorie, setCategorie] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { questionsApi.categories().then(setCategories).catch(() => {}) }, [])

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (titre.trim().length < 5) return setError('Le titre doit contenir au moins 5 caractères.')
    if (contenu.trim().length < 10) return setError('Ajoutez quelques détails pour aider la communauté à vous répondre.')
    setSaving(true)
    try {
      const question = await questionsApi.creer({ titre: titre.trim(), contenu: contenu.trim(), categorie: categorie.trim() || null })
      onCreated(question)
    } catch (err) {
      setError(err.message || 'La question n\'a pas pu être publiée.')
      setSaving(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <form className={styles.modal} onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="question-modal-title">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono">Communauté</p>
            <h2 id="question-modal-title" className="text-2xl font-bold mt-1 text-white font-display">Poser une question</h2>
            <p className="text-sm text-white/60 mt-2">Donnez assez de contexte pour recevoir des réponses utiles.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="h-9 w-9 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition flex items-center justify-center"><X size={18} /></button>
        </div>
        {error && <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400 mb-4">{error}</p>}
        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono mb-2" htmlFor="question-title">Titre</label>
        <input id="question-title" className={`${styles.field} mb-5`} value={titre} onChange={event => setTitre(event.target.value)} minLength={5} maxLength={150} placeholder="Ex. Comment sécuriser une API Spring Boot ?" required />
        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono mb-2" htmlFor="question-content">Votre question</label>
        <textarea id="question-content" className={`${styles.field} resize-y mb-1`} value={contenu} onChange={event => setContenu(event.target.value)} minLength={10} maxLength={5000} rows={6} placeholder="Expliquez ce que vous cherchez à faire, ce que vous avez essayé et ce qui bloque..." required />
        <p className="text-xs text-white/40 font-mono text-right mb-5">{contenu.length} / 5000</p>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono mb-2" htmlFor="question-category">Catégorie <span className="font-normal text-white/40">(facultatif)</span></label>
        <input id="question-category" className={`${styles.field} mb-6`} list="question-categories" value={categorie} onChange={event => setCategorie(event.target.value)} maxLength={100} placeholder="Ex. Java, Déploiement, UX..." />
        <datalist id="question-categories">{categories.map(category => <option key={category} value={category} />)}</datalist>
        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <button type="button" onClick={onClose} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition">Annuler</button>
          <button type="submit" disabled={saving} className={styles.primaryButton}>{saving ? 'Publication...' : <><Send size={16} /> Publier la question</>}</button>
        </div>
      </form>
    </div>
  )
}

function QuestionsList({ onAsk }) {
  const [questions, setQuestions] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('recentes')
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { questionsApi.categories().then(setCategories).catch(() => {}) }, [])
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    questionsApi.rechercher({ texte: search, categorie: category, resolue: status === '' ? null : status === 'resolues', tri: sort, page, taille: PAGE_SIZE })
      .then(result => {
        if (!active) return
        setQuestions(result?.contenu || [])
        setPageCount(result?.totalPages || 0)
        setTotal(result?.totalElements || 0)
      })
      .catch(err => { if (active) setError(err.message || 'Impossible de charger les questions.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [search, category, status, sort, page, retryCount])

  function submitSearch(event) {
    event.preventDefault()
    setPage(0)
    setSearch(query.trim())
  }

  return (
    <>
      <header className={styles.hero}>
        <div>
          <p className={styles.heroEyebrow}>Questions & réponses</p>
          <h1 className={styles.heroTitle}>Apprenons les uns des autres.</h1>
          <p className={styles.heroText}>Un espace pour partager vos blocages, transmettre votre expérience et construire des solutions avec la communauté.</p>
        </div>
        <button onClick={onAsk} className={styles.askButton}><Plus size={18} /> Poser une question</button>
      </header>

      <div className={styles.layout}>
        <section className={styles.panel} aria-label="Questions de la communauté">
          <form onSubmit={submitSearch} className={styles.toolbar}>
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input className={styles.search} value={query} onChange={event => setQuery(event.target.value)} placeholder="Rechercher une question..." aria-label="Rechercher une question" />
            </div>
            <select className={styles.select} value={sort} onChange={event => { setSort(event.target.value); setPage(0) }} aria-label="Trier les questions">
              <option value="recentes" className="bg-[#16221C] text-white">Plus récentes</option>
              <option value="populaires" className="bg-[#16221C] text-white">Plus de réponses</option>
            </select>
          </form>

          <div className={styles.filters} aria-label="Filtrer par statut">
            {[['', 'Toutes'], ['non-resolues', 'À résoudre'], ['resolues', 'Résolues']].map(([value, label]) => (
              <button key={value} onClick={() => { setStatus(value); setPage(0) }} className={`${styles.filter} ${status === value ? styles.filterActive : styles.filterInactive}`}>{label}</button>
            ))}
            {categories.length > 0 && <label className="ml-auto flex items-center gap-2 text-xs text-white/40 font-mono"><SlidersHorizontal size={14} /><select className="bg-transparent py-2 text-xs font-medium outline-none text-[#C9F06A]" value={category} onChange={event => { setCategory(event.target.value); setPage(0) }} aria-label="Filtrer par catégorie"><option value="" className="bg-[#16221C] text-white">Toutes les catégories</option>{categories.map(item => <option key={item} value={item} className="bg-[#16221C] text-white">{item}</option>)}</select></label>}
          </div>

          {error ? (
            <div className="p-10 text-center"><p className="text-sm text-red-400">{error}</p><button onClick={() => setRetryCount(count => count + 1)} className="mt-3 text-sm font-semibold text-[#C9F06A] hover:underline">Réessayer</button></div>
          ) : loading ? (
            <div className="p-12 text-center text-sm text-white/40 font-mono">Chargement des questions...</div>
          ) : questions.length === 0 ? (
            <div className="p-10 sm:p-14 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#C9F06A]/10 border border-[#C9F06A]/20 text-[#C9F06A]"><CircleHelp size={23} /></div>
              <h2 className="font-bold text-white font-display text-lg">Aucune question pour le moment</h2>
              <p className="text-sm text-white/60 mt-2">Essayez d'autres filtres ou lancez la première discussion.</p>
              <button onClick={onAsk} className={`${styles.askButton} mt-5`}><Plus size={16} /> Poser une question</button>
            </div>
          ) : (
            <div>
              {questions.map(question => <QuestionRow key={question.id} question={question} />)}
              <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between gap-4">
                <span className="text-xs text-white/40 font-mono">{total} question{total === 1 ? '' : 's'}</span>
                <div className="flex items-center gap-2">
                  <button disabled={page <= 0} onClick={() => setPage(page - 1)} className="h-9 w-9 grid place-items-center rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 transition" aria-label="Page précédente"><ChevronLeft size={17} /></button>
                  <span className="text-xs text-white/40 font-mono">{page + 1} / {Math.max(pageCount, 1)}</span>
                  <button disabled={page + 1 >= pageCount} onClick={() => setPage(page + 1)} className="h-9 w-9 grid place-items-center rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 transition" aria-label="Page suivante"><ChevronRight size={17} /></button>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className={`${styles.panel} ${styles.sideCard}`}>
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#C9F06A]/10 border border-[#C9F06A]/20 text-[#C9F06A]"><MessageCircle size={19} /></div>
            <h2 className={styles.sideTitle}>Des échanges qui font avancer</h2>
            <p className={styles.sideText}>Décrivez le contexte, partagez ce que vous avez déjà essayé et restez bienveillant dans vos réponses.</p>
          </div>
          <div className={`${styles.panel} ${styles.sideCard} bg-[#18251E] text-white border-white/10`}>
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><CheckCircle2 size={19} /></div>
            <h2 className="text-sm font-bold text-white font-display">Une réponse a résolu votre problème ?</h2>
            <p className="text-sm text-white/60 leading-relaxed mt-2">Marquez-la comme solution pour aider les prochains membres qui rencontrent le même blocage.</p>
          </div>
        </aside>
      </div>
    </>
  )
}

function QuestionRow({ question }) {
  return (
    <Link to={`/questions/${question.id}`} className={`${styles.questionRow} group`}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {question.categorie && <span className={styles.category}>{question.categorie}</span>}
        {question.resolue && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 text-[11px] font-semibold">
            <Check size={12} /> Résolue
          </span>
        )}
      </div>
      <h2 className={styles.title}>{question.titre}</h2>
      <p className={styles.excerpt}>{question.extrait}</p>
      <div className={styles.metadata}>
        <span className="inline-flex items-center gap-2">
          <span className={styles.avatar}>{initials(question.auteur)}</span>
          <span className="font-medium text-white/80">{authorName(question.auteur)}</span>
        </span>
        <span className="font-mono text-white/40">{formatDate(question.dateCreation)}</span>
        <span className="inline-flex items-center gap-1 text-white/50">
          <MessageCircle size={14} className="text-[#C9F06A]" /> {question.nombreReponses} réponse{question.nombreReponses === 1 ? '' : 's'}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-[#C9F06A] opacity-0 group-hover:opacity-100 transition">
          Lire <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

function QuestionDetail({ id }) {
  const navigate = useNavigate()
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')

  const loadQuestion = useCallback(() => {
    setLoading(true)
    questionsApi.getById(id)
      .then(setQuestion)
      .catch(err => setError(err.message || 'Cette question est introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { loadQuestion() }, [loadQuestion])

  async function submitAnswer(event) {
    event.preventDefault()
    if (answer.trim().length < 1) return setFormError('Écrivez votre réponse avant de l\'envoyer.')
    setSaving(true)
    setFormError('')
    try {
      await questionsApi.repondre(id, answer.trim())
      setAnswer('')
      loadQuestion()
    } catch (err) { setFormError(err.message || 'Votre réponse n\'a pas pu être publiée.') }
    finally { setSaving(false) }
  }

  async function markSolution(responseId) {
    try {
      await questionsApi.marquerSolution(id, responseId)
      loadQuestion()
    } catch (err) { setFormError(err.message || 'Impossible de marquer cette réponse comme solution.') }
  }

  if (loading) return <div className={`${styles.panel} p-12 text-center text-sm text-white/40 font-mono`}>Chargement de la question...</div>
  if (error || !question) return <div className={`${styles.panel} p-10 text-center`}><p className="text-sm text-red-400">{error || 'Question introuvable.'}</p><button onClick={() => navigate('/questions')} className="mt-4 text-sm font-semibold text-[#C9F06A] hover:underline">Retour aux questions</button></div>

  return (
    <>
      <Link to="/questions" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-[#C9F06A] mb-5 transition"><ArrowLeft size={16} /> Toutes les questions</Link>
      <article className={`${styles.panel} ${styles.detailCard}`}>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {question.categorie && <span className={styles.category}>{question.categorie}</span>}
          {question.resolue && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 text-[11px] font-semibold"><Check size={12} /> Résolue</span>}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">{question.titre}</h1>
        <div className={`${styles.metadata} mt-4 pb-5 border-b border-white/10`}>
          <span className="inline-flex items-center gap-2"><span className={styles.avatar}>{initials(question.auteur)}</span><span className="font-medium text-white/80">{authorName(question.auteur)}</span></span>
          <span className="font-mono text-white/40">{formatDate(question.dateCreation)}</span>
        </div>
        <p className="whitespace-pre-wrap text-white/80 leading-7 py-6">{question.contenu}</p>
      </article>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-white font-display">Réponses <span className="text-white/40 font-mono">({question.reponses?.length || 0})</span></h2>
        </div>
        <div className="space-y-3">
          {question.reponses?.length ? question.reponses.map(response => (
            <article key={response.id} className={`${styles.panel} ${styles.answerCard} ${response.solution ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
              {response.solution && <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 text-xs font-bold mb-3"><CheckCircle2 size={14} /> Solution</div>}
              <p className="whitespace-pre-wrap text-sm text-white/80 leading-6">{response.contenu}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2"><span className={styles.avatar}>{initials(response.auteur)}</span><span className="text-sm font-semibold text-white/80">{authorName(response.auteur)}</span><span className="text-xs text-white/40 font-mono">· {formatDate(response.dateCreation)}</span></div>
                {question.estAuteur && !question.resolue && <button onClick={() => markSolution(response.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"><CheckCircle2 size={15} /> Choisir comme solution</button>}
              </div>
            </article>
          )) : <div className={`${styles.panel} p-6 text-center text-sm text-white/40`}>Pas encore de réponse. Vous pouvez ouvrir la discussion.</div>}
        </div>
      </section>

      {!question.resolue && <form onSubmit={submitAnswer} className={`${styles.panel} p-5 sm:p-6 mt-6`}>
        <h2 className="font-bold text-white font-display mb-3 text-lg">Votre réponse</h2>
        {formError && <p className="mb-3 text-sm text-red-400">{formError}</p>}
        <textarea className={`${styles.field} resize-y`} rows={4} maxLength={5000} value={answer} onChange={event => setAnswer(event.target.value)} placeholder="Partagez une réponse claire et bienveillante..." />
        <div className="mt-4 flex justify-end"><button disabled={saving || !answer.trim()} className={styles.primaryButton}>{saving ? 'Envoi...' : <><Send size={16} /> Publier ma réponse</>}</button></div>
      </form>}
    </>
  )
}

export default function Questions() {
  const { id } = useParams()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {id ? <QuestionDetail key={id} id={id} /> : <QuestionsList onAsk={() => setShowModal(true)} />}
      </main>
      {showModal && <QuestionModal onClose={() => setShowModal(false)} onCreated={question => { setShowModal(false); navigate(`/questions/${question.id}`) }} />}
    </div>
  )
}
