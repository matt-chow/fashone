import { GARMENTS, garment } from '../data/garments'
import { colour, hasColour } from '../data/palette'
import type { Fit, Garment, Outfit, PatternId, Piece, Season, Slot } from '../data/types'
import { isDrawable } from '../figure/Figure'
import { SKIN_TONES, HAIR_COLOURS, HAIR_STYLES } from '../figure/body'

/** Studio panel order, outermost-to-head first. */
export const SLOTS: { slot: Slot; label: string; required?: boolean }[] = [
  { slot: 'coat', label: 'Coat' },
  { slot: 'jacket', label: 'Jacket' },
  { slot: 'mid', label: 'Knit & mid layer' },
  { slot: 'top', label: 'Shirt', required: true },
  { slot: 'neck', label: 'Neckwear' },
  { slot: 'bottom', label: 'Trousers', required: true },
  { slot: 'shoes', label: 'Shoes', required: true },
  { slot: 'belt', label: 'Belt' },
  { slot: 'braces', label: 'Braces' },
  { slot: 'scarf', label: 'Scarf' },
  { slot: 'hat', label: 'Hat' },
  { slot: 'eyewear', label: 'Eyewear' },
  { slot: 'watch', label: 'Watch' },
  { slot: 'pocket', label: 'Pocket square' },
]
export const FITS: Fit[] = ['slim', 'straight', 'relaxed', 'wide']

export const optionsFor = (slot: Slot): Garment[] =>
  GARMENTS.filter(g => g.slot === slot && isDrawable(slot, g.id))

export const pieceFor = (g: Garment, prev?: Piece): Piece => ({
  garmentId: g.id,
  colour: prev && g.colours.includes(prev.colour) ? prev.colour : g.colours[0],
  pattern: prev && g.patterns.includes(prev.pattern) ? prev.pattern : g.patterns[0] ?? 'solid',
  ...(g.fits ? { fit: prev?.fit ?? 'straight' } : {}),
})

export function setPiece(o: Outfit, slot: Slot, piece: Piece | undefined): Outfit {
  const pieces = { ...o.pieces }
  if (piece) pieces[slot] = piece
  else delete pieces[slot]
  // Belt and braces are never worn together.
  if (piece && slot === 'braces') delete pieces.belt
  if (piece && slot === 'belt') delete pieces.braces
  return { ...o, pieces }
}

export const EMPTY: Outfit = {
  figure: { skin: 1, hair: 1, hairStyle: 0 },
  pieces: {
    top: { garmentId: 'ocbd', colour: 'white', pattern: 'oxford' },
    bottom: { garmentId: 'chinos', colour: 'khaki', pattern: 'solid', fit: 'straight' },
    shoes: { garmentId: 'derby', colour: 'brown', pattern: 'solid' },
  },
}

// --- serialisation: `slot.garment.colour.pattern[.fit]` joined by `~`, then `|skin.hair.style`
const SLOT_SET = new Set(SLOTS.map(s => s.slot))

export function encode(o: Outfit): string {
  const parts = (Object.entries(o.pieces) as [Slot, Piece][]).map(([s, p]) =>
    [s, p.garmentId, p.colour, p.pattern, p.fit].filter(Boolean).join('.'))
  const f = o.figure
  return `${parts.join('~')}|${f.skin}.${f.hair}.${f.hairStyle}`
}

/** Parses untrusted input (URLs, imported files); drops anything unknown. */
export function decode(s: string | null | undefined): Outfit | null {
  if (!s || s.length > 2000) return null
  const [body, fig = ''] = s.split('|')
  const pieces: Outfit['pieces'] = {}
  for (const part of body.split('~')) {
    const [slot, id, col, pat, fit] = part.split('.') as [Slot, string, string, PatternId, Fit?]
    const g = garment(id)
    if (!SLOT_SET.has(slot) || !g || !isDrawable(slot, id) || !hasColour(col)) continue
    pieces[slot] = { garmentId: id, colour: col, pattern: g.patterns.includes(pat) ? pat : 'solid', ...(fit && FITS.includes(fit) ? { fit } : {}) }
  }
  if (!pieces.top || !pieces.bottom || !pieces.shoes) return null
  const [skin, hair, hs] = fig.split('.').map(Number)
  const clamp = (n: number, max: number) => (Number.isInteger(n) && n >= 0 && n < max ? n : 0)
  return { pieces, figure: { skin: clamp(skin, SKIN_TONES.length), hair: clamp(hair, HAIR_COLOURS.length), hairStyle: clamp(hs, HAIR_STYLES.length) } }
}

