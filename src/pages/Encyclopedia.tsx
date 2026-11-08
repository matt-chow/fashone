import { Search } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CATEGORIES, FORMALITY, GARMENTS } from '../data/garments'
import type { Garment } from '../data/types'
import { Crumbs, Specimen, useTitle } from '../ui/bits'

const SEASONS = ['spring', 'summer', 'autumn', 'winter']
const text = (g: Garment) => [g.name, ...(g.aliases ?? []), g.summary, g.fabrics, g.history, ...g.features].join(' ').toLowerCase()

export default function Encyclopedia() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? '', cat = params.get('cat') ?? '', f = params.get('f') ?? '', season = params.get('season') ?? ''
  const set = (k: string, v: string) => setParams(p => { if (v) p.set(k, v); else p.delete(k); return p }, { replace: true })
  useTitle('The Encyclopedia')

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return GARMENTS.filter(g => (!cat || g.category === cat) && (!f || g.formality === +f) && (!season || g.seasons.includes(season as Garment['seasons'][number])) && words.every(w => text(g).includes(w)))
  }, [q, cat, f, season])
  const filtered = !!(q || cat || f || season)

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
      <Crumbs trail={[['Fashone', '/'], ['Encyclopedia']]} />
      <header className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h1 className="text-5xl sm:text-6xl">The Encyclopedia</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-2">{GARMENTS.length} garments, each with its anatomy, history, fit, fabrics and the mistakes worth avoiding.</p>
        </div>
        <Link to="/encyclopedia/compare" className="btn self-start md:self-end">Compare two garments</Link>
      </header>

      <form role="search" onSubmit={e => e.preventDefault()} className="mt-8 flex flex-wrap items-end gap-3 border-y border-rule py-4">
        <label className="relative min-w-60 flex-[2]">
          <span className="sr-only">Search garments</span>
          <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
          <input type="search" className="field w-full pl-9" placeholder="Search: tweed, button-down, loafer…" value={q} onChange={e => set('q', e.target.value)} />
        </label>
        <label className="flex flex-1 flex-col gap-1"><span className="label text-ink-2">Formality</span>
          <select className="field" value={f} onChange={e => set('f', e.target.value)}>
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{FORMALITY[n]}</option>)}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1"><span className="label text-ink-2">Season</span>
          <select className="field" value={season} onChange={e => set('season', e.target.value)}>
            <option value="">Any</option>
            {SEASONS.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </label>
        <fieldset className="w-full">
          <legend className="sr-only">Category</legend>
          <div className="flex flex-wrap gap-1.5">
            {[{ id: '', name: 'All' }, ...CATEGORIES].map(c => (
              <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => set('cat', c.id)} className={`border px-3 py-1.5 font-sans text-sm ${cat === c.id ? 'border-ink bg-ink text-paper' : 'border-rule hover:border-ink'}`}>{c.name}</button>
            ))}
          </div>
        </fieldset>
      </form>

      <p className="label mt-4 text-ink-2" aria-live="polite">{list.length} {list.length === 1 ? 'entry' : 'entries'}{filtered && <> · <button className="xref normal-case tracking-normal" onClick={() => setParams({}, { replace: true })}>clear filters</button></>}</p>

      {!list.length && <p className="mt-10 text-center text-lg italic text-ink-2">Nothing matches. Try a broader word, or clear a filter.</p>}

      {filtered ? <Grid list={list} /> : CATEGORIES.map(c => (
        <section key={c.id} aria-labelledby={`cat-${c.id}`} className="mt-10">
          <div className="flex items-baseline gap-3 border-b border-rule pb-2">
            <h2 id={`cat-${c.id}`} className="text-3xl">{c.name}</h2>
            <p className="italic text-ink-2">{c.note}</p>
          </div>
          <Grid list={list.filter(g => g.category === c.id)} />
        </section>
      ))}
    </div>
  )
}

function Grid({ list }: { list: Garment[] }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-5">
      {list.map(g => (
        <li key={g.id} className="bg-paper">
          <Link to={`/encyclopedia/${g.id}`} className="group flex h-full flex-col p-3 hover:bg-paper-3">
            <span className="flex h-36 items-center justify-center"><Specimen g={g} className="h-full w-full max-w-36 transition-transform duration-300 ease-out group-hover:-translate-y-1" /></span>
            <span className="mt-2 font-display text-lg leading-tight group-hover:text-accent">{g.name}</span>
            <span className="mt-0.5 text-xs text-ink-2">{FORMALITY[g.formality]}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
