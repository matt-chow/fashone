import { BookmarkCheck } from 'lucide-react'
import { Link } from 'react-router'
import { CHAPTERS, VOLUMES } from '../data/chapters'
import { useStore } from '../lib/store'
import { Crumbs, Ornament, useTitle } from '../ui/bits'

const ROMAN = ['I', 'II', 'III', 'IV']

export default function Handbook() {
  const { data } = useStore()
  useTitle('The Handbook')
  const read = CHAPTERS.filter(c => (data.progress[c.id] ?? 0) >= 1).length
  const resume = CHAPTERS.find(c => (data.progress[c.id] ?? 0) > 0 && (data.progress[c.id] ?? 0) < 1)

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      <Crumbs trail={[['Fashone', '/'], ['Handbook']]} />
      <header className="mt-8 text-center">
        <h1 className="text-5xl sm:text-6xl">Contents</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg italic text-ink-2">{CHAPTERS.length} chapters in four volumes, from first principles to the rules worth breaking.</p>
        <p className="label mt-4 text-ink-2">{read} of {CHAPTERS.length} read</p>
        {resume && <Link to={`/handbook/${resume.id}`} className="btn btn-primary mt-4">Continue: {resume.title}</Link>}
        <Ornament className="mt-8" />
      </header>

      {VOLUMES.map(v => (
        <section key={v.n} id={`vol-${v.n}`} aria-labelledby={`vol-${v.n}-h`} className="mt-12 grid gap-6 md:grid-cols-[14rem_1fr]">
          <div>
            <h2 id={`vol-${v.n}-h`} className="text-3xl"><span className="text-accent">{ROMAN[v.n - 1]}.</span> {v.title}</h2>
            <p className="mt-2 text-ink-2">{v.note}</p>
          </div>
          <ol className="border-t border-rule">
            {CHAPTERS.filter(c => c.volume === v.n).map(c => {
              const n = CHAPTERS.indexOf(c) + 1
              const pr = data.progress[c.id] ?? 0
              return (
                <li key={c.id} className="border-b border-rule">
                  <Link to={`/handbook/${c.id}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-3.5">
                    <span className="font-display text-xl text-ink-2">{n}</span>
                    <span>
                      <span className="block font-display text-xl leading-tight group-hover:text-accent">{c.title}</span>
                      <span className="mt-0.5 block text-[0.95rem] text-ink-2">{c.dek}</span>
                    </span>
                    <span className="flex items-center gap-2 font-sans text-xs text-ink-2">
                      {data.bookmarks.includes(`c:${c.id}`) && <BookmarkCheck size={14} className="text-accent" aria-label="Bookmarked" />}
                      {pr >= 1 ? <span className="text-accent-2">Read</span> : pr > 0 ? <span>{Math.round(pr * 100)}%</span> : <span>{c.minutes} min</span>}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
