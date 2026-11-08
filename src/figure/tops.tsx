import { darken, lighten } from '../lib/color'
import { both, mirror, poly, smooth, sym, type Pt } from './geometry'
import { Btn, L, S, range, type Ctx, type Drawer } from './prims'

/** Left half of a torso, centre-neck to centre-hem. */
export function torso(w: number, hem: number, neckY = 186, tail = false): Pt[] {
  const neck: Pt[] = neckY > 200 ? [[200, neckY, 1], [188, 172, 1]] : [[200, neckY], [188, 173, 1]]
  const hemPts: Pt[] = tail ? [[148 - w, hem - 22], [160 - w, hem - 4], [184, hem + 4], [200, hem + 6]] : [[147 - w, hem, 1], [200, hem]]
  return [...neck, [160, 184], [131 - w * 0.3, 195], [139 - w, 264], [148 - w, 410], ...hemPts]
}

export function sleeve(w: number, end: number): Pt[] {
  if (end < 360)
    return [[131 - w * 0.3, 195], [116 - w * 0.5, 246], [109 - w * 0.6, end, 1], [143, end + 3, 1], [140 - w, 264]]
  return [[131 - w * 0.3, 195], [117 - w * 0.5, 248], [109 - w * 0.5, 330], [105 - w * 0.5, 400], [107 - w * 0.4, 480], [108 - w * 0.3, end, 1], [135, end, 1], [135, 480], [137, 400], [140, 320], [140 - w, 264]]
}

const Sleeves = ({ c, end }: { c: Ctx; end: number }) => (
  <>{both(sleeve(c.w, end)).map((d, i) => <S key={i} d={d} fill={c.fill} />)}</>
)

const Cuffs = ({ c, end, h = 14 }: { c: Ctx; end: number; h?: number }) => {
  const left: Pt[] = [[108 - c.w * 0.3, end - h, 1], [135, end - h, 1], [135, end, 1], [108 - c.w * 0.3, end, 1]]
  return <>{[left, mirror(left)].map((p, i) => <S key={i} d={poly(p, true)} fill={c.fill} shade={false} />)}</>
}

type CollarKind = 'point' | 'spread' | 'bd' | 'camp' | 'polo' | 'wing'
const TIPS: Record<CollarKind, [number, number]> = {
  point: [178, 212], spread: [167, 199], bd: [177, 214], camp: [160, 222], polo: [176, 207], wing: [192, 186],
}

export function Collar({ c, kind, centre = 192 }: { c: Ctx; kind: CollarKind; centre?: number }) {
  const [tx, ty] = TIPS[kind]
  const wing: Pt[] = kind === 'camp'
    ? [[199, centre, 1], [186, 164, 1], [178, 170], [tx, ty, 1], [176, 232], [196, centre + 6]]
    : [[199, centre, 1], [187, 163, 1], [182, 170], [tx, ty, 1]]
  return (
    <g>
      <S d={smooth([[185, 160], [200, 164], [215, 160], [215, 174, 1], [200, 180], [185, 174, 1]])} fill={c.fill} shade={false} />
      {[wing, mirror(wing)].map((p, i) => <S key={i} d={smooth(p)} fill={c.fill} />)}
      {kind === 'bd' && <><Btn x={180} y={206} r={1.6} /><Btn x={220} y={206} r={1.6} /></>}
    </g>
  )
}

function Shirt({ c, collar, sleeveEnd = 556, tucked = true, pockets = 0, placket = true }:
  { c: Ctx; collar: CollarKind; sleeveEnd?: number; tucked?: boolean; pockets?: number; placket?: boolean }) {
  const hem = tucked ? 470 : 506
  const centre = collar === 'camp' ? 236 : 192
  if (c.part === 'collar') return <Collar c={c} kind={collar} centre={centre} />
  return (
    <g>
      <S d={sym(torso(c.w, hem, collar === 'camp' ? centre : 186, !tucked))} fill={c.fill} />
      <Sleeves c={c} end={sleeveEnd} />
      {sleeveEnd > 360 && <Cuffs c={c} end={sleeveEnd} />}
      {placket && <L d={`M196,${centre} L196,${hem} M204,${centre} L204,${hem}`} o={0.35} />}
      {placket && range(centre + 30, hem - 20, 40).map(y => <Btn key={y} x={200} y={y} r={2.2} fill={lighten(c.base, 0.5)} />)}
      {pockets > 0 && <S d={poly([[214, 270], [244, 270], [244, 306], [229, 312], [214, 306]], true)} fill={c.fill} shade={false} />}
      {pockets > 1 && <S d={poly([[156, 270], [186, 270], [186, 306], [171, 312], [156, 306]], true)} fill={c.fill} shade={false} />}
      {tucked && <L d={`M${152 - c.w},404 Q176,414 200,408 Q224,414 ${248 + c.w},404`} o={0.4} />}
      <L d="M168,230 Q160,300 166,360 M232,230 Q240,300 234,360" o={0.18} />
      <Collar c={c} kind={collar} centre={centre} />
    </g>
  )
}

