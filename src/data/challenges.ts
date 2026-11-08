import type { Season } from './types'

/** Outfit challenges: a brief, a starting point, and the context the explanation engine checks against. */
export interface Challenge {
  id: string
  title: string
  brief: string
  occasion: string
  season?: Season
  style?: string
  /** Garment ids that must appear, with the reason shown if missing. */
  needs?: [string[], string][]
  hint: string
}

export const CHALLENGES: Challenge[] = [
  { id: 'smart-casual-dinner', title: 'Smart-casual dinner', brief: 'A Friday dinner at a good restaurant in autumn. No tie, but you want to look put together.', occasion: 'dinner', season: 'autumn', needs: [[['blazer', 'sport-coat', 'cardigan', 'chore-coat', 'overshirt'], 'Add a jacket-like layer — a blazer, sport coat or cardigan.']], hint: 'Start from a collared shirt or fine knit, add a textured jacket, finish with leather shoes.' },
  { id: 'interview', title: 'The interview', brief: 'A first interview at a traditional law firm. You want to look capable and comfortable, not flashy.', occasion: 'interview', needs: [[['suit-jacket', 'blazer'], 'A suit jacket or a dark blazer is expected.'], [['tie', 'knit-tie'], 'At a traditional firm, wear a tie.']], hint: 'Navy or charcoal, a white or pale blue shirt, a quiet tie, dark leather shoes.' },
  { id: 'summer-wedding', title: 'Country wedding', brief: 'A daytime wedding in a garden in July. The invitation says "summer formal".', occasion: 'wedding', season: 'summer', needs: [[['suit-jacket', 'blazer', 'double-breasted-jacket'], 'Weddings call for tailoring.']], hint: 'Lighter colours and breathable cloth are fine by day. Avoid white and anything louder than the groom.' },
  { id: 'winter-weekend', title: 'Cold weekend walk', brief: 'A frosty Saturday in the countryside, then lunch at a pub.', occasion: 'outdoors', season: 'winter', needs: [[['peacoat', 'parka', 'field-jacket', 'overcoat', 'chore-coat'], 'You will want proper outerwear.']], hint: 'Layer texture: flannel or knit, a sturdy coat, boots.' },
  { id: 'ivy', title: 'Autumn lecture, Ivy style', brief: 'Dress for a lecture on a 1950s American campus — or a modern take on it.', occasion: 'weekend', season: 'autumn', style: 'ivy', needs: [[['ocbd'], 'The oxford button-down is the Ivy cornerstone.'], [['loafer', 'brogue', 'derby'], 'Ivy shoes are loafers, brogues or derbies.']], hint: 'Oxford shirt, crewneck or blazer, khakis or flannels, loafers.' },
  { id: 'black-tie', title: 'Black tie', brief: 'An invitation reads "Black Tie". Assemble the correct kit.', occasion: 'black-tie', needs: [[['dinner-jacket'], 'Black tie requires a dinner jacket.'], [['bow-tie'], 'And a bow tie.']], hint: 'There is little room for interpretation here — that is the point.' },
  { id: 'workwear', title: 'Saturday workshop', brief: 'A day restoring furniture, then drinks with friends.', occasion: 'weekend', season: 'spring', style: 'workwear', needs: [[['chore-coat', 'denim-jacket', 'overshirt', 'flannel-shirt', 'chambray-shirt'], 'Add a hard-wearing workwear layer.']], hint: 'Denim, canvas, flannel and leather boots — honest materials.' },
]

export const challenge = (id: string) => CHALLENGES.find(c => c.id === id)
