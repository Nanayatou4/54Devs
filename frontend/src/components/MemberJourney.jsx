import { useState } from 'react'
import { ArrowRight, BriefcaseBusiness, CircleHelp, UserRoundSearch } from 'lucide-react'
import { Link } from 'react-router-dom'

const stages = [
  {
    label: 'Rencontrer',
    title: 'Commencez par trouver les bonnes personnes.',
    text: 'Parcourez les profils de développeurs et repérez des compétences ou des disponibilités qui correspondent à votre idée.',
    action: 'Explorer les développeurs',
    to: '/developers',
    icon: UserRoundSearch,
    marker: 'Profils',
  },
  {
    label: 'Échanger',
    title: 'Faites circuler les idées et les savoirs.',
    text: 'Posez une question technique, proposez une réponse et apprenez au fil des échanges avec la communauté.',
    action: 'Rejoindre les échanges',
    to: '/questions',
    icon: CircleHelp,
    marker: 'Questions',
  },
  {
    label: 'Construire',
    title: 'Donnez une prochaine étape à votre idée.',
    text: 'Découvrez les projets publiés, voyez les compétences recherchées et rejoignez une initiative qui vous motive.',
    action: 'Découvrir les projets',
    to: '/projects',
    icon: BriefcaseBusiness,
    marker: 'Projets',
  },
]

export default function MemberJourney() {
  const [active, setActive] = useState(0)
  const stage = stages[active]
  const Icon = stage.icon

  return (
    <section className="relative isolate overflow-hidden bg-[#101915] py-20 text-[#F3F0E8] sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-[#C9F06A]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-1/2 h-[25rem] w-[25rem] -translate-y-1/2 rounded-full border border-[#C9F06A]/10" />
      <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9F06A]"><span className="h-2 w-2 rounded-full bg-[#C9F06A]" /> Un parcours à votre rythme</p>
          <h2 className="max-w-lg text-4xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-5xl">Une communauté prend vie dans les échanges.</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-[#C5CEC7]">Il n’y a pas une seule façon de participer. Découvrez des profils, posez une question ou rejoignez un projet selon ce que vous cherchez aujourd’hui.</p>
          <div className="mt-9 flex flex-wrap gap-2" role="tablist" aria-label="Étapes pour participer à 54Devs">
            {stages.map((item, index) => <button key={item.label} type="button" role="tab" id={`journey-tab-${index}`} aria-selected={index === active} aria-controls="journey-panel" onClick={() => setActive(index)} className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9F06A] motion-reduce:transition-none ${index === active ? 'border-[#C9F06A] bg-[#C9F06A] text-[#101915]' : 'border-white/20 text-white/75 hover:border-white/50 hover:text-white'}`}>{item.label}</button>)}
          </div>
        </div>

        <div className="relative min-h-[370px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#18231D] p-6 sm:min-h-[400px] sm:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(201,240,106,0.12),transparent_45%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute right-[-5rem] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-[#C9F06A]/15 sm:right-[-2rem] sm:h-80 sm:w-80">
            <span className="absolute left-[15%] top-[18%] h-3 w-3 rounded-full bg-[#C9F06A] shadow-[0_0_24px_6px_rgba(201,240,106,0.25)] motion-safe:animate-[orbit-pulse_3s_ease-in-out_infinite]" />
            <span className="absolute bottom-[18%] right-[13%] h-2 w-2 rounded-full bg-[#C9F06A]/70" />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute right-[-1rem] top-1/2 h-44 w-44 -translate-y-1/2 rounded-full border border-dashed border-white/10 motion-safe:animate-[slow-spin_40s_linear_infinite] sm:right-[2rem] sm:h-56 sm:w-56" />
          <div key={active} id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${active}`} className="relative z-10 flex min-h-[310px] max-w-lg flex-col justify-between motion-safe:animate-[fade-in_300ms_ease-out]">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C9F06A] text-[#101915]"><Icon size={22} /></span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9F06A]">Étape 0{active + 1} · {stage.marker}</span>
              </div>
              <h3 className="mt-8 max-w-md text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">{stage.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#C5CEC7] sm:text-base">{stage.text}</p>
            </div>
            <Link to={stage.to} className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-[#C9F06A] hover:bg-[#C9F06A] hover:text-[#101915] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9F06A] motion-reduce:transition-none">
              {stage.action} <ArrowRight size={16} />
            </Link>
          </div>
          <div aria-hidden="true" className="absolute bottom-5 right-6 flex gap-1.5 sm:bottom-8 sm:right-10">{stages.map((item, index) => <span key={item.label} className={`h-1 rounded-full transition-all ${index === active ? 'w-8 bg-[#C9F06A]' : 'w-2 bg-white/25'}`} />)}</div>
        </div>
      </div>
    </section>
  )
}