function Tee({ c, neck = 'crew', placket = 0, collar }: { c: Ctx; neck?: 'crew' | 'v'; placket?: number; collar?: CollarKind }) {
  if (c.part === 'collar') return collar ? <Collar c={c} kind={collar} /> : null
  const neckY = neck === 'v' ? 222 : 186
  return (
    <g>
      <S d={sym(torso(c.w, 492, neckY))} fill={c.fill} />
      <Sleeves c={c} end={302} />
      <L d={`M${109 - c.w * 0.6},${296} L143,${299} M${291 + c.w * 0.6},296 L257,299`} o={0.4} />
      {!collar && <L d={neck === 'v' ? 'M186,174 L200,214 L214,174' : 'M187,176 Q200,192 213,176'} o={0.55} sw={1.4} />}
      <L d={`M${148 - c.w},484 L${252 + c.w},484`} o={0.3} dash="2 2" />
      {placket > 0 && <>
        <L d="M196,184 L196,252 M204,184 L204,252" o={0.4} />
        {range(198, 198 + (placket - 1) * 22, 22).map(y => <Btn key={y} x={200} y={y} r={2} fill={lighten(c.base, 0.4)} />)}
      </>}
      {collar && <Collar c={c} kind={collar} />}
    </g>
  )
}

/** Knitwear and jersey mid-layers. */
function Knit({ c, neck, hood, open, sleeveEnd = 552 }: { c: Ctx; neck: 'crew' | 'v' | 'turtle' | 'cardigan'; hood?: boolean; open?: boolean; sleeveEnd?: number }) {
  if (c.part === 'collar') return null
  const rib = darken(c.base, 0.12)
  const vY = neck === 'v' ? 262 : neck === 'cardigan' ? 310 : 188
  const hem = 488
  return (
    <g>
      <S d={sym(torso(c.w + 2, hem, vY))} fill={c.fill} />
      <Sleeves c={{ ...c, w: c.w + 2 }} end={sleeveEnd} />
      <Cuffs c={{ ...c, w: c.w + 2, fill: rib }} end={sleeveEnd} h={16} />
      <S d={poly([[146 - c.w, 470, 1], [254 + c.w, 470, 1], [254 + c.w, hem, 1], [146 - c.w, hem, 1]], true)} fill={rib} shade={false} />
      {range(150 - c.w, 250 + c.w, 5).map(x => <L key={x} d={`M${x},472 L${x},486`} o={0.25} />)}
      {neck === 'crew' && !hood && <S d={smooth([[184, 170], [200, 180], [216, 170], [219, 180], [200, 194], [181, 180]])} fill={rib} shade={false} />}
      {(neck === 'v' || neck === 'cardigan') && <L d={`M182,176 L200,${vY + 4} L218,176`} sw={5} color={rib} o={1} />}
      {(neck === 'v' || neck === 'cardigan') && <L d={`M188,172 L200,${vY} L212,172`} o={0.6} />}
      {neck === 'cardigan' && <>
        <L d={`M200,${vY} L200,${hem}`} sw={7} color={rib} o={1} />
        {range(vY + 20, hem - 14, 38).map(y => <Btn key={y} x={200} y={y} r={2.8} fill={darken(c.base, 0.4)} />)}
      </>}
      {neck === 'turtle' && <>
        <S d={smooth([[184, 132, 1], [216, 132, 1], [219, 184], [200, 192], [181, 184]])} fill={rib} />
        {range(188, 212, 4).map(x => <L key={x} d={`M${x},136 L${x},186`} o={0.2} />)}
      </>}
      {hood && <>
        <S d={smooth([[156, 192], [168, 166], [200, 154], [232, 166], [244, 192], [218, 196], [200, 200], [182, 196]])} fill={c.fill} />
        <S d={smooth([[184, 172], [200, 182], [216, 172], [212, 188], [200, 194], [188, 188]])} fill={darken(c.base, 0.3)} shade={false} />
        <L d="M194,192 L192,262 M206,192 L208,262" sw={1.6} o={0.8} />
        <S d={smooth([[166, 390, 1], [234, 390, 1], [246, 462, 1], [154, 462, 1]])} fill={c.fill} shade={false} />
      </>}
      {open && <L d={`M200,${vY} L200,${hem}`} o={0.7} />}
    </g>
  )
}

