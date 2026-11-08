import type { PatternId } from '../data/types'
import { against, darken, lighten, luminance } from '../lib/color'

/** SVG <pattern> definition for a fabric. Solid fabrics need none — use the hex directly. */
export function FabricDef({ id, pattern, base }: { id: string; pattern: PatternId; base: string }) {
  const dark = darken(base, 0.28)
  const light = lighten(base, 0.55)
  const line = against(base, 0.4)
  const P = (w: number, h: number, children: React.ReactNode, transform?: string) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h} patternTransform={transform}>
      <rect width={w} height={h} fill={base} />
      {children}
    </pattern>
  )
  switch (pattern) {
    case 'oxford':
      return P(4, 4, <><rect width={2} height={2} fill={lighten(base, 0.18)} /><rect x={2} y={2} width={2} height={2} fill={darken(base, 0.06)} /></>)
    case 'stripe':
      return P(12, 12, <rect width={4} height={12} fill={luminance(base) > 0.5 ? '#3d5a8a' : light} opacity={0.75} />)
    case 'seersucker':
      return P(10, 10, <rect width={5} height={10} fill="#f3f0e8" opacity={0.85} />)
    case 'pinstripe':
      return P(11, 11, <rect width={1} height={11} fill={light} opacity={0.65} />)
    case 'chalkstripe':
      return P(18, 18, <rect width={2} height={18} fill={light} opacity={0.45} />)
    case 'gingham':
      return P(12, 12, <>
        <rect width={12} height={12} fill="#f3f0e8" />
        <rect width={6} height={12} fill={base} opacity={0.55} />
        <rect width={12} height={6} fill={base} opacity={0.55} />
      </>)
    case 'windowpane':
      return P(34, 34, <><rect width={1.3} height={34} fill={line} opacity={0.6} /><rect width={34} height={1.3} fill={line} opacity={0.6} /></>)
    case 'tartan':
      return P(36, 36, <>
        <rect x={0} width={12} height={36} fill={dark} opacity={0.55} />
        <rect y={0} width={36} height={12} fill={dark} opacity={0.55} />
        <rect x={20} width={2} height={36} fill={light} opacity={0.5} />
        <rect y={20} width={36} height={2} fill={light} opacity={0.5} />
        <rect x={28} width={1} height={36} fill="#b8973e" opacity={0.6} />
      </>)
    case 'herringbone':
      return P(8, 8, <path d="M0,8 L4,0 M4,0 L8,8" stroke={darken(base, 0.25)} strokeWidth={1.2} fill="none" opacity={0.6} />)
    case 'houndstooth':
      return P(10, 10, <path d="M0,0 h5 l5,5 v5 h-5 l-5,-5Z M0,5 l-2,3 M5,0 l3,-2" fill={line} opacity={0.55} />, 'rotate(45)')
    case 'denim':
      return P(4, 4, <path d="M0,4 L4,0" stroke={lighten(base, 0.2)} strokeWidth={0.8} opacity={0.6} />)
    case 'cord':
      return P(4, 4, <rect width={1.5} height={4} fill={darken(base, 0.22)} opacity={0.55} />)
    case 'rib':
      return P(4, 4, <rect width={1.2} height={4} fill={darken(base, 0.14)} opacity={0.6} />)
    case 'cable':
      return P(24, 24, <>
        <rect width={1.2} height={24} x={2} fill={darken(base, 0.18)} opacity={0.6} />
        <rect width={1.2} height={24} x={21} fill={darken(base, 0.18)} opacity={0.6} />
        <path d="M8,0 C16,6 16,6 8,12 C16,18 16,18 8,24 M16,0 C8,6 8,6 16,12 C8,18 8,18 16,24" stroke={darken(base, 0.24)} strokeWidth={1.4} fill="none" opacity={0.65} />
      </>)
    case 'satin':
      return P(30, 30, <path d="M0,30 L30,0" stroke={lighten(base, 0.25)} strokeWidth={6} opacity={0.35} />)
    default:
      return null
  }
}

export const isPatterned = (p: PatternId) => p !== 'solid'
