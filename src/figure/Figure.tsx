import { useId, type ReactNode } from 'react'
import { colour } from '../data/palette'
import type { Fit, Outfit, Piece, Slot } from '../data/types'
import { NECKWEAR, HATS, EYEWEAR, SCARVES, WATCHES, POCKETS } from './accessories'
import { Body, HAIR_COLOURS, SKIN_TONES } from './body'
import { BELTS, BOTTOMS, SHOES } from './lower'
import { COATS, JACKETS } from './outer'
import { FabricDef } from './patterns'
import type { Ctx, Drawer } from './prims'
import { MIDS, TOPS } from './tops'

export const DRAWERS: Record<Slot, Record<string, Drawer>> = {
  top: TOPS, mid: MIDS, jacket: JACKETS, coat: COATS, bottom: BOTTOMS, shoes: SHOES,
  neck: NECKWEAR, hat: HATS, eyewear: EYEWEAR, scarf: SCARVES, belt: BELTS, braces: BELTS,
  watch: WATCHES, pocket: POCKETS,
}

/** Tops drawn beneath the trousers. */
const TUCKED = new Set(['ocbd', 'dress-shirt', 'dress-shirt-wing', 'chambray-shirt'])
/** Mid layers that hide a shirt collar entirely. */
const HIDES_COLLAR = new Set(['turtleneck', 'hoodie'])
const FIT_W: Record<Fit, number> = { slim: 0, straight: 4, relaxed: 9, wide: 14 }

/** Cropped viewBoxes for specimen plates. */
export const CROP: Record<Slot | 'full', string> = {
  full: '60 0 280 1000',
  top: '90 150 220 430', mid: '90 150 220 430', jacket: '84 150 232 420', coat: '76 150 248 680',
  bottom: '110 400 180 570', shoes: '142 850 116 140', neck: '150 160 100 260',
  hat: '128 10 144 90', eyewear: '150 70 100 50', scarf: '140 160 120 220', belt: '130 395 140 60',
  watch: '250 525 60 50', pocket: '200 255 64 50', braces: '130 170 140 280',
}

export const isDrawable = (slot: Slot, id: string) => !!DRAWERS[slot][id]

interface Props {
  outfit: Outfit
  /** Render a single layer as a specimen, cropped. */
  only?: Slot
  title: string
  className?: string
  children?: ReactNode
}

export function Figure({ outfit, only, title, className, children }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const p = outfit.pieces

  // Each layer is at least as roomy as the one beneath it, so nothing pokes through.
  let w = 0
  const width: Partial<Record<Slot, number>> = {}
  for (const s of ['top', 'mid', 'jacket', 'coat'] as Slot[]) {
    if (p[s]) w = Math.max(w, FIT_W[p[s]!.fit ?? 'straight'])
    width[s] = w
  }

  const ctx = (slot: Slot, piece: Piece, part: Ctx['part'] = 'main'): Ctx => ({
    fill: piece.pattern === 'solid' ? colour(piece.colour).hex : `url(#${uid}-${slot})`,
    base: colour(piece.colour).hex,
    w: width[slot] ?? 0,
    fit: piece.fit ?? 'straight',
    part,
  })
  const draw = (slot: Slot, part: Ctx['part'] = 'main') => {
    const piece = p[slot]
    const fn = piece && DRAWERS[slot][piece.garmentId]
    return fn ? <g key={`${slot}-${part}`} data-slot={slot}>{fn(ctx(slot, piece, part))}</g> : null
  }

  const tucked = !!p.top && TUCKED.has(p.top.garmentId)
  const layers = only
    ? [draw(only)]
    : [
      draw('shoes'),
      tucked && draw('top'),
      draw('bottom'),
      draw('belt'),
      !tucked && draw('top'),
      draw('braces'),
      draw('neck'),
      draw('mid'),
      p.mid && !HIDES_COLLAR.has(p.mid.garmentId) && draw('top', 'collar'),
      draw('jacket'),
      draw('coat'),
      !p.coat && draw('pocket'),
      draw('scarf'),
      draw('watch'),
      draw('eyewear'),
      draw('hat'),
    ]

  const fig = outfit.figure
  return (
    <svg viewBox={CROP[only ?? 'full']} className={className} role="img" aria-label={title} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="fig-shade" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.16" />
          <stop offset="0.28" stopColor="#000" stopOpacity="0" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        {(Object.keys(p) as Slot[]).map(s => p[s]!.pattern !== 'solid' && (
          <FabricDef key={s} id={`${uid}-${s}`} pattern={p[s]!.pattern} base={colour(p[s]!.colour).hex} />
        ))}
      </defs>
      {!only && (
        <Body
          skin={SKIN_TONES[fig.skin % SKIN_TONES.length].hex}
          hair={HAIR_COLOURS[fig.hair % HAIR_COLOURS.length].hex}
          hairStyle={fig.hairStyle}
        />
      )}
      {layers}
      {children}
    </svg>
  )
}
