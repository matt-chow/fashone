import type { Fit } from '../data/types'
import { darken } from '../lib/color'
import { both, mirror, poly, smooth, sym, type Pt } from './geometry'
import { Btn, INK, L, S, range, type Ctx, type Drawer } from './prims'

/** Half-widths at thigh, knee and hem for each trouser silhouette. */
export const LEG: Record<Fit, { t: number; k: number; h: number }> = {
  slim: { t: 25, k: 20, h: 15 },
  straight: { t: 27, k: 24, h: 23 },
  relaxed: { t: 31, k: 29, h: 29 },
  wide: { t: 34, k: 34, h: 37 },
}

interface TSpec { hem?: number; waist?: number; pleats?: boolean; crease?: boolean; turnup?: boolean; jeans?: boolean; cargo?: boolean; fatigue?: boolean; loops?: boolean; shorts?: boolean }

function legPoints(fit: Fit, hem: number, waist: number, shorts: boolean): Pt[] {
  const g = LEG[fit], ws = fit === 'wide' ? 4 : fit === 'relaxed' ? 2 : 0
  const at = (centre: number, hw: number) => { const inner = Math.min(centre + hw, 197); return [inner - 2 * hw, inner] }
  const [oT, iT] = at(174, g.t + (shorts ? 4 : 0))
  const [oK, iK] = at(176, g.k)
  const [oH, iH] = shorts ? [oT - 3, iT] : at(180, g.h)
  const knee: Pt[] = shorts ? [] : [[oK, 720]]
  const kneeIn: Pt[] = shorts ? [] : [[iK, 720]]
  return [[200, waist, 1], [150 - ws, waist, 1], [146 - ws, 472], [oT, 560], ...knee, [oH, hem, 1], [iH, hem, 1], ...kneeIn, [iT, 560], [200, 536, 1]]
}

function Trousers({ c, s }: { c: Ctx; s: TSpec }) {
  const shorts = !!s.shorts
  const hem = s.hem ?? (shorts ? 640 : c.fit === 'wide' ? 950 : 946)
  const waist = s.waist ?? 418
  const pts = legPoints(c.fit, hem, waist, shorts)
  const [oH, iH] = [pts[pts.length - 5 + (shorts ? 1 : 0)][0], pts[pts.length - 4 + (shorts ? 1 : 0)][0]]
  const stitch = '#c99a3c'
  return (
    <g>
      <S d={sym(pts)} fill={c.fill} />
      <L d={`M${150},${waist + 14} L250,${waist + 14}`} o={0.6} />
      {(s.loops ?? true) && [158, 182, 218, 242].map(x => <rect key={x} x={x - 2} y={waist} width={4} height={15} fill="none" stroke={INK} strokeOpacity={0.6} strokeWidth={0.8} />)}
      <L d={`M201,${waist + 15} L201,500 Q201,508 194,508`} o={0.55} />
      <Btn x={200} y={waist + 7} r={2.2} fill={s.jeans ? '#b08a3a' : darken(c.base, 0.3)} />
      {s.jeans
        ? <>
          <L d={`M154,${waist + 16} Q166,452 182,${waist + 18} M246,${waist + 16} Q234,452 218,${waist + 18}`} color={stitch} dash="3 2" o={0.9} />
          <L d={`M197,${waist + 16} L197,502 Q197,512 188,512`} color={stitch} dash="3 2" o={0.9} />
          <circle cx={157} cy={waist + 20} r={1.6} fill="#b08a3a" /><circle cx={243} cy={waist + 20} r={1.6} fill="#b08a3a" />
        </>
        : <L d={`M152,${waist + 18} L164,476 M248,${waist + 18} L236,476`} o={0.6} />}
      {s.pleats && <L d={`M182,${waist + 16} L180,486 M218,${waist + 16} L220,486 M172,${waist + 16} L172,470 M228,${waist + 16} L228,470`} o={0.55} />}
      {s.crease && !shorts && <L d={`M176,${waist + 30} L${(oH + iH) / 2},${hem - 2} M224,${waist + 30} L${400 - (oH + iH) / 2},${hem - 2}`} o={0.4} />}
      {s.turnup && !shorts && both([[oH - 0.5, hem - 14], [iH, hem - 14]], false).map((d, i) => <L key={i} d={d} sw={1.1} />)}
      {s.cargo && [oH < 140 ? 134 : 140].flatMap(x => [x, 400 - x - 38]).map(x => <g key={x}>
        <S d={poly([[x, 560], [x + 38, 560], [x + 38, 616], [x, 616]], true)} fill={c.fill} shade={false} sw={1} />
        <S d={poly([[x - 1, 556], [x + 39, 556], [x + 39, 572], [x - 1, 572]], true)} fill={c.fill} shade={false} sw={1} />
      </g>)}
      {s.fatigue && [[158, 500], [206, 500]].map(([x, y]) => <S key={x} d={poly([[x, y], [x + 34, y + 4], [x + 32, y + 50], [x - 2, y + 46]], true)} fill={c.fill} shade={false} sw={1} />)}
      {!shorts && <L d={`M164,700 Q176,712 190,702 M236,700 Q224,712 210,702`} o={0.2} />}
      {s.jeans && !shorts && both([[oH, hem - 10], [iH, hem - 10]], false).map((d, i) => <L key={i} d={d} color={stitch} dash="3 2" o={0.8} />)}
    </g>
  )
}