function Waistcoat({ c }: { c: Ctx }) {
  if (c.part === 'collar') return null
  const left: Pt[] = [[200, 318, 1], [188, 172, 1], [168, 182], [150, 198], [146 - c.w, 262], [151 - c.w, 410], [152 - c.w, 444, 1], [178, 456], [200, 474, 1]]
  return (
    <g>
      <S d={sym(left)} fill={c.fill} />
      <S d={smooth([[150, 196], [168, 184], [176, 200], [164, 240], [147, 262]])} fill={darken(c.base, 0.35)} shade={false} />
      <S d={smooth(mirror([[150, 196], [168, 184], [176, 200], [164, 240], [147, 262]]))} fill={darken(c.base, 0.35)} shade={false} />
      <L d="M200,318 L200,474" o={0.7} />
      {range(332, 440, 27).map(y => <Btn key={y} x={204} y={y} r={2.4} fill={darken(c.base, 0.45)} />)}
      <L d="M160,380 L184,378 M216,378 L240,380" o={0.6} />
    </g>
  )
}

function Overshirt({ c }: { c: Ctx }) {
  if (c.part === 'collar') return null
  const panel: Pt[] = [[193, 206, 1], [188, 172, 1], [160, 184], [128 - c.w * 0.3, 195], [136 - c.w, 264], [145 - c.w, 410], [144 - c.w, 520, 1], [193, 520, 1]]
  return (
    <g>
      <Sleeves c={{ ...c, w: c.w + 4 }} end={548} />
      <Cuffs c={{ ...c, w: c.w + 4 }} end={548} />
      {[panel, mirror(panel)].map((p, i) => <S key={i} d={smooth(p)} fill={c.fill} />)}
      {[[156, 262], [214, 262]].map(([x, y]) => <g key={x}>
        <S d={poly([[x, y], [x + 30, y], [x + 30, y + 40], [x, y + 40]], true)} fill={c.fill} shade={false} />
        <S d={poly([[x - 1, y - 2], [x + 31, y - 2], [x + 31, y + 10], [x + 15, y + 15], [x - 1, y + 10]], true)} fill={c.fill} shade={false} />
      </g>)}
      {range(230, 500, 44).map(y => <Btn key={y} x={202} y={y} r={2.6} fill={darken(c.base, 0.45)} />)}
      <Collar c={c} kind="spread" centre={204} />
    </g>
  )
}

export const TOPS: Record<string, Drawer> = {
  't-shirt': c => <Tee c={c} />,
  'v-neck-tee': c => <Tee c={c} neck="v" />,
  polo: c => <Tee c={c} placket={2} collar="polo" />,
  henley: c => <Tee c={c} placket={3} />,
  ocbd: c => <Shirt c={c} collar="bd" pockets={1} />,
  'dress-shirt': c => <Shirt c={c} collar="spread" />,
  'dress-shirt-wing': c => <Shirt c={c} collar="wing" />,
  'flannel-shirt': c => <Shirt c={c} collar="point" pockets={2} tucked={false} />,
  'camp-collar-shirt': c => <Shirt c={c} collar="camp" sleeveEnd={300} tucked={false} />,
  'chambray-shirt': c => <Shirt c={c} collar="point" pockets={2} />,
  'linen-shirt': c => <Shirt c={c} collar="point" tucked={false} />,
}

export const MIDS: Record<string, Drawer> = {
  'crewneck-sweater': c => <Knit c={c} neck="crew" />,
  'v-neck-sweater': c => <Knit c={c} neck="v" />,
  cardigan: c => <Knit c={c} neck="cardigan" />,
  turtleneck: c => <Knit c={c} neck="turtle" />,
  'cable-knit': c => <Knit c={c} neck="crew" />,
  sweatshirt: c => <><Knit c={c} neck="crew" /><L d="M194,190 L200,206 L206,190" o={0.6} /></>,
  hoodie: c => <Knit c={c} neck="crew" hood />,
  waistcoat: c => <Waistcoat c={c} />,
  overshirt: c => <Overshirt c={c} />,
}
