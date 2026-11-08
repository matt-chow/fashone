export type Category = 'tops' | 'knitwear' | 'bottoms' | 'tailoring' | 'outerwear' | 'footwear' | 'accessories'

/** Figure layer a garment occupies in the Outfit Studio. */
export type Slot =
  | 'top' | 'mid' | 'jacket' | 'coat' | 'bottom' | 'shoes'
  | 'neck' | 'hat' | 'eyewear' | 'scarf' | 'belt' | 'watch' | 'pocket' | 'braces'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
/** 1 = off-duty casual, 2 = casual, 3 = smart casual, 4 = business / tailored, 5 = formal & evening */
export type Formality = 1 | 2 | 3 | 4 | 5

export type PatternId =
  | 'solid' | 'oxford' | 'stripe' | 'pinstripe' | 'chalkstripe' | 'gingham' | 'windowpane'
  | 'tartan' | 'herringbone' | 'houndstooth' | 'denim' | 'cord' | 'cable' | 'rib' | 'seersucker' | 'satin'

export type ColourId = string
export type Fit = 'slim' | 'straight' | 'relaxed' | 'wide'

export interface Garment {
  id: string
  name: string
  aliases?: string[]
  category: Category
  /** Present when the garment is drawable in the Outfit Studio. */
  slot?: Slot
  summary: string
  features: string[]
  /** [name, note] */
  variations?: [string, string][]
  fit?: string
  fabrics?: string
  formality: Formality
  occasions: string[]
  seasons: Season[]
  colours: ColourId[]
  patterns: PatternId[]
  styling?: string
  pairsWith?: string[]
  related?: string[]
  history?: string
  buying?: string[]
  care?: string
  mistakes?: string[]
  styles: string[]
  anatomy?: AnatomyId
  /** Tops worn tucked by default. */
  tucked?: boolean
  /** Supports the trouser silhouette selector. */
  fits?: boolean
}

export type AnatomyId = 'jacket' | 'shirt' | 'trousers' | 'shoe' | 'coat' | 'knit'

export interface StyleEntry {
  id: string
  name: string
  era: string
  /** Approximate year the style coalesced — used to place it on the Atlas timeline. */
  origin: number
  lane: 'tailored' | 'collegiate' | 'work' | 'military' | 'street' | 'modern'
  summary: string
  history: string
  characteristics: string[]
  silhouettes: string
  palette: string
  garments: string[]
  influences: string[]
  presets: string[]
  chapters?: string[]
  sources?: { label: string; url: string }[]
}

export interface Piece {
  garmentId: string
  colour: ColourId
  pattern: PatternId
  fit?: Fit
}

export interface Outfit {
  pieces: Partial<Record<Slot, Piece>>
  figure: { skin: number; hair: number; hairStyle: number }
}

export interface Preset {
  id: string
  name: string
  note: string
  occasion?: string
  styles: string[]
  outfit: Outfit
}

export type Inline = string

export type Block =
  | { t: 'p'; text: Inline }
  | { t: 'h'; text: string }
  | { t: 'list'; items: Inline[] }
  | { t: 'note'; text: Inline }
  | { t: 'deeper'; title: string; body: Inline[] }
  | { t: 'demo'; kind: DemoKind; caption?: string; preset?: string; challenge?: string; anatomy?: AnatomyId }
  | { t: 'compare'; a: { title: string; points: Inline[] }; b: { title: string; points: Inline[] } }

export type DemoKind =
  | 'colour-workshop' | 'silhouette-lab' | 'formality-ladder' | 'pattern-match'
  | 'identify' | 'preset' | 'challenge' | 'anatomy'

export interface Chapter {
  id: string
  volume: 1 | 2 | 3 | 4
  title: string
  dek: string
  minutes: number
  blocks: Block[]
  garments?: string[]
  styles?: string[]
}

export interface Occasion {
  id: string
  name: string
  formality: [number, number]
  seasons?: Season[]
  note: string
}