export const BOTTOMS: Record<string, Drawer> = {
  jeans: c => <Trousers c={c} s={{ jeans: true }} />,
  chinos: c => <Trousers c={c} s={{}} />,
  'dress-trousers': c => <Trousers c={c} s={{ crease: true, loops: false }} />,
  'pleated-trousers': c => <Trousers c={c} s={{ pleats: true, crease: true, turnup: true, waist: 408, loops: false }} />,
  'suit-trousers': c => <Trousers c={c} s={{ crease: true, loops: false }} />,
  corduroys: c => <Trousers c={c} s={{}} />,
  'linen-trousers': c => <Trousers c={c} s={{ pleats: true, loops: false }} />,
  'cargo-trousers': c => <Trousers c={c} s={{ cargo: true }} />,
  'fatigue-trousers': c => <Trousers c={c} s={{ fatigue: true }} />,
  shorts: c => <Trousers c={c} s={{ shorts: true }} />,
  'dress-trousers-braid': c => <><Trousers c={c} s={{ crease: true, loops: false }} /><L d="M146,480 L160,940 M254,480 L240,940" sw={3} color={darken(c.base, 0.4)} o={1} /></>,
}

/* ── Footwear ───────────────────────────────────────────── */
const UPPER: Pt[] = [[166, 932], [161, 948], [162, 962], [171, 970], [190, 970], [197, 960], [196, 942], [192, 932]]
const SOLE: Pt[] = [[160, 956], [162, 968, 1], [172, 976], [190, 976], [198, 968, 1], [198, 956]]
const SHAFT = (top: number): Pt[] => [[164, top, 1], [193, top, 1], [196, 940], [162, 940]]

function Pair({ c, sole = '#2a2420', shaft, children, upper = UPPER, soleShape = SOLE }: { c: Ctx; sole?: string; shaft?: number; children?: (side: 'l' | 'r') => React.ReactNode; upper?: Pt[]; soleShape?: Pt[] }) {
  return (
    <g>
      {(['l', 'r'] as const).map(side => {
        const m = (p: Pt[]) => (side === 'l' ? p : mirror(p))
        return (
          <g key={side}>
            {shaft && <S d={smooth(m(SHAFT(shaft)))} fill={c.fill} />}
            <S d={smooth(m(soleShape))} fill={sole} shade={false} />
            <S d={smooth(m(upper))} fill={c.fill} />
            <g transform={side === 'r' ? 'translate(400,0) scale(-1,1)' : undefined}>{children?.(side)}</g>
          </g>
        )
      })}
    </g>
  )
}

