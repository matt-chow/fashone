import { darken, lighten } from '../lib/color'
import { both, mirror, poly, smooth, type Pt } from './geometry'
import { Btn, L, S, range, type Ctx, type Drawer } from './prims'

type Front = 'sb' | 'db' | 'zip' | 'open' | 'asym'
type Lapel = 'notch' | 'peak' | 'shawl' | 'none'
interface Spec {
  hem: number
  front: Front
  /** Height where the lapels' V closes (top button). */
  bY: number
  lapel: Lapel
  cut?: boolean
  sleeveEnd?: number
  /** Extra width over the base jacket block — coats are cut larger. */
  ease?: number
  lapelFill?: string
}

function panel(s: Spec, w: number): Pt[] {
  const sh = 124 - w * 0.3, side: Pt[] = [[156, 183], [sh, 192], [136 - w, 266], [144 - w, 405], [141 - w * 1.2, s.hem, 1]]
  switch (s.front) {
    case 'db': return [[214, s.bY, 1], [187, 171, 1], ...side, [214, s.hem, 1]]
    case 'zip': case 'asym': return [[200, 186], [188, 173, 1], ...side, [200, s.hem, 1]]
    case 'open': return [[192, 204, 1], [188, 173, 1], ...side, [192, s.hem, 1]]
    default: return [[200, s.bY, 1], [187, 171, 1], ...side, ...(s.cut ? [[184, s.hem, 1], [197, s.hem - 50], [201, s.bY + 24]] as Pt[] : [[201, s.hem, 1]] as Pt[])]
  }
}

function jacketSleeve(w: number, end: number): Pt[] {
  return [[124 - w * 0.3, 192], [111 - w * 0.5, 248], [104 - w * 0.5, 330], [100 - w * 0.5, 400], [103 - w * 0.4, 480], [105 - w * 0.3, end, 1], [138, end, 1], [138, 480], [140, 400], [142, 320], [136 - w, 266]]
}

function lapel(kind: Lapel, bY: number, x0 = 200): Pt[] {
  const start: Pt = [x0, bY, 1]
  if (kind === 'peak') return [start, [170, 300], [146, 230, 1], [168, 248, 1], [167, 238], [176, 200], [184, 178], [187, 171, 1]]
  if (kind === 'shawl') return [start, [168, 300], [163, 240], [173, 196], [184, 176], [187, 171, 1]]
  return [start, [174, 300], [155, 252, 1], [166, 247, 1], [165, 236, 1], [176, 200], [184, 178], [187, 171, 1]]
}

function Shell({ c, s, children }: { c: Ctx; s: Spec; children?: React.ReactNode }) {
  const w = c.w + (s.ease ?? 0)
  const end = s.sleeveEnd ?? 548
  const left = panel(s, w)
  const right = s.front === 'db' ? mirror(left) : mirror(left)
  const lp = s.lapel === 'none' ? null : lapel(s.lapel, s.bY, s.front === 'db' ? 214 : 200)
  const lfill = s.lapelFill ?? c.fill
  return (
    <g>
      {both(jacketSleeve(w, end)).map((d, i) => <S key={i} d={d} fill={c.fill} />)}
      <S d={smooth(right)} fill={c.fill} />
      <S d={smooth(left)} fill={c.fill} />
      {lp && <>
        <S d={smooth(mirror(lp))} fill={lfill} shade={false} />
        <S d={smooth(lp)} fill={lfill} shade={false} />
      </>}
      <L d={`M${120 - w * 0.4},${end - 40} Q${122 - w * 0.3},${end - 20} ${124},${end - 8}`} o={0.25} />
      {children}
    </g>
  )
}

const flaps = (y: number, w = 0) => [[152 - w, y], [218, y]].map(([x, yy]) => (
  <S key={x} d={poly([[x, yy], [x + 32 + w * 0.3, yy], [x + 32 + w * 0.3, yy + 13], [x, yy + 13]], true)} fill="none" shade={false} sw={1} />
))
const chestWelt = <L d="M222,292 L248,286" sw={1.6} />
const sleeveButtons = (end: number, fill: string) => [[114, 125], [286, 275]].flatMap(([a, b]) => [a, b].map((x, i) => <Btn key={`${x}${i}`} x={x + (x < 200 ? 4 : -4)} y={end - 10 - i * 7} r={1.6} fill={fill} />))

