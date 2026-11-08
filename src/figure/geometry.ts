/**
 * The figure lives in a 400 × 1000 viewBox, centred on x = 200.
 * A point is [x, y] or [x, y, 1] — the trailing 1 marks a sharp corner.
 */
export type Pt = [number, number] | [number, number, 1]

export const CX = 200
export const mx = (x: number) => 2 * CX - x
export const mirror = (pts: Pt[]): Pt[] => pts.map(p => (p.length === 3 ? [mx(p[0]), p[1], 1] : [mx(p[0]), p[1]]))

const f = (n: number) => Math.round(n * 10) / 10

/** Catmull-Rom spline through the points; corners marked sharp stay sharp. */
export function smooth(pts: Pt[], closed = true, t = 0.9): string {
  const n = pts.length
  const at = (i: number) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))]
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`
  const last = closed ? n : n - 1
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
    const c1 = p1.length === 3 ? p1 : [p1[0] + ((p2[0] - p0[0]) * t) / 6, p1[1] + ((p2[1] - p0[1]) * t) / 6]
    const c2 = p2.length === 3 ? p2 : [p2[0] - ((p3[0] - p1[0]) * t) / 6, p2[1] - ((p3[1] - p1[1]) * t) / 6]
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`
  }
  return closed ? d + 'Z' : d
}

/** A left half (running from the centre line round to the centre line) closed into a symmetric shape. */
export const sym = (left: Pt[]) => smooth([...left, ...mirror(left).reverse().slice(1, -1)])

/** The same path drawn on both sides of the figure. */
export const both = (left: Pt[], closed = true) => [smooth(left, closed), smooth(mirror(left), closed)]

export const poly = (pts: Pt[], closed = false) =>
  'M' + pts.map(p => `${f(p[0])},${f(p[1])}`).join(' L') + (closed ? 'Z' : '')
