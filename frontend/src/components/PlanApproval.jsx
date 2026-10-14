import { useState, useEffect } from 'react'
import { ShieldCheck, CheckCircle2, FileEdit, Check, ArrowRight, Sparkles, FolderPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projetsApi, publicApi } from '../api'

export default function PlanApproval() {
  const [approved, setApproved] = useState(false)
  const [latestProject, setLatestProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchProject = async () => {
      try {
        const res = await publicApi.projets(1)
        const list = Array.isArray(res) ? res : res?.contenu || []
        if (active && list.length > 0) {
          setLatestProject(list[0])
        }
      } catch {
        try {
          const res = await projetsApi.rechercher({ page: 0, taille: 1 })
          const list = Array.isArray(res) ? res : res?.contenu || []
          if (active && list.length > 0) {
            setLatestProject(list[0])
          }
        } catch {
          // ignore error
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchProject()
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="plan-revision" className="bg-[#101915] py-24 border-t border-white/5 relative overflow-hidden font-body">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#C9F06A]/15 border border-[#C9F06A]/30 flex items-center justify-center text-[#C9F06A] mb-6">
              <ShieldCheck size={26} />
            </div>
            
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9F06A] mb-2 font-mono">
              // GOUVERNANCE & QUALITÃ‰ LOGICIELLE
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display mb-5">
              Validation collaborative des architectures
            </h2>
            
            <p className="text-white/70 text-base leading-relaxed mb-8">
              Rationalisez la maturation de vos solutions. Les porteurs de projets et mentors valident les spécifications techniques et jalons pour garantir la robustesse et l'impact de vos créations à travers les 54 nations.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-white/80 text-sm">
                <CheckCircle2 size={18} className="text-[#C9F06A] shrink-0 mt-0.5" />
                <span>Indicateurs de statut synchronisés en temps réel avec le backend</span>
              </li>
              <li className="flex items-start gap-3 text-white/80 text-sm">
                <CheckCircle2 size={18} className="text-[#C9F06A] shrink-0 mt-0.5" />
                <span>Retours d'expérience et conseils d'optimisation par les mentors</span>
              </li>
              <li className="flex items-start gap-3 text-white/80 text-sm">
                <CheckCircle2 size={18} className="text-[#C9F06A] shrink-0 mt-0.5" />
                <span>Intégration d'équipe fluide et répartition transparente des rôles</span>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2.5 bg-[#C9F06A] hover:bg-[#D8F87C] text-black px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#C9F06A]/20"
              >
                <FileEdit size={16} />
                <span>Consulter les projets</span>
              </Link>
              <Link
                to="/projects/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition"
              >
                <span>Proposer un projet</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Dynamic Interactive Project Review Preview */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#C9F06A]/20 to-amber-600/10 rounded-3xl blur-2xl opacity-60" />
            
            <div className="relative bg-[#16221C]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              {latestProject ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9F06A]">
                      Projet réel enregistré
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      approved 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#C9F06A]/15 text-[#C9F06A] border border-[#C9F06A]/30'
                    }`}>
                      {approved ? 'VALIDÃ‰ PAR LES MENTORS' : (latestProject.statut || 'EN COURS DE REVUE')}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg sm:text-xl font-display mb-2">
                    {latestProject.titre}
                  </h3>

                  <p className="text-white/70 text-xs sm:text-sm line-clamp-3 mb-6 leading-relaxed">
                    {latestProject.description || 'Projet soumis sur la plateforme 54Devs pour la compétition panafricaine.'}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-6 bg-[#18251E] p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-mono">
                      <span>Progression de la revue technique</span>
                      <span className="font-bold text-[#C9F06A]">{approved ? '100%' : 'En évaluation'}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#C9F06A] to-amber-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: approved ? '100%' : '75%' }}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setApproved(!approved)}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C9F06A] hover:bg-[#D8F87C] text-black font-bold uppercase tracking-wider py-3 px-5 rounded-xl text-xs transition-all shadow-md shadow-[#C9F06A]/20"
                    >
                      <Check size={16} />
                      <span>{approved ? 'Statut : Validé' : 'Simuler une validation'}</span>
                    </button>
                    <Link
                      to={`/projects/${latestProject.id}`}
                      className="inline-flex items-center justify-center bg-[#18251E] hover:bg-white/10 text-white font-semibold py-3 px-5 rounded-xl text-xs border border-white/10 transition-all"
                    >
                      Voir le détail
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#C9F06A]/15 border border-[#C9F06A]/30 flex items-center justify-center text-[#C9F06A] mx-auto mb-4">
                    <FolderPlus size={28} />
                  </div>
                  <h3 className="text-white font-bold text-lg font-display mb-2">
                    Aucun projet en attente de revue
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm max-w-sm mx-auto mb-6">
                    Enregistrez votre premier projet depuis votre espace pour déclencher le processus d'évaluation et de collaboration.
                  </p>
                  <Link
                    to="/projects/create"
                    className="inline-flex items-center gap-2 bg-[#C9F06A] hover:bg-[#D8F87C] text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#C9F06A]/20"
                  >
                    <span>Créer le premier projet</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
