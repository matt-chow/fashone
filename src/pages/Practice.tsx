import { Check } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { CHALLENGES } from '../data/challenges'
import { useStore } from '../lib/store'
import { ACTIVITIES, ACTIVITY, Standalone } from '../ui/Activities'
import { Crumbs, useTitle } from '../ui/bits'
import NotFound from './NotFound'

export default function Practice() {
  const { id } = useParams()
  const { data } = useStore()
  const a = id ? ACTIVITIES.find(x => x.id === id) : undefined
  useTitle(a?.title ?? 'Practice')
  if (id && !a) return <NotFound />

  if (a) {
    const A = ACTIVITY[a.id]
    const i = ACTIVITIES.indexOf(a), next = ACTIVITIES[(i + 1) % ACTIVITIES.length]
    return (
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
        <Crumbs trail={[['Practice', '/practice'], [a.title]]} />
        <div className="mt-6"><Standalone value><A /></Standalone></div>
        <p className="mt-6 text-right"><Link to={`/practice/${next.id}`} className="xref">Next: {next.title} →</Link></p>
      </div>
    )
  }

  const done = (k: string) => !!data.done[k] && <span className="label flex items-center gap-1 text-accent-2"><Check size={13} aria-hidden /> Done</span>
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <Crumbs trail={[['Fashone', '/'], ['Practice']]} />
      <header className="mt-6 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl">The practice room</h1>
        <p className="mt-3 text-lg text-ink-2">Short exercises that train the eye. No points and no timers: each one explains its answers.</p>
      </header>

      <section aria-labelledby="ex-h" className="mt-10">
        <h2 id="ex-h" className="border-b border-rule pb-2 text-3xl">Exercises</h2>
        <ol className="divide-y divide-rule">
          {ACTIVITIES.map((x, i) => (
            <li key={x.id}>
              <Link to={`/practice/${x.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-4">
                <span className="font-display text-2xl text-ink-2">{i + 1}</span>
                <span><span className="block font-display text-2xl group-hover:text-accent">{x.title}</span><span className="text-ink-2">{x.note}</span></span>
                {done(x.id)}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="ch-h" className="mt-12">
        <h2 id="ch-h" className="border-b border-rule pb-2 text-3xl">Outfit challenges</h2>
        <p className="mt-3 max-w-2xl text-ink-2">A brief, an occasion and a season. Dress the figure in the Studio; the notes tell you what is still missing.</p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHALLENGES.map(c => (
            <li key={c.id} className="flex flex-col border border-rule bg-paper-3 p-4">
              <div className="flex items-start justify-between gap-2"><h3 className="text-2xl leading-tight">{c.title}</h3>{done(c.id)}</div>
              <p className="mt-1.5 flex-1 text-[0.95rem]">{c.brief}</p>
              <Link to={`/studio?challenge=${c.id}`} className="btn mt-4 self-start">Dress for it</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
