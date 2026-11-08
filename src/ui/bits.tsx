import { Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { Garment, Outfit } from '../data/types'
import { Figure } from '../figure/Figure'
import { describe } from '../lib/outfit'
import { useStore } from '../lib/store'

export function useTitle(title: string) {
  useEffect(() => { document.title = title ? `${title} · Fashone` : 'Fashone — The Illustrated Handbook of Men\'s Style' }, [title])
}

export function Crumbs({ trail }: { trail: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="label text-ink-2">
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map(([label, to], i) => (
          <li key={label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} aria-hidden />}
            {to ? <Link to={to} className="hover:text-accent">{label}</Link> : <span aria-current="page" className="text-ink">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function BookmarkButton({ id, label }: { id: string; label: string }) {
  const { data, toggleBookmark } = useStore()
  const on = data.bookmarks.includes(id)
  return (
    <button className="btn btn-quiet px-2.5" aria-pressed={on} onClick={() => toggleBookmark(id)} title={on ? 'Remove bookmark' : 'Bookmark'}>
      {on ? <BookmarkCheck size={18} aria-hidden className="text-accent" /> : <Bookmark size={18} aria-hidden />}
      <span className="sr-only">{on ? `Remove bookmark for ${label}` : `Bookmark ${label}`}</span>
      <span aria-hidden className="hidden sm:inline">{on ? 'Bookmarked' : 'Bookmark'}</span>
    </button>
  )
}

/** A figure set on a framed plate, like a catalogue illustration. */
export function Plate({ outfit, caption, className = '', figClass = 'h-full w-full', children, title }: { outfit: Outfit; caption?: ReactNode; className?: string; figClass?: string; children?: ReactNode; title?: string }) {
  return (
    <figure className={`plate relative ${className}`}>
      <Figure outfit={outfit} title={title ?? describe(outfit)} className={figClass} />
      {children}
      {caption && <figcaption className="border-t border-rule px-3 py-2 text-sm italic text-ink-2">{caption}</figcaption>}
    </figure>
  )
}

export function Tag({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'convention' | 'interpretation' }) {
  const cls = tone === 'convention' ? 'border-accent-2 text-accent-2' : tone === 'interpretation' ? 'border-brass text-brass' : 'border-rule text-ink-2'
  return <span className={`label inline-block border px-1.5 py-0.5 text-[0.64rem] ${cls}`}>{children}</span>
}

/** A fleuron-style divider drawn in SVG. */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" className={`mx-auto h-3 w-28 text-brass ${className}`} aria-hidden>
      <path d="M0 6h48M72 6h48" stroke="currentColor" strokeWidth="1" />
      <path d="M60 1l5 5-5 5-5-5z" fill="currentColor" />
      <circle cx="51" cy="6" r="1.4" fill="currentColor" />
      <circle cx="69" cy="6" r="1.4" fill="currentColor" />
    </svg>
  )
}

/** A garment drawn alone, as a catalogue specimen; undrawable garments get their initial. */
export function Specimen({ g, className = '' }: { g: Garment; className?: string }) {
  if (!g.slot) return <span aria-hidden className={`flex items-center justify-center font-display text-5xl text-rule ${className}`}>{g.name[0]}</span>
  return <Figure outfit={{ figure: { skin: 1, hair: 1, hairStyle: 0 }, pieces: { [g.slot]: { garmentId: g.id, colour: g.colours[0], pattern: g.patterns[0] } } }} only={g.slot} title={g.name} className={className} />
}
