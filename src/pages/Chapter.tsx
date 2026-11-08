import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { motion, useScroll, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router'
import { CHAPTERS, VOLUMES, chapter } from '../data/chapters'
import { garment } from '../data/garments'
import { style } from '../data/styles'
import type { Block } from '../data/types'
import { Rich } from '../lib/inline'
import { useStore } from '../lib/store'
import { archiveFor } from '../data/archive'
import { ArchivePlate, BookmarkButton, Crumbs, Ornament, useTitle } from '../ui/bits'
import { Demo } from '../ui/Demo'
import NotFound from './NotFound'

const ROMAN = ['', 'I', 'II', 'III', 'IV']

export default function Chapter() {
  const { id = '' } = useParams()
  const c = chapter(id)
  useTitle(c?.title ?? 'Not found')
  if (!c) return <NotFound />
  return <ChapterBody key={c.id} id={c.id} />
}

function ChapterBody({ id }: { id: string }) {
  const c = chapter(id)!
  const i = CHAPTERS.indexOf(c)
  const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1]
  const { setProgress } = useStore()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  useEffect(() => scrollYProgress.on('change', v => setProgress(id, v)), [scrollYProgress, setProgress, id])

  const arch = archiveFor('chapters', c.id)
  const headingIds =c.blocks.flatMap(b => (b.t === 'h' ? [b.text] : []))
  return (
    <>
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent" style={{ scaleX: bar }} />
      {/* Page-turn: a brief rotation from the spine; opacity carries it under reduced motion. */}
      <motion.article
        ref={ref}
        initial={{ opacity: 0, rotateY: -8, x: 24 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformOrigin: 'left center', transformPerspective: 1600 }}
        className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Crumbs trail={[['Handbook', '/handbook'], [`Volume ${ROMAN[c.volume]}`, `/handbook#vol-${c.volume}`], [c.title]]} />
          <BookmarkButton id={`c:${c.id}`} label={c.title} />
        </div>

        <header className="mx-auto mt-10 max-w-3xl text-center">
          <h1 className="mt-3 text-5xl leading-[1.04] sm:text-6xl">{c.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-xl italic text-ink-2">{c.dek}</p>
          <p className="label mt-4 text-ink-2">Chapter {i + 1} · {VOLUMES[c.volume - 1].title} · {c.minutes} min read</p>
          <Ornament className="mt-6" />
        </header>
        {arch && <ArchivePlate a={arch} className="mx-auto mt-10 max-w-sm" />}

        <div className="mt-10 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)_13rem]">
          <nav aria-label="In this chapter" className="hidden lg:block">
            {headingIds.length > 0 && (
              <div className="sticky top-24">
                <p className="label text-ink-2">In this chapter</p>
                <ol className="mt-2 space-y-1.5 border-l border-rule pl-3 text-sm">
                  {headingIds.map(h => <li key={h}><a href={`#${slug(h)}`} className="text-ink-2 hover:text-accent">{h}</a></li>)}
                </ol>
              </div>
            )}
          </nav>

          <div className="prose-book mx-auto w-full">
            {c.blocks.map((b, k) => <BlockView key={k} b={b} first={k === 0} />)}
          </div>

          <aside aria-label="Related" className="space-y-6 text-sm lg:sticky lg:top-24 lg:self-start">
            {!!c.garments?.length && (
              <div>
                <p className="label text-ink-2">In the Encyclopedia</p>
                <ul className="mt-2 space-y-1">{c.garments.map(g => <li key={g}><Link className="xref" to={`/encyclopedia/${g}`}>{garment(g)?.name}</Link></li>)}</ul>
              </div>
            )}
            {!!c.styles?.length && (
              <div>
                <p className="label text-ink-2">In the Atlas</p>
                <ul className="mt-2 space-y-1">{c.styles.map(s => <li key={s}><Link className="xref" to={`/atlas/${s}`}>{style(s)?.name}</Link></li>)}</ul>
              </div>
            )}
            <div>
              <p className="label text-ink-2">Try it</p>
              <Link to="/studio" className="xref mt-2 inline-block">Open the Outfit Studio</Link>
            </div>
          </aside>
        </div>

        <nav aria-label="Chapters" className="rule-double mx-auto mt-16 grid max-w-3xl gap-4 pt-6 sm:grid-cols-2">
          {prev ? <Link to={`/handbook/${prev.id}`} className="group p-2"><span className="label flex items-center gap-1 text-ink-2"><ArrowLeft size={14} aria-hidden /> Previous</span><span className="mt-1 block font-display text-xl group-hover:text-accent">{prev.title}</span></Link> : <span />}
          {next && <Link to={`/handbook/${next.id}`} className="group p-2 sm:text-right"><span className="label flex items-center gap-1 text-ink-2 sm:justify-end">Next <ArrowRight size={14} aria-hidden /></span><span className="mt-1 block font-display text-xl group-hover:text-accent">{next.title}</span></Link>}
        </nav>
      </motion.article>
    </>
  )
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function BlockView({ b, first }: { b: Block; first: boolean }) {
  switch (b.t) {
    case 'p': return <p className={first ? 'dropcap' : ''}><Rich text={b.text} /></p>
    case 'h': return <h2 id={slug(b.text)}>{b.text}</h2>
    case 'list': return <ul>{b.items.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>
    case 'note': return <aside className="border-y border-rule py-4 text-center font-display text-lg leading-snug text-accent-2 [&_strong]:font-normal"><Rich text={b.text} /></aside>
    case 'deeper': return (
      <details className="group border border-rule bg-paper-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-display text-lg [&::-webkit-details-marker]:hidden">
          <span><span className="font-sans text-xs uppercase tracking-[0.14em] text-ink-2">Go deeper · </span>{b.title}</span>
          <ChevronDown size={18} aria-hidden className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="space-y-3 px-4 pb-4 text-[1rem]">{b.body.map((t, i) => <p key={i}><Rich text={t} /></p>)}</div>
      </details>
    )
    case 'compare': return (
      <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 sm:!max-w-none">
        {[b.a, b.b].map(s => (
          <div key={s.title} className="bg-paper-3 p-4">
            <h3 className="text-xl">{s.title}</h3>
            <ul className="bullets mt-2 text-[0.98rem]">{s.points.map((t, i) => <li key={i}><Rich text={t} /></li>)}</ul>
          </div>
        ))}
      </div>
    )
    case 'demo': return <div className="not-prose my-8 font-serif text-base"><Demo block={b} /></div>
  }
}
