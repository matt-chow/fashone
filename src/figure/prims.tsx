import type { ReactNode } from 'react'
import type { Fit } from '../data/types'

export const INK = 'var(--figure-ink, #241b16)'

/** What every garment drawer receives. */
export interface Ctx {
  /** Fill for the cloth: a hex or url(#pattern). */
  fill: string
  /** The garment's base colour as hex, for trims and details. */
  base: string
  /** Extra half-width from the silhouette selector (tops: trim 0 → relaxed 12). */
  w: number
  fit: Fit
  part: 'main' | 'collar'
}
export type Drawer = (c: Ctx) => ReactNode

/** A filled cloth shape with ink outline and a soft volumetric shade. */
export function S({ d, fill, sw = 1.4, shade = true }: { d: string; fill: string; sw?: number; shade?: boolean }) {
  return (
    <>
      <path d={d} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      {shade && <path d={d} fill="url(#fig-shade)" style={{ pointerEvents: 'none' }} />}
    </>
  )
}

/** A detail stroke: seams, folds, stitching. */
export function L({ d, o = 0.75, sw = 1, dash, color = INK }: { d: string; o?: number; sw?: number; dash?: string; color?: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeOpacity={o} strokeDasharray={dash} strokeLinecap="round" />
}

export function Btn({ x, y, r = 2.6, fill = '#d8ccb0' }: { x: number; y: number; r?: number; fill?: string }) {
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={INK} strokeWidth={0.8} />
}

export const range = (from: number, to: number, step: number) => {
  const out: number[] = []
  for (let v = from; v <= to + 0.01; v += step) out.push(v)
  return out
}