export const SHOES: Record<string, Drawer> = {
  oxford: c => <Pair c={c}>{() => <><L d="M163,954 Q179,961 196,953" /><L d="M176,932 L180,944 L184,932" o={0.8} /><L d="M177,936 L183,936 M178,940 L182,940" o={0.6} /></>}</Pair>,
  derby: c => <Pair c={c}>{() => <><L d="M170,932 Q174,946 178,950 M190,932 Q186,946 182,950" /><L d="M174,936 L186,936 M175,941 L185,941 M177,946 L183,946" o={0.6} /></>}</Pair>,
  brogue: c => <Pair c={c}>{() => <><L d="M163,954 Q179,961 196,953" dash="0.1 3" sw={1.6} /><L d="M163,951 Q179,958 196,950" /><L d="M176,932 L180,944 L184,932" o={0.8} /><L d="M174,964 L184,964" dash="0.1 2.6" sw={1.6} /></>}</Pair>,
  loafer: c => <Pair c={c}>{() => <><L d="M166,946 Q180,936 195,946" /><L d="M168,950 L194,950" sw={3} o={0.7} /><L d="M177,948 L185,948" sw={2} color="#e8dcc0" o={0.8} /></>}</Pair>,
  'monk-strap': c => <Pair c={c}>{() => <><L d="M163,954 Q179,961 196,953" o={0.5} /><path d="M170,946 L198,938 L198,946 L172,952Z" fill={darken(c.base, 0.15)} stroke={INK} strokeWidth={0.8} /><rect x={188} y={939} width={6} height={8} fill="none" stroke="#c9a646" strokeWidth={1.4} /></>}</Pair>,
  sneakers: c => <Pair c={c} sole="#efebe1">{() => <><L d="M163,954 Q179,960 196,953" o={0.5} />{range(934, 948, 4).map(y => <L key={y} d={`M174,${y} L186,${y}`} o={0.7} />)}<L d="M162,962 L198,962" o={0.4} /></>}</Pair>,
  'chelsea-boots': c => <Pair c={c} shaft={872}>{() => <><path d="M164,890 L170,935 L176,890Z" fill={darken(c.base, 0.35)} stroke={INK} strokeWidth={0.8} /><L d="M176,872 L178,862 L184,862 L186,872" o={0.7} /></>}</Pair>,
  'service-boots': c => <Pair c={c} shaft={864}>{() => <><L d="M163,954 Q179,961 196,953" />{range(872, 932, 10).map(y => <L key={y} d={`M174,${y} L186,${y + 4} M186,${y} L174,${y + 4}`} o={0.7} />)}</>}</Pair>,
  'work-boots': c => <Pair c={c} shaft={862} sole="#d9c6a0" soleShape={[[159, 952], [160, 972, 1], [172, 980], [191, 980], [200, 972, 1], [199, 952]]}>{() => <><S d={poly([[163, 862], [194, 862], [194, 870], [163, 870]], true)} fill={darken(c.base, 0.2)} shade={false} sw={0.8} />{range(876, 930, 11).map(y => <L key={y} d={`M173,${y} L187,${y + 5} M187,${y} L173,${y + 5}`} o={0.7} />)}<L d="M163,954 Q179,962 197,953" /></>}</Pair>,
  'chukka-boots': c => <Pair c={c} shaft={888} sole="#b98a52">{() => <><L d="M176,892 L176,934 M184,892 L184,934" o={0.6} /><L d="M175,900 L185,904 M185,900 L175,904 M175,914 L185,918" o={0.7} /></>}</Pair>,
  sandals: c => <Pair c={c} upper={[[166, 944], [164, 952], [196, 952], [195, 944]]}>{() => <><S d={poly([[167, 932], [192, 932], [192, 938], [167, 938]], true)} fill={c.fill} shade={false} sw={0.8} /></>}</Pair>,
  'opera-pumps': c => <Pair c={c}>{() => <><path d="M176,946 L184,946 L180,952Z" fill="#111" /><L d="M166,946 Q180,940 195,946" o={0.6} /></>}</Pair>,
}

/** Belts and braces sit on the trousers. */
export const BELTS: Record<string, Drawer> = {
  belt: c => (
    <g>
      <S d={poly([[148 - c.w, 419], [252 + c.w, 419], [252 + c.w, 431], [148 - c.w, 431]], true)} fill={c.fill} shade={false} sw={1} />
      <rect x={193} y={417} width={14} height={16} rx={1.5} fill="none" stroke="#b8a060" strokeWidth={2.4} />
      <L d="M150,425 L250,425" dash="2 2" o={0.3} />
    </g>
  ),
  braces: c => (
    <g>
      {both([[174, 430], [172, 300], [168, 190]], false).map((d, i) => <path key={i} d={d} stroke={c.base} strokeWidth={7} fill="none" />)}
      {both([[174, 430], [172, 300], [168, 190]], false).map((d, i) => <path key={`o${i}`} d={d} stroke={INK} strokeWidth={8.6} fill="none" opacity={0.25} />)}
      <rect x={168} y={418} width={12} height={14} fill={c.base} stroke={INK} strokeWidth={0.8} /><rect x={220} y={418} width={12} height={14} fill={c.base} stroke={INK} strokeWidth={0.8} />
    </g>
  ),
}
