import { CHAPTERS } from '../data/chapters'
import { GARMENTS } from '../data/garments'
import { PRESETS } from '../data/presets'
import { STYLES } from '../data/styles'
import type { Block } from '../data/types'
import { plain } from './inline'

export interface Hit { kind: 'Garment' | 'Style' | 'Chapter' | 'Outfit'; id: string; title: string; snippet: string; href: string }
interface Doc extends Hit { title_: string; body: string }

const blockText = (b: Block): string =>
  b.t === 'list' ? b.items.join(' ') : b.t === 'deeper' ? `${b.title} ${b.body.join(' ')}` : b.t === 'compare' ? [...b.a.points, ...b.b.points].join(' ') : 'text' in b ? b.text : b.caption ?? ''

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// shortcut: linear scan over ~200 docs, swap for an inverted index if content grows past a few thousand entries.
const DOCS: Doc[] = [
  ...GARMENTS.map(g => ({ kind: 'Garment' as const, id: g.id, title: g.name, snippet: g.summary, href: `/encyclopedia/${g.id}`, title_: norm([g.name, ...(g.aliases ?? [])].join(' ')), body: norm([g.summary, g.features.join(' '), g.history, g.styling, g.fabrics, g.fit, ...(g.variations ?? []).flat()].join(' ')) })),
  ...STYLES.map(s => ({ kind: 'Style' as const, id: s.id, title: s.name, snippet: s.summary, href: `/atlas/${s.id}`, title_: norm(s.name), body: norm([s.summary, s.history, s.characteristics.join(' '), s.palette, s.silhouettes].join(' ')) })),
  ...CHAPTERS.map(c => ({ kind: 'Chapter' as const, id: c.id, title: c.title, snippet: c.dek, href: `/handbook/${c.id}`, title_: norm(c.title), body: norm(plain([c.dek, ...c.blocks.map(blockText)].join(' '))) })),
  ...PRESETS.map(p => ({ kind: 'Outfit' as const, id: p.id, title: p.name, snippet: p.note, href: `/studio?preset=${p.id}`, title_: norm(p.name), body: norm(p.note) })),
]

export function search(q: string, limit = 30): Hit[] {
  const terms = norm(q).split(/\s+/).filter(t => t.length > 1)
  if (!terms.length) return []
  return DOCS.flatMap(d => {
    let score = 0
    for (const t of terms) {
      const inTitle = d.title_.includes(t), inBody = d.body.includes(t)
      if (!inTitle && !inBody) return []
      score += (inTitle ? (d.title_.startsWith(t) ? 12 : 8) : 0) + (inBody ? 1 : 0)
    }
    return [{ d, score }]
  }).sort((a, b) => b.score - a.score).slice(0, limit).map(({ d }) => ({ kind: d.kind, id: d.id, title: d.title, snippet: d.snippet, href: d.href }))
}
