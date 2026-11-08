import { Link, useSearchParams } from 'react-router'
import { CATEGORIES, FORMALITY, GARMENTS, garment } from '../data/garments'
import { occasion } from '../data/occasions'
import type { Garment } from '../data/types'
import { Rich } from '../lib/inline'
import { Crumbs, Specimen, useTitle } from '../ui/bits'

const ROWS: [string, (g: Garment) => React.ReactNode][] = [
  ['Formality', g => FORMALITY[g.formality]],
  ['Seasons', g => g.seasons.join(', ')],
  ['Occasions', g => g.occasions.map(o => occasion(o)?.name ?? o).join(', ')],
  ['Defining features', g => <ul className="bullets">{g.features.map(f => <li key={f}><Rich text={f} /></li>)}</ul>],
  ['Fit', g => g.fit && <Rich text={g.fit} />],
  ['Fabrics', g => g.fabrics && <Rich text={g.fabrics} />],
  ['How to wear it', g => g.styling && <Rich text={g.styling} />],
]

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const a = garment(params.get('a') ?? '') ?? garment('blazer')!
  const b = garment(params.get('b') ?? '') ?? GARMENTS.find(g => g.category === a.category && g.id !== a.id)!
  useTitle(`${a.name} vs ${b.name}`)
  const pick = (k: 'a' | 'b', v: string) => setParams(p => { p.set('a', a.id); p.set('b', b.id); p.set(k, v); return p }, { replace: true })

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <Crumbs trail={[['Encyclopedia', '/encyclopedia'], ['Compare']]} />
      <h1 className="mt-6 text-5xl">Side by side</h1>
      <p className="mt-2 max-w-xl text-lg text-ink-2">Two garments that are easily confused, or simply two you are choosing between.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-8">
        {([['a', a], ['b', b]] as const).map(([k, g]) => (
          <div key={k}>
            <label className="flex flex-col gap-1">
              <span className="label text-ink-2">Garment {k.toUpperCase()}</span>
              <select className="field" value={g.id} onChange={e => pick(k, e.target.value)}>
                {CATEGORIES.map(c => <optgroup key={c.id} label={c.name}>{GARMENTS.filter(x => x.category === c.id).map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</optgroup>)}
              </select>
            </label>
            <div className="plate mt-3 flex h-56 items-center justify-center p-3 sm:h-72"><Specimen g={g} className="h-full w-full" /></div>
            <h2 className="mt-3 text-2xl sm:text-3xl"><Link to={`/encyclopedia/${g.id}`} className="hover:text-accent">{g.name}</Link></h2>
            <p className="mt-1 text-ink-2">{g.summary}</p>
          </div>
        ))}
      </div>

      <dl className="mt-10 border-t border-rule">
        {ROWS.map(([label, f]) => (
          <div key={label} className="grid gap-x-8 gap-y-2 border-b border-rule py-4 sm:grid-cols-[10rem_1fr_1fr]">
            <dt className="label pt-1 text-ink-2">{label}</dt>
            <dd>{f(a) || <span className="text-ink-2">—</span>}</dd>
            <dd className="border-t border-dashed border-rule pt-2 sm:border-0 sm:pt-0">{f(b) || <span className="text-ink-2">—</span>}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
