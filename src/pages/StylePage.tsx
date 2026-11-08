import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { chapter } from '../data/chapters'
import { garment } from '../data/garments'
import { preset } from '../data/presets'
import { STYLES, style } from '../data/styles'
import { Rich } from '../lib/inline'
import { archiveFor } from '../data/archive'
import { ArchivePlate, BookmarkButton, Crumbs, Ornament, Plate, Specimen, useTitle } from '../ui/bits'
import NotFound from './NotFound'

export default function StylePage() {
  const { id = '' } = useParams()
  const s = style(id)
  useTitle(s?.name ?? 'Not found')
  if (!s) return <NotFound />
  const presets = s.presets.map(preset).filter(p => !!p)
  const influencedBy = s.influences.map(style).filter(x => !!x)
  const influenced = STYLES.filter(x => x.influences.includes(s.id))
  const arch = archiveFor('styles', s.id)

  return (
    <article className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Crumbs trail={[['Style Atlas', '/atlas'], [s.name]]} />
        <BookmarkButton id={`s:${s.id}`} label={s.name} />
      </div>

      <header className="mx-auto mt-8 max-w-3xl text-center">
        <h1 className="text-5xl leading-[1.04] sm:text-6xl">{s.name}</h1>
        <p className="label mt-3 text-ink-2">{s.era}</p>
        <p className="mt-5 text-xl italic leading-relaxed text-ink-2">{s.summary}</p>
        <Ornament className="mt-8" />
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="prose-book">
          <h2 className="!mt-0">History</h2>
          <p className="dropcap"><Rich text={s.history} /></p>
          <h2>What marks it out</h2>
          <ul>{s.characteristics.map(c => <li key={c}><Rich text={c} /></li>)}</ul>
          <h2>Silhouette</h2>
          <p><Rich text={s.silhouettes} /></p>
          <h2>Palette & cloth</h2>
          <p><Rich text={s.palette} /></p>
          {(!!influencedBy.length || !!influenced.length) && (
            <>
              <h2>Influences</h2>
              {!!influencedBy.length && <p>Draws on {list(influencedBy.map(x => <Link key={x.id} to={`/atlas/${x.id}`} className="xref">{x.name}</Link>))}.</p>}
              {!!influenced.length && <p>Feeds into {list(influenced.map(x => <Link key={x.id} to={`/atlas/${x.id}`} className="xref">{x.name}</Link>))}.</p>}
            </>
          )}
          <p className="text-[0.95rem] italic text-ink-2">A style is a vocabulary, not a uniform or an identity. Borrow the parts that suit you; nobody needs the whole kit.</p>
          {!!s.sources?.length && (
            <>
              <h2>Further reading</h2>
              <ul>{s.sources.map(x => <li key={x.url}><a className="xref" href={x.url} target="_blank" rel="noreferrer">{x.label}</a></li>)}</ul>
            </>
          )}
        </div>

        <aside className="space-y-8">
          {arch && <ArchivePlate a={arch} />}
          {!!presets.length && (
            <section aria-labelledby="ex-h">
              <h2 id="ex-h" className="text-2xl">Example outfits</h2>
              <ul className="mt-3 grid grid-cols-2 gap-4">
                {presets.map(p => (
                  <li key={p.id}>
                    <Plate outfit={p.outfit} figClass="aspect-[280/1000] w-full px-3 pt-2" />
                    <p className="mt-1.5 font-display leading-tight">{p.name}</p>
                    <Link to={`/studio?preset=${p.id}`} className="xref inline-flex items-center gap-1 font-sans text-xs">Open in Studio <ArrowRight size={12} aria-hidden /></Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {!!s.chapters?.length && (
            <Side title="Read in the Handbook">
              <ul className="space-y-1">{s.chapters.map(c => <li key={c}><Link className="xref" to={`/handbook/${c}`}>{chapter(c)?.title}</Link></li>)}</ul>
            </Side>
          )}
        </aside>
      </div>

      <section aria-labelledby="g-h" className="mt-14">
        <h2 id="g-h" className="text-3xl">Key garments</h2>
        <ul className="mt-4 grid grid-cols-2 gap-px bg-rule sm:grid-cols-4 lg:grid-cols-6">
          {s.garments.map(garment).filter(g => !!g).map(g => (
            <li key={g.id} className="bg-paper">
              <Link to={`/encyclopedia/${g.id}`} className="group flex h-full flex-col p-3 hover:bg-paper-3">
                <span className="h-28"><Specimen g={g} className="h-full w-full" /></span>
                <span className="mt-2 font-display leading-tight group-hover:text-accent">{g.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

const list = (items: ReactNode[]) => items.flatMap((x, i) => (i === 0 ? [x] : [i === items.length - 1 ? ' and ' : ', ', x]))
const Side = ({ title, children }: { title: string; children: ReactNode }) => <section><h2 className="text-2xl">{title}</h2><div className="mt-2">{children}</div></section>