export const isOutfit = (x: unknown): x is Outfit => {
  try { return !!decode(encode(x as Outfit)) } catch { return false }
}

/** Plain-language description, used for the figure's accessible name. */
export function describe(o: Outfit): string {
  const order: Slot[] = ['coat', 'jacket', 'mid', 'top', 'neck', 'bottom', 'shoes', 'hat', 'scarf']
  const bits = order.flatMap(s => {
    const p = o.pieces[s]
    const g = p && garment(p.garmentId)
    return g ? [`${colour(p.colour).name.toLowerCase()} ${g.name.toLowerCase()}`] : []
  })
  return `Figure wearing ${bits.join(', ')}`
}

// --- randomise
export interface Constraints { formality?: [number, number]; season?: Season; style?: string }

const pick = <T,>(xs: T[], rnd: () => number): T => xs[Math.floor(rnd() * xs.length)]

/**
 * Builds an outfit whose pieces share a formality band, season and (optionally) style.
 * `check` lets the caller reject combinations the explanation engine flags.
 */
export function randomOutfit(c: Constraints, check: (o: Outfit) => boolean = () => true, rnd = Math.random): Outfit {
  let best: Outfit = EMPTY
  for (let attempt = 0; attempt < 40; attempt++) {
    const [lo, hi] = c.formality ?? (() => { const f = 1 + Math.floor(rnd() * 4); return [f, f + 1] as [number, number] })()
    const fits = (g: Garment) =>
      g.formality >= lo - 1 && g.formality <= hi + (g.category === 'accessories' ? 1 : 0) &&
      (!c.season || g.seasons.includes(c.season)) &&
      (attempt > 25 || !c.style || g.styles.includes(c.style) || g.category === 'accessories' || g.category === 'footwear' || g.category === 'bottoms')
    const core = (g: Garment) => fits(g) && g.formality >= lo && g.formality <= hi
    let accents = 0
    const choose = (slot: Slot, need: boolean, chance: number, strict = false) => {
      const opts = optionsFor(slot).filter(strict ? core : fits)
      if (!opts.length || (!need && rnd() > chance)) return undefined
      const g = pick(opts, rnd)
      // At most one accent colour across the outfit.
      const cols = g.colours.filter(id => accents < 1 || colour(id).neutral)
      const col = pick(cols.length ? cols : g.colours, rnd)
      if (!colour(col).neutral) accents++
      const p: Piece = { garmentId: g.id, colour: col, pattern: rnd() < 0.3 ? pick(g.patterns, rnd) : g.patterns[0] ?? 'solid' }
      if (g.fits) p.fit = pick(hi >= 4 ? (['slim', 'straight'] as Fit[]) : FITS, rnd)
      return p
    }
    const winter = c.season === 'winter', summer = c.season === 'summer'
    const pieces: Outfit['pieces'] = {
      top: choose('top', true, 1, true),
      bottom: choose('bottom', true, 1, true),
      shoes: choose('shoes', true, 1, true),
      jacket: choose('jacket', false, hi >= 4 ? 1 : 0.5),
      mid: choose('mid', false, winter ? 0.7 : summer ? 0 : 0.35),
      coat: choose('coat', false, winter ? 0.8 : summer ? 0 : 0.2),
      neck: choose('neck', false, hi >= 4 ? 0.9 : 0.1),
      belt: choose('belt', false, 0.6),
      hat: choose('hat', false, 0.15),
      scarf: choose('scarf', false, winter ? 0.5 : 0),
      watch: choose('watch', false, 0.4),
    }
    for (const k of Object.keys(pieces) as Slot[]) if (!pieces[k]) delete pieces[k]
    if (!pieces.top || !pieces.bottom || !pieces.shoes) continue
    best = { figure: { skin: Math.floor(rnd() * SKIN_TONES.length), hair: Math.floor(rnd() * HAIR_COLOURS.length), hairStyle: Math.floor(rnd() * HAIR_STYLES.length) }, pieces }
    if (check(best)) return best
  }
  return best
}
