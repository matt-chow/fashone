import { ArrowRight, Scale } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { CHAPTERS } from '../data/chapters'
import { CATEGORIES, FORMALITY, garment } from '../data/garments'
import { occasion } from '../data/occasions'
import { colour } from '../data/palette'
import { PRESETS } from '../data/presets'
import { style } from '../data/styles'
import { Rich } from '../lib/inline'
import { Anatomy } from '../ui/Anatomy'
import { archiveFor } from '../data/archive'
import { ArchivePlate, BookmarkButton, Crumbs, Plate, Specimen, useTitle } from '../ui/bits'
import NotFound from './NotFound'

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

export default function GarmentPage() {
  const { id = '' } = useParams()
  const g = garment(id)
  useTitle(g?.name ?? 'Not found')
  if (!g) return <NotFound />
  const cat = CATEGORIES.find(c => c.id === g.category)!
  const chapters = CHAPTERS.filter(c => c.garments?.includes(g.id))
  const outfits = PRESETS.filter(p => Object.values(p.outfit.pieces).some(x => x.garmentId === g.id)).slice(0, 4)
  const arch = archiveFor('garments', g.id)
  const related = [...new Set([...(g.related ?? []), ...(g.pairsWith ?? [])])].map(garment).filter(x => !!x)

  return (
    <article className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Crumbs trail={[['Encyclopedia', '/encyclopedia'], [cat.name, `/encyclopedia?cat=${cat.id}`], [g.name]]} />
        <BookmarkButton id={`g:${g.id}`} label={g.name} />
      </div>

      <header className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_18rem]">
        <div>
          <h1 className="text-5xl leading-[1.04] sm:text-6xl">{g.name}</h1>
          {!!g.aliases?.length && <p className="mt-2 italic text-ink-2">Also called {g.aliases.join(', ')}</p>}
          <p className="mt-4 max-w-2xl text-xl leading-relaxed">{g.summary}</p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 font-sans text-sm">
            <Fact k="Formality"><span aria-label={`${g.formality} of 5`} className="mr-2 tracking-[0.2em] text-accent">{'●'.repeat(g.formality)}<span className="text-rule">{'●'.repeat(5 - g.formality)}</span></span>{FORMALITY[g.formality]}</Fact>
            <Fact k="Seasons">{g.seasons.map(cap).join(', ')}</Fact>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            {g.slot && <Link to={`/studio?add=${g.id}`} className="btn btn-primary">Wear it in the Studio <ArrowRight size={15} aria-hidden /></Link>}
            <Link to={`/encyclopedia/compare?a=${g.id}`} className="btn"><Scale size={15} aria-hidden /> Compare</Link>
          </div>
        </div>
        <div className="plate mx-auto flex h-80 w-full max-w-72 items-center justify-center p-4"><Specimen g={g} className="h-full w-full" /></div>
      </header>

      <div className="mt-14 grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="prose-book space-y-10 [&>*+*]:mt-10">
          <Sec title="What defines it"><ul className="bullets">{g.features.map(f => <li key={f}><Rich text={f} /></li>)}</ul></Sec>
          {!!g.variations?.length && (
            <Sec title="Variations">
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{g.variations.map(([n, d]) => <div key={n}><dt className="font-display text-lg">{n}</dt><dd className="text-[0.98rem] text-ink-2"><Rich text={d} /></dd></div>)}</dl>
            </Sec>
          )}
          {g.fit && <Sec title="Fit"><p><Rich text={g.fit} /></p></Sec>}
          {g.fabrics && <Sec title="Fabrics"><p><Rich text={g.fabrics} /></p></Sec>}
          {g.styling && <Sec title="How to wear it"><p><Rich text={g.styling} /></p></Sec>}
          {g.anatomy && <div className="!max-w-none"><Anatomy id={g.anatomy} /></div>}
          {g.history && <Sec title="History"><p><Rich text={g.history} /></p></Sec>}
          {arch && <Sec title="From the archive"><ArchivePlate a={arch} className="max-w-md" /></Sec>}
          {!!g.buying?.length && <Sec title="Buying well"><ul className="bullets">{g.buying.map(b => <li key={b}><Rich text={b} /></li>)}</ul></Sec>}
          {g.care && <Sec title="Care"><p><Rich text={g.care} /></p></Sec>}
          {!!g.mistakes?.length && <Sec title="Common mistakes"><ul className="bullets">{g.mistakes.map(m => <li key={m}><Rich text={m} /></li>)}</ul></Sec>}
          {!!outfits.length && (
            <Sec title="Seen in these outfits">
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {outfits.map(p => (
                  <li key={p.id}>
                    <Link to={`/studio?preset=${p.id}`} className="group block">
                      <Plate outfit={p.outfit} figClass="aspect-[280/1000] w-full px-3 pt-2" />
                      <span className="mt-1.5 block font-display leading-tight group-hover:text-accent">{p.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Sec>
          )}
        </div>

        <aside aria-label="At a glance" className="space-y-7 text-sm lg:sticky lg:top-24 lg:self-start">
          <Side title="Occasions">{g.occasions.map(o => occasion(o)?.name ?? cap(o)).join(' · ')}</Side>
          <Side title="Colours">
            <ul className="flex flex-wrap gap-1.5">{g.colours.map(c => <li key={c} title={colour(c).name} className="size-6 rounded-full border border-ink/25" style={{ background: colour(c).hex }}><span className="sr-only">{colour(c).name}</span></li>)}</ul>
          </Side>
          <Side title="Cloths & patterns">{g.patterns.map(cap).join(', ')}</Side>
          {!!g.styles.length && <Side title="In the Atlas"><ul className="space-y-1">{g.styles.map(s => <li key={s}><Link className="xref" to={`/atlas/${s}`}>{style(s)?.name}</Link></li>)}</ul></Side>}
          {!!chapters.length && <Side title="In the Handbook"><ul className="space-y-1">{chapters.map(c => <li key={c.id}><Link className="xref" to={`/handbook/${c.id}`}>{c.title}</Link></li>)}</ul></Side>}
          {!!related.length && <Side title="Related & pairs with"><ul className="space-y-1">{related.map(r => <li key={r.id}><Link className="xref" to={`/encyclopedia/${r.id}`}>{r.name}</Link></li>)}</ul></Side>}
        </aside>
      </div>
    </article>
  )
}

const Fact = ({ k, children }: { k: string; children: ReactNode }) => <div><dt className="label text-ink-2">{k}</dt><dd className="mt-1">{children}</dd></div>
const Sec = ({ title, children }: { title: string; children: ReactNode }) => <section><h2 className="!mt-0 mb-3">{title}</h2>{children}</section>
const Side = ({ title, children }: { title: string; children: ReactNode }) => <div><h2 className="label font-sans text-ink-2">{title}</h2><div className="mt-2">{children}</div></div>
