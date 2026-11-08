import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { CHAPTERS, VOLUMES } from '../data/chapters'
import { GARMENTS } from '../data/garments'
import { preset } from '../data/presets'
import { STYLES, style } from '../data/styles'
import { useStore } from '../lib/store'
import { ARCHIVE, archiveHref } from '../data/archive'
import { archiveSrc, Ornament, Plate, useTitle } from '../ui/bits'

const CONTENTS = [
  { to: '/handbook', title: 'The Handbook', note: `${CHAPTERS.length} illustrated chapters on fit, colour, proportion and occasion`, n: CHAPTERS.length },
  { to: '/studio', title: 'The Outfit Studio', note: 'Dress the figure and read why each choice works', n: 'Plate' },
  { to: '/encyclopedia', title: 'The Encyclopedia', note: `${GARMENTS.length} garments, from the button-down to the opera pump`, n: GARMENTS.length },
  { to: '/atlas', title: 'The Style Atlas', note: `${STYLES.length} traditions and how they borrow from one another`, n: STYLES.length },
  { to: '/practice', title: 'The Practice Room', note: 'Exercises for the eye, with explanations', n: 5 },
]
const STRIP: [string, string][] = [['ivy-campus', 'ivy'], ['workwear-layers', 'workwear'], ['mod-sharp', 'mod'], ['amekaji', 'japanese-americana'], ['riviera', 'italian']]
const ease = [0.23, 1, 0.32, 1] as const

export default function Home() {
  const { data } = useStore()
  useTitle('')
  const cover = preset('winter-dinner')!
  const resume = CHAPTERS.find(c => (data.progress[c.id] ?? 0) > 0 && (data.progress[c.id] ?? 0) < 1)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <section className="grid gap-10 pt-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-14 md:pt-14">
        <div>
          <div className="rule-double flex justify-between pt-2 font-sans text-xs uppercase tracking-[0.18em] text-ink-2">
            <span className="whitespace-nowrap">Vol. I–IV</span><span className="hidden sm:inline">An illustrated handbook</span><span>Free edition</span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mt-4 text-[clamp(4.5rem,15vw,11rem)] leading-[0.85] tracking-[-0.03em]">Fashone</motion.h1>
          <p className="mt-4 max-w-lg font-display text-2xl leading-snug sm:text-3xl">The illustrated handbook of men's style</p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-2">How clothes fit, why colours sit well together and what each occasion asks of you. Explained plainly, drawn by hand, and open to experiment.</p>

          <nav aria-label="Contents" className="mt-10">
            <h2 className="border-b border-ink pb-1.5 font-display text-2xl">Contents</h2>
            <ol>
              {CONTENTS.map((c, i) => (
                <motion.li key={c.to} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.05, ease }} className="border-b border-rule">
                  <Link to={c.to} className="group flex items-baseline gap-3 py-3">
                    <span className="w-6 font-display text-ink-2">{i + 1}.</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-2xl leading-tight transition-colors group-hover:text-accent">{c.title}</span>
                      <span className="block text-[0.95rem] text-ink-2">{c.note}</span>
                    </span>
                    <span className="font-display text-xl italic text-brass">{c.n}</span>
                  </Link>
                </motion.li>
              ))}
            </ol>
          </nav>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }} className="md:pt-10">
          <Plate
            outfit={cover.outfit} title={`Fashion plate: ${cover.name}`}
            figClass="mx-auto aspect-[280/1000] max-h-[70vh] w-full px-10 pt-6"
            caption={<>Plate I. {cover.name}. {cover.note} <Link to={`/studio?preset=${cover.id}`} className="xref not-italic">Dress this figure →</Link></>}
          />
        </motion.div>
      </section>

      {resume && (
        <p className="mt-10 border-y border-rule py-3 text-center">You were reading <Link to={`/handbook/${resume.id}`} className="xref font-display text-lg">{resume.title}</Link> — {Math.round((data.progress[resume.id] ?? 0) * 100)}% through.</p>
      )}

      <section aria-labelledby="strip-h" className="mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="strip-h" className="text-4xl">Five ways of dressing</h2>
          <Link to="/atlas" className="xref">All {STYLES.length} traditions in the Atlas</Link>
        </div>
        <Ornament className="mx-0 mt-3" />
        <ol className="mt-6 flex snap-x gap-5 overflow-x-auto pb-3 md:grid md:grid-cols-5 md:overflow-visible">
          {STRIP.map(([p, s], i) => {
            const pr = preset(p)!, st = style(s)!
            return (
              <li key={p} className="w-40 shrink-0 snap-start md:w-auto">
                <Link to={`/atlas/${s}`} className="group block">
                  <Plate outfit={pr.outfit} figClass="aspect-[280/1000] w-full px-4 pt-3 transition-transform duration-300 ease-out group-hover:-translate-y-1" />
                  <span className="mt-2 block font-display text-sm text-ink-2">Fig. {i + 2}</span>
                  <span className="block font-display text-xl leading-tight group-hover:text-accent">{st.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-2">{st.era}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="arch-h" className="mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="arch-h" className="text-4xl">From the archive</h2>
          <Link to="/credits" className="xref">Image sources & credits</Link>
        </div>
        <Ornament className="mx-0 mt-3" />
        <p className="mt-4 max-w-2xl text-ink-2">Period photographs, fashion plates and advertisements, each public domain or openly licensed, set beside the chapters and garments they illustrate.</p>
        <ul className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3">
          {ARCHIVE.filter(a => a.usage.home).map(a => (
            <li key={a.id}>
              <Link to={archiveHref(a)} className="group block">
                <div className="plate aspect-[4/5] p-2.5"><img src={archiveSrc(a)} alt={a.alt} width={a.width} height={a.height} loading="lazy" decoding="async" className="archive-img h-full w-full object-contain" /></div>
                <span className="mt-2 block font-display text-lg leading-tight group-hover:text-accent">{a.title}</span>
                <span className="block text-sm text-ink-2">{a.date} · {a.creator}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="vol-h"className="mt-20 grid gap-8 md:grid-cols-[18rem_1fr]">
        <div>
          <h2 id="vol-h" className="text-4xl">Begin reading</h2>
          <p className="mt-3 text-ink-2">Start at the beginning, or open any volume. Every chapter links to the garments, styles and exercises it mentions.</p>
          <Link to={`/handbook/${CHAPTERS[0].id}`} className="btn btn-primary mt-5">Chapter 1: {CHAPTERS[0].title} <ArrowRight size={15} aria-hidden /></Link>
        </div>
        <ol className="grid gap-px bg-rule sm:grid-cols-2">
          {VOLUMES.map(v => (
            <li key={v.n} className="bg-paper">
              <Link to={`/handbook#vol-${v.n}`} className="group block h-full p-5 hover:bg-paper-3">
                <span className="block font-display text-3xl group-hover:text-accent"><span className="text-brass">{['I', 'II', 'III', 'IV'][v.n - 1]}</span> {v.title}</span>
                <span className="mt-1 block text-ink-2">{v.note}</span>
                <span className="mt-3 block text-sm">{CHAPTERS.filter(c => c.volume === v.n).map(c => c.title).join(' · ')}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