function Tailored({ c, s, buttons, gold, pockets = 'flap' }: { c: Ctx; s: Spec; buttons: number[][]; gold?: boolean; pockets?: 'flap' | 'patch' }) {
  if (c.part === 'collar') return null
  const bfill = gold ? '#c9a646' : darken(c.base, 0.45)
  return (
    <Shell c={c} s={s}>
      {buttons.map(([x, y]) => <Btn key={`${x}-${y}`} x={x} y={y} r={3.2} fill={bfill} />)}
      {pockets === 'flap' ? flaps(s.hem - 92, c.w) : [[150, s.hem - 100], [214, s.hem - 100]].map(([x, y]) => (
        <S key={x} d={poly([[x, y], [x + 36, y], [x + 36, y + 42], [x, y + 42]], true)} fill={c.fill} shade={false} sw={1} />
      ))}
      {s.hem < 600 && chestWelt}
      {sleeveButtons(s.sleeveEnd ?? 548, bfill)}
    </Shell>
  )
}

function Casual({ c, s, collar, band, pockets, zip }: { c: Ctx; s: Spec; collar: 'point' | 'stand' | 'rib' | 'hood'; band?: boolean; pockets?: 'chest' | 'four' | 'chore' | 'slash'; zip?: boolean }) {
  if (c.part === 'collar') return null
  const trim = darken(c.base, 0.14)
  const w = c.w + (s.ease ?? 0)
  const hem = s.hem
  const wing: Pt[] = [[193, 210, 1], [186, 164, 1], [166, 176], [146, 216, 1], [174, 226]]
  return (
    <Shell c={c} s={s}>
      {band && <S d={poly([[142 - w * 1.2, hem - 16, 1], [258 + w * 1.2, hem - 16, 1], [258 + w * 1.2, hem, 1], [142 - w * 1.2, hem, 1]], true)} fill={collar === 'rib' ? trim : c.fill} shade={false} />}
      {band && collar === 'rib' && range(146 - w, 254 + w, 5).map(x => <L key={x} d={`M${x},${hem - 14} L${x},${hem - 2}`} o={0.25} />)}
      {zip && <L d={`M200,186 L200,${hem}`} sw={1.2} dash="1.5 1.5" o={0.9} />}
      {s.front === 'zip' && !zip && range(214, hem - 20, 40).map(y => <Btn key={y} x={200} y={y} r={2.8} fill={lighten(c.base, 0.35)} />)}
      {pockets === 'chest' && [[154, 248], [212, 248]].map(([x, y]) => <g key={x}>
        <L d={`M${x},${y + 12} L${x},${y + 44} L${x + 34},${y + 44} L${x + 34},${y + 12}`} />
        <S d={smooth([[x, y, 1], [x + 34, y, 1], [x + 34, y + 12], [x + 17, y + 18, 1], [x, y + 12]])} fill={c.fill} shade={false} sw={1} />
        <Btn x={x + 17} y={y + 13} r={2.2} fill="#b98a3e" />
      </g>)}
      {pockets === 'four' && [[152, 250], [214, 250], [150, hem - 120], [214, hem - 120]].map(([x, y]) => <g key={`${x}${y}`}>
        <S d={poly([[x, y], [x + 36, y], [x + 36, y + 46], [x, y + 46]], true)} fill={c.fill} shade={false} sw={1} />
        <S d={poly([[x - 1, y - 2], [x + 37, y - 2], [x + 37, y + 12], [x - 1, y + 12]], true)} fill={c.fill} shade={false} sw={1} />
      </g>)}
      {pockets === 'chore' && [[216, 262, 30, 34], [150, hem - 130, 40, 50], [210, hem - 130, 40, 50]].map(([x, y, pw, ph]) => (
        <S key={`${x}${y}`} d={poly([[x, y], [x + pw, y], [x + pw, y + ph], [x, y + ph]], true)} fill={c.fill} shade={false} sw={1} />
      ))}
      {pockets === 'slash' && <L d={`M158,${hem - 120} L166,${hem - 70} M242,${hem - 120} L234,${hem - 70}`} sw={1.4} />}
      {collar === 'point' && [wing, mirror(wing)].map((p, i) => <S key={i} d={smooth(p)} fill={c.fill} />)}
      {collar === 'stand' && <S d={smooth([[181, 156], [200, 162], [219, 156], [221, 186, 1], [200, 192], [179, 186, 1]])} fill={c.fill} />}
      {collar === 'rib' && <>
        <S d={smooth([[182, 166], [200, 172], [218, 166], [221, 188, 1], [200, 194], [179, 188, 1]])} fill={trim} />
        {range(186, 214, 4).map(x => <L key={x} d={`M${x},170 L${x},190`} o={0.25} />)}
      </>}
      {collar === 'hood' && <>
        <S d={smooth([[150, 196], [160, 158], [200, 140], [240, 158], [250, 196], [222, 204], [200, 200], [178, 204]])} fill={c.fill} />
        <path d={smooth([[164, 192], [170, 164], [200, 152], [230, 164], [236, 192], [216, 190], [200, 186], [184, 190]])} fill="#cdbfa6" stroke="#8a7a62" strokeWidth={3} strokeDasharray="2 3" />
      </>}
    </Shell>
  )
}

