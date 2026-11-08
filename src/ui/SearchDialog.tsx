import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { search } from '../lib/search'

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const nav = useNavigate()
  const hits = useMemo(() => search(q, 10), [q])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) { d.showModal(); setQ(''); setActive(0) }
    if (!open && d.open) d.close()
  }, [open])

  const go = (href: string) => { onClose(); nav(href) }

  return (
    <dialog
      ref={ref} onClose={onClose} aria-label="Search"
      onClick={e => { if (e.target === ref.current) onClose() }}
      className="m-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] border border-rule bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/40"
    >
      <form role="search" onSubmit={e => { e.preventDefault(); go(hits[active]?.href ?? `/search?q=${encodeURIComponent(q)}`) }} className="flex items-center gap-3 border-b border-rule px-4">
        <Search size={18} aria-hidden className="shrink-0 text-ink-2" />
        <input
          autoFocus value={q} onChange={e => { setQ(e.target.value); setActive(0) }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, hits.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
          }}
          placeholder="Search garments, styles, chapters…" aria-label="Search" role="combobox" aria-expanded={hits.length > 0} aria-controls="search-results"
          aria-activedescendant={hits[active] ? `sr-${active}` : undefined}
          className="h-14 w-full bg-transparent font-serif text-lg outline-none placeholder:text-ink-2"
        />
        <kbd className="label hidden text-ink-2 sm:block">Esc</kbd>
      </form>
      <ul id="search-results" role="listbox" aria-label="Results" className="max-h-[55vh] overflow-y-auto">
        {hits.map((h, i) => (
          <li key={h.kind + h.id} id={`sr-${i}`} role="option" aria-selected={i === active}>
            <button type="button" onClick={() => go(h.href)} onMouseMove={() => setActive(i)} className={`grid w-full grid-cols-[5.5rem_1fr] gap-3 px-4 py-3 text-left ${i === active ? 'bg-paper-2' : ''}`}>
              <span className="label pt-1 text-accent">{h.kind}</span>
              <span>
                <span className="block font-display text-lg leading-tight">{h.title}</span>
                <span className="line-clamp-1 text-sm text-ink-2">{h.snippet}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {q.trim().length > 1 && !hits.length && <p className="px-4 py-6 text-ink-2">Nothing matches “{q}”. Try a garment (“loafer”), a fabric (“tweed”) or a style (“ivy”).</p>}
      {!q && <p className="px-4 py-5 text-sm text-ink-2">Try <button className="xref" onClick={() => setQ('navy blazer')}>navy blazer</button>, <button className="xref" onClick={() => setQ('tweed')}>tweed</button> or <button className="xref" onClick={() => setQ('black tie')}>black tie</button>.</p>}
    </dialog>
  )
}
