import { useState } from 'react'
import { Link } from 'react-router'
import { preset } from '../data/presets'
import { STYLES } from '../data/styles'
import type { StyleEntry } from '../data/types'
import { Crumbs, Plate, useTitle } from '../ui/bits'

const LANES: [StyleEntry['lane'], string][] = [['tailored', 'Tailoring'], ['collegiate', 'Campus'], ['work', 'Work & outdoors'], ['military', 'Military'], ['street', 'Street'], ['modern', 'Modern']]
const FROM = 1840, TO = 2030
const x = (year: number) => `${((year - FROM) / (TO - FROM)) * 100}%`
const linked = (a: StyleEntry, b: StyleEntry) => a.influences.includes(b.id) || b.influences.includes(a.id)

export default function Atlas() {
  const [hi, setHi] = useState<StyleEntry | null>(null)
  useTitle('The Style Atlas')
  const sorted = [...STYLES].sort((a, b) => a.origin - b.origin)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <Crumbs trail={[['Fashone', '/'], ['Style Atlas']]} />
      <header className="mt-6 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl">The Style Atlas</h1>
        <p className="mt-3 text-lg text-ink-2">{STYLES.length} traditions, placed by when they took shape. Styles borrow from each other constantly — hover or focus one to see its relations.</p>
      </header>

      <figure className="plate mt-10 hidden overflow-hidden p-6 md:block" aria-label="Timeline of styles by tradition">
        <div className="relative ml-36">
          {[1850, 1900, 1950, 2000].map(y => (
            <div key={y} className="absolute inset-y-0 border-l border-dashed border-rule" style={{ left: x(y) }} aria-hidden>
              <span className="label absolute -top-1 left-1.5 text-ink-2">{y}</span>
            </div>
          ))}
          <div className="pt-6">
            {LANES.map(([lane, name]) => (
              <div key={lane} className="relative h-24 border-b border-rule last:border-0">
                <span className="absolute -left-36 top-1/2 w-32 -translate-y-1/2 font-display text-lg text-ink-2">{name}</span>
                {STYLES.filter(s => s.lane === lane).sort((a, b) => a.origin - b.origin).map((s, i) => {
                  const dim = hi && hi !== s && !linked(hi, s)
                  return (
                    <Link
                      key={s.id} to={`/atlas/${s.id}`}
                      onMouseEnter={() => setHi(s)} onMouseLeave={() => setHi(null)} onFocus={() => setHi(s)} onBlur={() => setHi(null)}
                      className={`absolute flex items-center gap-2 whitespace-nowrap ${s.origin >= 2000 ? "-translate-x-full flex-row-reverse" : ""} transition-opacity duration-200 ${i % 2 ? 'top-[58%]' : 'top-[12%]'} ${dim ? 'opacity-30' : ''}`}
                      style={{ left: x(s.origin) }}
                    >
                      <span aria-hidden className={`size-2.5 rotate-45 ${hi === s ? 'bg-accent' : hi && linked(hi, s) ? 'bg-accent-2' : 'bg-brass'}`} />
                      <span className="font-display text-base leading-none hover:text-accent">{s.name}</span>
                      <span className="sr-only">, from {s.era}</span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <figcaption className="mt-4 text-sm italic text-ink-2">{hi ? `${hi.name}: ${hi.era}. Related: ${STYLES.filter(s => s !== hi && linked(hi, s)).map(s => s.name).join(', ') || 'a tradition of its own'}.` : 'Dates are approximate: styles coalesce over years rather than begin on a day.'}</figcaption>
      </figure>

      <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map(s => {
          const p = preset(s.presets[0])
          return (
            <li key={s.id}>
              <Link to={`/atlas/${s.id}`} className="group grid grid-cols-[5.5rem_1fr] gap-4">
                {p ? <Plate outfit={p.outfit} figClass="aspect-[280/1000] w-full px-2 pt-1.5" /> : <span />}
                <span>
                  <span className="block font-display text-2xl leading-tight group-hover:text-accent">{s.name}</span>
                  <span className="mt-1 block font-sans text-xs text-ink-2">{s.era}</span>
                  <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-ink-2">{s.summary}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