export const JACKETS: Record<string, Drawer> = {
  blazer: c => <Tailored c={c} gold s={{ hem: 548, front: 'sb', bY: 396, lapel: 'notch', cut: true }} buttons={[[203, 400], [203, 456]]} />,
  'sport-coat': c => <Tailored c={c} pockets="patch" s={{ hem: 548, front: 'sb', bY: 380, lapel: 'notch', cut: true }} buttons={[[203, 340], [203, 386], [203, 440]]} />,
  'suit-jacket': c => <Tailored c={c} s={{ hem: 548, front: 'sb', bY: 396, lapel: 'notch', cut: true }} buttons={[[203, 400], [203, 456]]} />,
  'double-breasted-jacket': c => <Tailored c={c} s={{ hem: 550, front: 'db', bY: 372, lapel: 'peak' }} buttons={[[182, 380], [218, 380], [182, 440], [218, 440], [178, 320], [222, 320]]} />,
  'dinner-jacket': c => <Tailored c={c} s={{ hem: 548, front: 'sb', bY: 412, lapel: 'shawl', cut: true, lapelFill: darken(c.base, 0.35) }} buttons={[[203, 416]]} />,
  harrington: c => <Casual c={c} s={{ hem: 474, front: 'zip', bY: 0, lapel: 'none', sleeveEnd: 546 }} collar="stand" band zip pockets="slash" />,
  bomber: c => <Casual c={c} s={{ hem: 474, front: 'zip', bY: 0, lapel: 'none', sleeveEnd: 546 }} collar="rib" band zip pockets="slash" />,
  'denim-jacket': c => <Casual c={c} s={{ hem: 480, front: 'zip', bY: 0, lapel: 'none', sleeveEnd: 546 }} collar="point" band pockets="chest" />,
  'field-jacket': c => <Casual c={c} s={{ hem: 566, front: 'zip', bY: 0, lapel: 'none', sleeveEnd: 548, ease: 2 }} collar="stand" zip pockets="four" />,
  'chore-coat': c => <Casual c={c} s={{ hem: 540, front: 'open', bY: 0, lapel: 'none', sleeveEnd: 548, ease: 2 }} collar="point" pockets="chore" />,
  'leather-jacket': c => <Casual c={c} s={{ hem: 474, front: 'asym', bY: 0, lapel: 'none', sleeveEnd: 546 }} collar="point" band pockets="slash" />,
}

export const COATS: Record<string, Drawer> = {
  overcoat: c => <Tailored c={c} s={{ hem: 772, front: 'sb', bY: 344, lapel: 'notch', ease: 8 }} buttons={[[203, 350], [203, 420], [203, 490]]} />,
  'trench-coat': c => c.part === 'collar' ? null : (
    <g>
      <Tailored c={c} s={{ hem: 790, front: 'db', bY: 330, lapel: 'notch', ease: 10 }} buttons={[[180, 340], [220, 340], [180, 470], [220, 470]]} />
      <S d={poly([[136 - c.w * 1.4, 404], [264 + c.w * 1.4, 404], [264 + c.w * 1.4, 420], [136 - c.w * 1.4, 420]], true)} fill={c.fill} shade={false} />
      <rect x={192} y={402} width={16} height={20} fill="none" stroke="#3a2a1a" strokeWidth={2} />
      <S d={smooth([[148, 190], [176, 182, 1], [180, 270, 1], [146, 264]])} fill={c.fill} shade={false} sw={1} />
      {[[124, 190], [258, 190]].map(([x, y]) => <S key={x} d={poly([[x, y], [x + 18, y - 2], [x + 18, y + 8], [x, y + 10]], true)} fill={c.fill} shade={false} sw={1} />)}
    </g>
  ),
  peacoat: c => <Tailored c={c} s={{ hem: 566, front: 'db', bY: 300, lapel: 'notch', ease: 6 }} buttons={[[178, 310], [222, 310], [178, 380], [222, 380], [178, 450], [222, 450]]} />,
  parka: c => <Casual c={c} s={{ hem: 660, front: 'zip', bY: 0, lapel: 'none', sleeveEnd: 550, ease: 10 }} collar="hood" zip pockets="four" />,
}
