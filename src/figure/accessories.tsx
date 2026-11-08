import { darken, lighten } from '../lib/color'
import { mirror, poly, smooth, type Pt } from './geometry'
import { INK, L, S, type Drawer } from './prims'

const BOW: Pt[] = [[200, 183], [184, 174, 1], [182, 194, 1]]

export const NECKWEAR: Record<string, Drawer> = {
  tie: c => (
    <g>
      <S d={smooth([[200, 206, 1], [190, 222], [186, 386, 1], [200, 402, 1], [214, 386, 1], [210, 222]])} fill={c.fill} />
      <S d={poly([[191, 184], [209, 184], [205, 206], [195, 206]], true)} fill={c.fill} shade={false} />
    </g>
  ),
  'knit-tie': c => (
    <g>
      <S d={poly([[194, 206], [206, 206], [208, 396], [192, 396]], true)} fill={c.fill} />
      <S d={poly([[192, 184], [208, 184], [205, 206], [195, 206]], true)} fill={c.fill} shade={false} />
      <L d="M193,392 L207,392" o={0.4} />
    </g>
  ),
  'bow-tie': c => (
    <g>
      <S d={smooth(BOW)} fill={c.fill} shade={false} />
      <S d={smooth(mirror(BOW))} fill={c.fill} shade={false} />
      <rect x={195} y={178} width={10} height={11} rx={2} fill={c.fill} stroke={INK} strokeWidth={1} />
    </g>
  ),
}

export const HATS: Record<string, Drawer> = {
  fedora: c => (
    <g>
      <S d={smooth([[171, 62, 1], [173, 32], [188, 22], [200, 30], [212, 22], [227, 32], [229, 62, 1]])} fill={c.fill} />
      <S d={poly([[172, 50], [228, 50], [229, 62], [171, 62]], true)} fill={darken(c.base, 0.45)} shade={false} sw={1} />
      <S d={smooth([[140, 66], [170, 58], [200, 56], [230, 58], [260, 66], [230, 72], [200, 74], [170, 72]])} fill={c.fill} />
    </g>
  ),
  'flat-cap': c => (
    <g>
      <S d={smooth([[164, 72, 1], [168, 48], [200, 36], [234, 46], [240, 70, 1], [200, 64]])} fill={c.fill} />
      <S d={smooth([[170, 70], [200, 64], [230, 70], [222, 82], [200, 84], [178, 82]])} fill={darken(c.base, 0.08)} />
    </g>
  ),
  beanie: c => (
    <g>
      <S d={smooth([[164, 76, 1], [166, 46], [200, 30], [234, 46], [236, 76, 1]])} fill={c.fill} />
      <S d={poly([[163, 62], [237, 62], [237, 80], [163, 80]], true)} fill={darken(c.base, 0.1)} shade={false} />
      {[170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230].map(x => <L key={x} d={`M${x},64 L${x},78`} o={0.25} />)}
    </g>
  ),
  'baseball-cap': c => (
    <g>
      <S d={smooth([[166, 70, 1], [170, 44], [200, 34], [230, 44], [234, 70, 1]])} fill={c.fill} />
      <S d={smooth([[168, 70], [200, 66], [232, 70], [226, 84], [200, 88], [174, 84]])} fill={darken(c.base, 0.1)} />
      <circle cx={200} cy={35} r={3} fill={c.base} stroke={INK} strokeWidth={0.8} />
    </g>
  ),
}

export const EYEWEAR: Record<string, Drawer> = {
  'round-glasses': c => (
    <g fill="none" stroke={c.base} strokeWidth={2}>
      <circle cx={187} cy={97} r={10} /><circle cx={213} cy={97} r={10} /><path d="M197,96 Q200,93 203,96 M177,95 L167,92 M223,95 L233,92" />
    </g>
  ),
  'rectangular-glasses': c => (
    <g fill="none" stroke={c.base} strokeWidth={2.4}>
      <rect x={175} y={90} width={22} height={14} rx={3} /><rect x={203} y={90} width={22} height={14} rx={3} /><path d="M197,95 L203,95 M175,94 L167,92 M225,94 L233,92" />
    </g>
  ),
  sunglasses: c => (
    <g stroke={c.base} strokeWidth={2}>
      <path d="M174,90 L198,90 L196,104 Q186,110 177,103Z M202,90 L226,90 L223,103 Q214,110 204,104Z" fill="#241e1a" fillOpacity={0.9} />
      <path d="M198,93 L202,93 M174,92 L167,91 M226,92 L233,91" fill="none" />
    </g>
  ),
}

export const SCARVES: Record<string, Drawer> = {
  scarf: c => (
    <g>
      <S d={smooth([[164, 352, 1], [166, 232], [172, 204], [196, 210], [194, 240], [190, 352, 1]])} fill={c.fill} />
      <L d="M166,352 L166,364 M172,352 L172,364 M178,352 L178,364 M184,352 L184,364 M189,352 L189,364" o={0.6} />
      <S d={smooth([[166, 180], [200, 196], [234, 180], [238, 204], [200, 222], [162, 204]])} fill={c.fill} />
    </g>
  ),
}

export const WATCHES: Record<string, Drawer> = {
  watch: c => (
    <g>
      <rect x={268} y={546} width={23} height={9} rx={2} fill={c.base} stroke={INK} strokeWidth={0.8} />
      <circle cx={279.5} cy={550.5} r={7} fill={lighten(c.base, 0.6)} stroke={INK} strokeWidth={1.2} />
      <path d="M279.5,550.5 L279.5,546.5 M279.5,550.5 L282.5,551.5" stroke={INK} strokeWidth={0.8} />
    </g>
  ),
}

export const POCKETS: Record<string, Drawer> = {
  'pocket-square': c => <S d={smooth([[223, 290, 1], [226, 276], [233, 282], [239, 272], [244, 280], [248, 286, 1]])} fill={c.fill} shade={false} sw={1} />,
}
