const parse = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const toHex = (rgb: number[]) =>
  '#' + rgb.map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')

/** Mix two hex colours; t = 0 → a, 1 → b. */
export const mix = (a: string, b: string, t: number) => {
  const A = parse(a), B = parse(b)
  return toHex(A.map((v, i) => v + (B[i] - v) * t))
}
export const darken = (hex: string, t: number) => mix(hex, '#000000', t)
export const lighten = (hex: string, t: number) => mix(hex, '#ffffff', t)

export function hsl(hex: string) {
  const [r, g, b] = parse(hex).map(v => v / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return { h: h * 60, s, l }
}

export function luminance(hex: string) {
  const [r, g, b] = parse(hex).map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

/** Shortest angular distance between two hues, 0–180. */
export const hueGap = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

/** A tone that reads against the given ground: lighter on dark fabric, darker on light. */
export const against = (hex: string, t = 0.35) => (luminance(hex) < 0.18 ? lighten(hex, t) : darken(hex, t))
