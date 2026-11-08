import { VOL1 } from './vol1'
import { VOL2 } from './vol2'
import { VOL3, VOL4 } from './vol34'

export const CHAPTERS = [...VOL1, ...VOL2, ...VOL3, ...VOL4]
export const chapter = (id: string) => CHAPTERS.find(c => c.id === id)

export const VOLUMES = [
  { n: 1, title: 'Foundations', note: 'Fit, colour, pattern, formality and proportion.' },
  { n: 2, title: 'Building a Wardrobe', note: 'Garment by garment, from shirts to shoes.' },
  { n: 3, title: 'Dressing with Intention', note: 'Occasions, seasons and the great traditions.' },
  { n: 4, title: 'Beyond the Basics', note: 'Taste, quality, care and personal style.' },
] as const
