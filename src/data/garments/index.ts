import type { Category, Garment } from '../types'
import { ACCESSORIES } from './accessories'
import { BOTTOMS, TAILORING } from './lower'
import { FOOTWEAR, OUTERWEAR } from './outer'
import { KNITWEAR, TOPS } from './tops'

export const GARMENTS: Garment[] = [...TOPS, ...KNITWEAR, ...BOTTOMS, ...TAILORING, ...OUTERWEAR, ...FOOTWEAR, ...ACCESSORIES]
export const GARMENT = new Map(GARMENTS.map(g => [g.id, g]))
export const garment = (id: string) => GARMENT.get(id)

export const CATEGORIES: { id: Category; name: string; note: string }[] = [
  { id: 'tops', name: 'Shirts & Tops', note: 'The layer closest to you.' },
  { id: 'knitwear', name: 'Knitwear', note: 'Warmth with texture.' },
  { id: 'bottoms', name: 'Trousers', note: 'Rise, leg and hem.' },
  { id: 'tailoring', name: 'Tailoring', note: 'Jackets, suits and waistcoats.' },
  { id: 'outerwear', name: 'Outerwear', note: 'Coats and jackets for weather.' },
  { id: 'footwear', name: 'Footwear', note: 'Where the outfit lands.' },
  { id: 'accessories', name: 'Accessories', note: 'The finishing details.' },
]

export const FORMALITY = ['', 'Off-duty', 'Casual', 'Smart casual', 'Tailored', 'Formal'] as const
