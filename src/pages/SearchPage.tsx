import { Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { search } from '../lib/search'
import { Crumbs, useTitle } from '../ui/bits'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const hits = q.trim() ? search(q, 100) : []
  useTitle(q ? `Search: ${q}` : 'Search')

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <Crumbs trail={[['Fashone', '/'], ['Search']]} />
      <h1 className="mt-6 text-5xl">Search the book</h1>
      <form role="search" onSubmit={e => e.preventDefault()} className="relative mt-6">
        <Search size={18} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
        <input type="search" autoFocus className="field w-full py-3 pl-10 text-lg" aria-label="Search garments, styles, chapters and outfits" placeholder="Garments, styles, chapters, outfits" value={q} onChange={e => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} />
      </form>
      <p className="label mt-4 text-ink-2" aria-live="polite">{q.trim() ? `${hits.length} result${hits.length === 1 ? '' : 's'}` : 'Type to search'}</p>
      <ol className="mt-2 divide-y divide-rule">
        {hits.map(h => (
          <li key={h.kind + h.id}>
            <Link to={h.href} className="group block py-3.5">
              <span className="flex items-baseline justify-between gap-3"><span className="font-display text-xl group-hover:text-accent">{h.title}</span><span className="label shrink-0 text-ink-2">{h.kind}</span></span>
              <span className="mt-0.5 block text-[0.95rem] text-ink-2">{h.snippet}</span>
            </Link>
          </li>
        ))}
      </ol>
      {q.trim() && !hits.length && <p className="mt-6 italic text-ink-2">Nothing found for “{q}”. Try a garment (“loafer”), a cloth (“tweed”) or an idea (“contrast”).</p>}
    </div>
  )
}
