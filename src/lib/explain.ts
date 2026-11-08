import { FORMALITY, garment } from '../data/garments'
import { occasion } from '../data/occasions'
import { colour } from '../data/palette'
import { style } from '../data/styles'
import type { Garment, Outfit, PatternId, Piece, Season, Slot } from '../data/types'
import { contrast, hsl, hueGap } from './color'

/**
 * Rule-based outfit commentary. No scores: each note explains one observation
 * and says whether it rests on a widely shared convention or on taste.
 */
export type Topic = 'Formality' | 'Occasion' | 'Colour' | 'Contrast' | 'Pattern' | 'Silhouette' | 'Layering' | 'Season' | 'Tradition'
export interface Note {
  id: string
  topic: Topic
  kind: 'convention' | 'interpretation'
  tone: 'works' | 'consider'
  title: string
  body: string
  slots?: Slot[]
}
export interface Context { occasion?: string; season?: Season; style?: string }

const PRINTS = new Set<PatternId>(['stripe', 'pinstripe', 'chalkstripe', 'gingham', 'windowpane', 'tartan', 'houndstooth', 'seersucker'])
const SCALE: Partial<Record<PatternId, number>> = { pinstripe: 1, stripe: 2, gingham: 2, seersucker: 2, houndstooth: 2, chalkstripe: 3, windowpane: 4, tartan: 4 }
const MAIN: Slot[] = ['coat', 'jacket', 'mid', 'top', 'bottom', 'shoes']
const SHORT_JACKETS = new Set(['harrington', 'bomber', 'denim-jacket', 'leather-jacket'])
const TAILORED = new Set(['suit-jacket', 'blazer', 'sport-coat', 'double-breasted-jacket', 'dinner-jacket'])
const COLLARLESS = new Set(['t-shirt', 'v-neck-tee', 'henley'])
const SLEEK_SHOES = new Set(['oxford', 'loafer', 'opera-pumps', 'monk-strap'])
const HEAVY_SHOES = new Set(['work-boots', 'service-boots'])

const name = (g: Garment) => g.name.toLowerCase()
const isBlackish = (id: string) => hsl(colour(id).hex).l < 0.16 && hsl(colour(id).hex).s < 0.25
const isBrownish = (id: string) => { const { h, s } = hsl(colour(id).hex); return h >= 5 && h <= 45 && s > 0.2 }

