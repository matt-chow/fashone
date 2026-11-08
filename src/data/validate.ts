import { links } from '../lib/inline'
import { ARCHIVE } from './archive'
import { CHALLENGES } from './challenges'
import { CHAPTERS } from './chapters'
import { GARMENT, GARMENTS } from './garments'
import { OCCASIONS } from './occasions'
import { hasColour } from './palette'
import { PRESETS } from './presets'
import { STYLES } from './styles'
import type { Block } from './types'

/** Cross-reference check for authored content: every id must resolve, so the app has no dead ends. */
export function validate(): string[] {
  const errs: string[] = []
  const has = { g: (id: string) => GARMENT.has(id), s: (id: string) => STYLES.some(s => s.id === id), c: (id: string) => CHAPTERS.some(c => c.id === id), p: (id: string) => PRESETS.some(p => p.id === id), o: (id: string) => OCCASIONS.some(o => o.id === id) }
  const need = (ok: boolean, msg: string) => { if (!ok) errs.push(msg) }
  const text = (where: string, t: string) => links(t).forEach(l => {
    const [k, id] = l.split(':')
    need(id === undefined ? l.startsWith('/') : k in has && has[k as 'g'](id), `${where}: bad link ${l}`)
  })

  for (const g of GARMENTS) {
    for (const id of [...(g.related ?? []), ...(g.pairsWith ?? [])]) need(has.g(id), `garment ${g.id}: unknown garment ${id}`)
    for (const id of g.styles) need(has.s(id), `garment ${g.id}: unknown style ${id}`)
    for (const id of g.occasions) need(has.o(id), `garment ${g.id}: unknown occasion ${id}`)
    for (const id of g.colours) need(hasColour(id), `garment ${g.id}: unknown colour ${id}`)
    need(g.colours.length > 0 && g.patterns.length > 0, `garment ${g.id}: needs colours and patterns`)
  }
  for (const s of STYLES) {
    for (const id of s.garments) need(has.g(id), `style ${s.id}: unknown garment ${id}`)
    for (const id of s.influences) need(has.s(id), `style ${s.id}: unknown influence ${id}`)
    for (const id of s.presets) need(has.p(id), `style ${s.id}: unknown preset ${id}`)
    for (const id of s.chapters ?? []) need(has.c(id), `style ${s.id}: unknown chapter ${id}`)
  }
  for (const p of PRESETS) {
    for (const id of p.styles) need(has.s(id), `preset ${p.id}: unknown style ${id}`)
    if (p.occasion) need(has.o(p.occasion), `preset ${p.id}: unknown occasion ${p.occasion}`)
    for (const [slot, piece] of Object.entries(p.outfit.pieces)) {
      const g = GARMENT.get(piece.garmentId)
      need(!!g && g.slot === slot, `preset ${p.id}: ${piece.garmentId} cannot go in ${slot}`)
      need(hasColour(piece.colour), `preset ${p.id}: unknown colour ${piece.colour}`)
      need(!g || g.patterns.includes(piece.pattern), `preset ${p.id}: ${piece.garmentId} has no ${piece.pattern} pattern`)
    }
  }
  for (const a of ARCHIVE) {
    for (const id of a.usage.garments) need(has.g(id), `archive ${a.id}: unknown garment ${id}`)
    for (const id of a.usage.styles) need(has.s(id), `archive ${a.id}: unknown style ${id}`)
    for (const id of a.usage.chapters) need(has.c(id), `archive ${a.id}: unknown chapter ${id}`)
    need(!!(a.title && a.creator && a.date && a.sourceUrl && a.license && a.rightsBasis && a.attribution && a.alt), `archive ${a.id}: incomplete provenance`)
  }
  for (const ch of CHALLENGES) {
    need(has.o(ch.occasion), `challenge ${ch.id}: unknown occasion`)
    for (const [ids] of ch.needs ?? []) for (const id of ids) need(has.g(id), `challenge ${ch.id}: unknown garment ${id}`)
  }
  const block = (where: string, b: Block) => {
    if (b.t === 'p' || b.t === 'note') text(where, b.text)
    if (b.t === 'list') b.items.forEach(t => text(where, t))
    if (b.t === 'deeper') b.body.forEach(t => text(where, t))
    if (b.t === 'compare') [...b.a.points, ...b.b.points].forEach(t => text(where, t))
    if (b.t === 'demo' && b.kind === 'preset') need(!!b.preset && has.p(b.preset), `${where}: unknown preset ${b.preset}`)
    if (b.t === 'demo' && b.kind === 'challenge') need(CHALLENGES.some(c => c.id === b.challenge), `${where}: unknown challenge ${b.challenge}`)
    if (b.t === 'demo' && b.kind === 'anatomy') need(!!b.anatomy, `${where}: anatomy demo needs an id`)
  }
  const ids = new Set<string>()
  for (const c of CHAPTERS) {
    need(!ids.has(c.id), `duplicate chapter ${c.id}`); ids.add(c.id)
    for (const id of c.garments ?? []) need(has.g(id), `chapter ${c.id}: unknown garment ${id}`)
    for (const id of c.styles ?? []) need(has.s(id), `chapter ${c.id}: unknown style ${id}`)
    c.blocks.forEach(b => block(`chapter ${c.id}`, b))
  }
  return errs
}