export function explain(o: Outfit, ctx: Context = {}): Note[] {
  const notes: Note[] = []
  const add = (n: Note) => notes.push(n)
  const at = (s: Slot) => { const p = o.pieces[s]; const g = p && garment(p.garmentId); return p && g ? { s, p, g } : undefined }
  const worn = (Object.entries(o.pieces) as [Slot, Piece][]).flatMap(([s, p]) => { const g = garment(p.garmentId); return g ? [{ s, p, g }] : [] })
  // A roll-neck or hoodie covers the shirt beneath, so that shirt does not count towards the look.
  const hidden = ['turtleneck', 'hoodie'].includes(o.pieces.mid?.garmentId ?? '') ? 'top' : ''
  const main = worn.filter(w => MAIN.includes(w.s) && w.s !== hidden)
  const top = at('top'), mid = at('mid'), jacket = at('jacket'), coat = at('coat'), bottom = at('bottom'), shoes = at('shoes'), neck = at('neck')
  const is = (w: { g: Garment } | undefined, ...ids: string[]) => !!w && ids.includes(w.g.id)

  // --- Formality (the coat comes off indoors, so it is judged separately)
  const dressed = main.filter(w => w.s !== 'coat')
  const f = dressed.map(w => w.g.formality as number)
  const lo = Math.min(...f), hi = Math.max(...f)
  const low = dressed.find(w => w.g.formality === lo)!, high = dressed.find(w => w.g.formality === hi)!
  if (coat && coat.g.formality - hi >= 2) add({
    id: 'formality-coat', topic: 'Formality', kind: 'interpretation', tone: 'works', slots: ['coat'],
    title: 'A dressy coat over casual clothes',
    body: `The ${name(coat.g)} is the most formal thing you are wearing. Smart outerwear over relaxed pieces is a familiar city look — it polishes the outfit on the street without changing it indoors.`,
  })
  if (hi - lo >= 3) add({
    id: 'formality-gap', topic: 'Formality', kind: 'convention', tone: 'consider', slots: [low.s, high.s],
    title: 'The pieces sit far apart on the formality ladder',
    body: `The ${name(low.g)} is ${FORMALITY[lo].toLowerCase()}, while the ${name(high.g)} is ${FORMALITY[hi].toLowerCase()}. A gap of three rungs or more usually reads as accidental. Bring one end closer to the other.`,
  })
  else if (hi - lo === 2) add({
    id: 'formality-mix', topic: 'Formality', kind: 'interpretation', tone: 'works', slots: [low.s, high.s],
    title: 'A deliberate high–low mix',
    body: `The ${name(high.g)} is dressier than the ${name(low.g)}. Two rungs apart is a modern, relaxed contrast — it works best when everything else is neat and fits well.`,
  })
  else add({
    id: 'formality-even', topic: 'Formality', kind: 'convention', tone: 'works',
    title: `Consistent formality: ${FORMALITY[Math.round((lo + hi) / 2)].toLowerCase()}`,
    body: 'Every main piece stands on the same or a neighbouring rung of the ladder, so the outfit reads as one intention.',
  })

  // --- Occasion
  const occ = ctx.occasion ? occasion(ctx.occasion) : undefined
  if (occ) {
    const core = main.filter(w => w.s !== 'coat')
    const avg = core.reduce((n, w) => n + w.g.formality, 0) / core.length
    const [oLo, oHi] = occ.formality
    if (avg < oLo - 0.5) add({ id: 'occasion-under', topic: 'Occasion', kind: 'convention', tone: 'consider', title: `Dressed down for ${occ.name.toLowerCase()}`, body: `${occ.note} This outfit sits around "${FORMALITY[Math.round(avg)]}". It is easier to remove a layer than to add one, so consider a dressier piece.` })
    else if (avg > oHi + 0.5) add({ id: 'occasion-over', topic: 'Occasion', kind: 'interpretation', tone: 'consider', title: `Dressier than ${occ.name.toLowerCase()} usually calls for`, body: `${occ.note} Overdressing is rarely a mistake, but it can feel stiff. A softer jacket, an open collar or suede shoes would relax it.` })
    else add({ id: 'occasion-fit', topic: 'Occasion', kind: 'convention', tone: 'works', title: `Pitched right for ${occ.name.toLowerCase()}`, body: occ.note })
    if (['interview', 'business', 'funeral', 'wedding'].includes(occ.id) && !jacket) add({ id: 'occasion-jacket', topic: 'Occasion', kind: 'convention', tone: 'consider', slots: ['jacket'], title: 'A jacket is expected here', body: `For ${occ.name.toLowerCase()}, tailoring is the norm. A suit jacket or a dark blazer signals that you have taken the occasion seriously.` })
    if (occ.id === 'funeral' && main.some(w => !['navy', 'charcoal', 'black', 'white', 'mid-grey', 'indigo'].includes(w.p.colour) && w.s !== 'shoes')) add({ id: 'funeral-colour', topic: 'Occasion', kind: 'convention', tone: 'consider', title: 'Funerals call for quiet colour', body: 'Dark suits, a white shirt and a sober tie show respect without drawing attention.' })
    if (occ.id === 'black-tie') {
      const missing: string[] = []
      if (!is(jacket, 'dinner-jacket')) missing.push('a dinner jacket')
      if (!is(top, 'dress-shirt-wing', 'dress-shirt') || o.pieces.top?.colour !== 'white') missing.push('a white evening shirt')
      if (!is(neck, 'bow-tie') || !isBlackish(neck!.p.colour)) missing.push('a black bow tie')
      if (!shoes || !isBlackish(shoes.p.colour) || !['opera-pumps', 'oxford'].includes(shoes.g.id)) missing.push('black oxfords or evening pumps')
      if (!is(bottom, 'dress-trousers-braid', 'suit-trousers', 'dress-trousers') || !isBlackish(bottom!.p.colour) && bottom!.p.colour !== 'navy') missing.push('black or midnight trousers')
      add(missing.length
        ? { id: 'black-tie-kit', topic: 'Occasion', kind: 'convention', tone: 'consider', title: 'Black tie has a fixed kit', body: `Still needed: ${missing.join(', ')}. Black tie is one of the few dress codes where the conventions are firm.` }
        : { id: 'black-tie-kit', topic: 'Occasion', kind: 'convention', tone: 'works', title: 'Correct black tie', body: 'Dinner jacket, evening shirt, black bow tie and black shoes — every element of the code is in place.' })
    }
  }

  // --- Colour harmony
  const accents = main.concat(worn.filter(w => ['neck', 'scarf', 'pocket', 'hat'].includes(w.s))).filter(w => !colour(w.p.colour).neutral)
  const accentIds = [...new Set(accents.map(w => w.p.colour))]
  if (accentIds.length === 0) add({ id: 'colour-neutral', topic: 'Colour', kind: 'interpretation', tone: 'works', title: 'An all-neutral palette', body: 'Every colour is a neutral, so nothing competes. The outfit relies on texture and contrast for interest — add one accent if you want a focal point.' })
  else if (accentIds.length <= 2) {
    const hues = accentIds.map(id => hsl(colour(id).hex).h)
    const gap = hues.length === 2 ? hueGap(hues[0], hues[1]) : 0
    add({
      id: 'colour-accent', topic: 'Colour', kind: 'convention', tone: 'works', slots: accents.map(w => w.s),
      title: accentIds.length === 1 ? `${colour(accentIds[0]).name} as the single accent` : gap < 50 ? 'Two related accents' : 'Two contrasting accents',
      body: accentIds.length === 1
        ? 'A neutral base with one colour is the most reliable recipe in menswear: the accent draws the eye, the neutrals give it somewhere to rest.'
        : gap < 50 ? 'The two accent colours sit near each other on the colour wheel, so they harmonise — an analogous scheme.'
          : 'The accents sit far apart on the colour wheel. That is lively; keeping the rest neutral stops it tipping into busy.',
    })
  } else add({ id: 'colour-many', topic: 'Colour', kind: 'interpretation', tone: 'consider', slots: accents.map(w => w.s), title: `${accentIds.length} accent colours`, body: `${accentIds.map(id => colour(id).name).join(', ')} all compete for attention. Most outfits settle with one or two accents on a neutral base; try turning one into navy, grey or brown.` })

  // Tonal: main garments within one hue family, varied in lightness.
  const hsls = main.filter(w => w.s !== 'shoes').map(w => hsl(colour(w.p.colour).hex))
  const chroma = hsls.filter(c => c.s > 0.12)
  const ls = hsls.map(c => c.l)
  if (chroma.length >= 3 && chroma.every(c => hueGap(c.h, chroma[0].h) < 25)) add({ id: 'colour-tonal', topic: 'Colour', kind: 'interpretation', tone: 'works', title: 'A tonal outfit', body: 'The main pieces share one colour family in different depths. Tonal dressing feels calm and considered; varying the textures keeps the layers distinct.' })

  // --- Contrast
  const inner = top ?? mid
  const outer = jacket ?? mid
  if (inner && outer && inner !== outer) {
    const c = contrast(colour(inner.p.colour).hex, colour(outer.p.colour).hex)
    if (c > 6) add({ id: 'contrast-high', topic: 'Contrast', kind: 'interpretation', tone: 'works', slots: [inner.s, outer.s], title: 'Crisp, high contrast', body: `The light ${name(inner.g)} against the dark ${name(outer.g)} frames the face sharply. High contrast reads formal and graphic.` })
    else if (c < 1.4 && inner.p.colour !== outer.p.colour) add({ id: 'contrast-low', topic: 'Contrast', kind: 'interpretation', tone: 'works', slots: [inner.s, outer.s], title: 'Soft, low contrast', body: `The ${name(inner.g)} and ${name(outer.g)} sit close in depth, which feels relaxed. Different textures stop them blurring together.` })
  }
  if (ls.length >= 3 && Math.max(...ls) - Math.min(...ls) < 0.12 && accentIds.length === 0 && !notes.some(n => n.id === 'colour-tonal')) add({ id: 'contrast-flat', topic: 'Contrast', kind: 'interpretation', tone: 'consider', title: 'Everything is one depth', body: 'All the main pieces share nearly the same lightness, so the outfit can look flat from a distance. One lighter or darker layer would give it shape.' })
  if (jacket && bottom && jacket.p.colour === bottom.p.colour && jacket.p.pattern === bottom.p.pattern && !(TAILORED.has(jacket.g.id) && ['suit-trousers', 'dress-trousers-braid', 'dress-trousers'].includes(bottom.g.id)) && jacket.g.category !== 'outerwear') add({ id: 'contrast-near-suit', topic: 'Contrast', kind: 'interpretation', tone: 'consider', slots: ['jacket', 'bottom'], title: 'Almost — but not quite — a suit', body: 'Jacket and trousers in the same colour but different cloths can look like a mismatched suit. Separates usually read better with clear contrast.' })
  if (jacket?.g.id === 'denim-jacket' && bottom?.g.id === 'jeans') {
    const c = contrast(colour(jacket.p.colour).hex, colour(bottom.p.colour).hex)
    add(c < 1.3
      ? { id: 'denim-on-denim', topic: 'Contrast', kind: 'interpretation', tone: 'consider', slots: ['jacket', 'bottom'], title: 'Matching denim washes', body: 'Denim on denim works best when the two blues differ clearly — a lighter jacket over darker jeans. Identical washes read as a uniform.' }
      : { id: 'denim-on-denim', topic: 'Contrast', kind: 'interpretation', tone: 'works', slots: ['jacket', 'bottom'], title: 'Denim on denim, separated by depth', body: 'The two washes differ enough that each piece holds its own.' })
  }

  // --- Pattern
  const prints = worn.filter(w => PRINTS.has(w.p.pattern))
  const textures = main.filter(w => w.p.pattern !== 'solid' && !PRINTS.has(w.p.pattern))
  if (prints.length >= 2) {
    const scales = prints.map(w => SCALE[w.p.pattern] ?? 2)
    const clash = new Set(scales).size < scales.length
    add(clash
      ? { id: 'pattern-scale', topic: 'Pattern', kind: 'convention', tone: 'consider', slots: prints.map(w => w.s), title: 'Patterns at the same scale', body: `${prints.map(w => `${w.p.pattern} ${name(w.g)}`).join(' and ')} are similar in size, so they compete and can shimmer. Vary the scale — one large, one small — or make one solid.` }
      : { id: 'pattern-scale', topic: 'Pattern', kind: 'convention', tone: 'works', slots: prints.map(w => w.s), title: 'Patterns at different scales', body: 'Each pattern sits at a different size, so the eye reads them as separate layers rather than a clash.' })
    if (prints.length >= 3) add({ id: 'pattern-many', topic: 'Pattern', kind: 'interpretation', tone: 'consider', title: 'Three or more patterns', body: 'Possible, but demanding. Keep colours restrained and every scale clearly distinct.' })
  }
  if (textures.length >= 2) add({ id: 'texture-mix', topic: 'Pattern', kind: 'interpretation', tone: 'works', slots: textures.map(w => w.s), title: 'Texture does the talking', body: `${textures.map(w => w.p.pattern).join(', ')} add depth up close while reading as solid from afar — a quieter alternative to printed pattern.` })

  // --- Silhouette
  const legFit = bottom?.p.fit
  if (bottom && shoes && legFit === 'wide' && SLEEK_SHOES.has(shoes.g.id)) add({ id: 'sil-wide-sleek', topic: 'Silhouette', kind: 'interpretation', tone: 'consider', slots: ['bottom', 'shoes'], title: 'A wide leg over a slim shoe', body: 'The trouser hem swamps a sleek shoe. Wide legs tend to want a shoe with more substance — a derby, a boot or a chunky sneaker.' })
  if (bottom && shoes && legFit === 'slim' && HEAVY_SHOES.has(shoes.g.id)) add({ id: 'sil-slim-heavy', topic: 'Silhouette', kind: 'interpretation', tone: 'consider', slots: ['bottom', 'shoes'], title: 'Slim leg, heavy boot', body: 'A narrow trouser can make a chunky boot look oversized. A straight leg balances the weight.' })
  if (legFit === 'wide' || legFit === 'relaxed') {
    const short = jacket && SHORT_JACKETS.has(jacket.g.id)
    add({ id: 'sil-volume', topic: 'Silhouette', kind: 'interpretation', tone: 'works', slots: ['bottom'], title: `A ${legFit} line`, body: short ? 'A short jacket over fuller trousers balances volume: closer on top, roomier below — a classic workwear and 1950s proportion.' : 'Fuller trousers give a relaxed, drapey line. Keeping the top layer a little shorter or closer helps the proportions.' })
  } else if (legFit === 'slim' && jacket && TAILORED.has(jacket.g.id)) add({ id: 'sil-sharp', topic: 'Silhouette', kind: 'interpretation', tone: 'works', slots: ['jacket', 'bottom'], title: 'A sharp, narrow line', body: 'Slim trousers under tailoring give a lean, 1960s-flavoured silhouette.' })
  if (bottom?.g.id === 'shorts' && jacket && TAILORED.has(jacket.g.id)) add({ id: 'sil-shorts', topic: 'Silhouette', kind: 'convention', tone: 'consider', slots: ['jacket', 'bottom'], title: 'Shorts under tailoring', body: 'Tailored jackets with shorts remain unusual outside resort and fashion contexts. A camp-collar shirt or knit polo alone is the conventional summer answer.' })

  // --- Layering
  if (jacket?.g.id === 'suit-jacket' && bottom && bottom.g.id !== 'suit-trousers') add({ id: 'layer-orphan', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['jacket', 'bottom'], title: 'A suit jacket worn as a separate', body: 'Suit jackets are cut from smooth worsted meant to match their trousers; worn alone they look like half a suit. A blazer or sport coat is made for this job.' })
  if (bottom?.g.id === 'suit-trousers' && jacket?.g.id !== 'suit-jacket') add({ id: 'layer-orphan-trousers', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['bottom'], title: 'Suit trousers without their jacket', body: 'Matched suit trousers on their own often look like a missing jacket. Odd trousers in flannel or cotton are the separates equivalent.' })
  if (jacket?.g.id === 'suit-jacket' && bottom?.g.id === 'suit-trousers' && jacket.p.colour !== bottom.p.colour) add({ id: 'layer-mismatch', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['jacket', 'bottom'], title: 'Mismatched suit', body: 'A suit is defined by matching cloth. Give the jacket and trousers the same colour.' })
  if (coat && jacket) {
    if (coat.g.id === 'peacoat' && TAILORED.has(jacket.g.id)) add({ id: 'layer-coat-length', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['coat', 'jacket'], title: 'The jacket is longer than the coat', body: 'A tailored jacket peeks out beneath a hip-length peacoat. Over tailoring, choose a coat that covers the jacket hem — an overcoat or trench.' })
    else if (SHORT_JACKETS.has(jacket.g.id) && coat.g.id === 'overcoat') add({ id: 'layer-coat-casual', topic: 'Layering', kind: 'interpretation', tone: 'works', slots: ['coat', 'jacket'], title: 'A casual jacket under a formal coat', body: 'An overcoat over a short casual jacket is unusual but can work as an urban layer. Make sure the jacket is slim enough to sit beneath.' })
    else add({ id: 'layer-coat', topic: 'Layering', kind: 'convention', tone: 'works', slots: ['coat', 'jacket'], title: 'Coat over jacket', body: 'The coat is long enough to cover the layer beneath — the rule that keeps outerwear tidy.' })
  }
  if (jacket && TAILORED.has(jacket.g.id) && mid?.g.id === 'hoodie') add({ id: 'layer-hoodie', topic: 'Layering', kind: 'interpretation', tone: 'works', slots: ['jacket', 'mid'], title: 'A hoodie under tailoring', body: 'A deliberate high–low layer. It works best with a soft, unstructured jacket and otherwise simple pieces.' })
  if (neck && top && COLLARLESS.has(top.g.id) && neck.g.id !== 'bow-tie') add({ id: 'layer-tie-collar', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['neck', 'top'], title: 'A tie needs a collar', body: `A ${name(neck.g)} is designed to sit under a shirt collar; with a ${name(top.g)} it has nowhere to anchor.` })
  if (neck && (mid?.g.id === 'turtleneck' || mid?.g.id === 'hoodie')) add({ id: 'layer-tie-hidden', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['neck', 'mid'], title: 'The neckwear is hidden', body: `A ${name(mid!.g)} covers the shirt collar, so the tie has nowhere to go. A roll-neck already does the tie's job.` })
  if (neck && top && ['flannel-shirt', 'camp-collar-shirt', 'polo'].includes(top.g.id) && neck.g.id === 'tie') add({ id: 'layer-tie-casual', topic: 'Layering', kind: 'interpretation', tone: 'consider', slots: ['neck', 'top'], title: 'A formal tie on a casual shirt', body: `A silk tie can look stiff on a ${name(top.g)}. A knit tie, or no tie at all, suits the shirt's mood.` })
  if (neck?.g.id === 'bow-tie' && jacket?.g.id !== 'dinner-jacket') add({ id: 'layer-bow', topic: 'Layering', kind: 'interpretation', tone: 'works', slots: ['neck'], title: 'A bow tie by day', body: 'Outside evening wear, a bow tie is a characterful choice associated with academics and dandies. Wear it with confidence or not at all.' })
  if (o.pieces.pocket && !jacket) add({ id: 'layer-pocket', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['pocket'], title: 'A pocket square with no jacket', body: 'Pocket squares live in a jacket\'s breast pocket. Without one, it is best left at home.' })
  if (o.pieces.pocket && neck && o.pieces.pocket.colour === neck.p.colour && o.pieces.pocket.pattern === neck.p.pattern) add({ id: 'layer-pocket-match', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['pocket', 'neck'], title: 'Pocket square matches the tie', body: 'Matching sets look bought together. Let the square echo a colour from the tie rather than duplicate it — or keep it plain white.' })
  if (o.pieces.belt && shoes) {
    const b = o.pieces.belt.colour, s = shoes.p.colour
    if ((isBlackish(b) && isBrownish(s)) || (isBrownish(b) && isBlackish(s))) add({ id: 'layer-belt', topic: 'Layering', kind: 'convention', tone: 'consider', slots: ['belt', 'shoes'], title: 'Belt and shoes disagree', body: 'With tailoring especially, a belt roughly matches the shoes — black with black, brown with brown.' })
  }
  if (jacket && TAILORED.has(jacket.g.id) && shoes?.g.id === 'sneakers') add({ id: 'layer-sneakers', topic: 'Formality', kind: 'interpretation', tone: hi - lo >= 3 ? 'consider' : 'works', slots: ['jacket', 'shoes'], title: 'Sneakers with tailoring', body: 'A modern signature. Plain, clean leather sneakers keep it intentional; it works with soft jackets better than with sharp suits.' })

  // --- Season
  if (ctx.season) {
    const off = main.filter(w => !w.g.seasons.includes(ctx.season!))
    if (off.length) add({ id: 'season-off', topic: 'Season', kind: 'convention', tone: 'consider', slots: off.map(w => w.s), title: `Out of season for ${ctx.season}`, body: `${off.map(w => `The ${name(w.g)}`).join(' and ')} ${off.length > 1 ? 'are' : 'is'} usually worn in ${[...new Set(off.flatMap(w => w.g.seasons))].join(', ')}. Cloth weight matters as much as style.` })
    else add({ id: 'season-ok', topic: 'Season', kind: 'convention', tone: 'works', title: `Right for ${ctx.season}`, body: 'Every main piece is a sensible weight for the season.' })
    if (ctx.season === 'winter' && !coat && !mid) add({ id: 'season-layer', topic: 'Season', kind: 'interpretation', tone: 'consider', slots: ['coat'], title: 'Light for winter', body: 'Without a knit or a coat, this outfit relies on indoor heating. Add a layer for the walk there.' })
  }
  if (ctx.season === 'summer' && main.some(w => w.p.pattern === 'cord' || w.g.id === 'corduroys')) add({ id: 'season-cord', topic: 'Season', kind: 'convention', tone: 'consider', title: 'Corduroy in summer', body: 'Cord is a heavy, napped cloth for cold months. Linen, cotton or seersucker breathe better.' })

  // --- Tradition
  const st = ctx.style ? style(ctx.style) : undefined
  if (st) {
    const on = worn.filter(w => w.g.styles.includes(st.id))
    const share = on.length / worn.length
    const suggestions = st.garments.filter(id => !worn.some(w => w.g.id === id)).map(garment).filter(g => g?.slot).slice(0, 3) as Garment[]
    add({
      id: 'tradition', topic: 'Tradition', kind: 'interpretation', tone: share >= 0.5 ? 'works' : 'consider', slots: on.map(w => w.s),
      title: share >= 0.5 ? `Recognisably ${st.name}` : `Only loosely ${st.name}`,
      body: `${on.length ? `The ${on.map(w => name(w.g)).join(', ')} belong${on.length === 1 ? 's' : ''} to the tradition.` : 'None of these pieces is central to the tradition.'} ${suggestions.length ? `Key pieces to consider: ${suggestions.map(name).join(', ')}.` : ''} Traditions are starting points, not uniforms.`,
    })
  }

  return notes
}

/** Notes that flag a broken convention — what the randomiser avoids. */
export const hasConflict = (o: Outfit, ctx?: Context) =>
  explain(o, ctx).some(n => n.tone === 'consider' && n.kind === 'convention')
