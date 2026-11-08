import { darken } from '../lib/color'
import { both, smooth, sym } from './geometry'
import { INK, L } from './prims'

export const SKIN_TONES = [
  { name: 'Porcelain', hex: '#f0d5bd' },
  { name: 'Warm beige', hex: '#dcb48f' },
  { name: 'Olive', hex: '#c09068' },
  { name: 'Bronze', hex: '#94643f' },
  { name: 'Deep brown', hex: '#5e3e29' },
]
export const HAIR_COLOURS = [
  { name: 'Black', hex: '#1f1a17' },
  { name: 'Dark brown', hex: '#3d2a1d' },
  { name: 'Chestnut', hex: '#6a4126' },
  { name: 'Fair', hex: '#b08a55' },
  { name: 'Silver', hex: '#a9a6a0' },
]
export const HAIR_STYLES = ['Side part', 'Close crop', 'Swept back']

const HEAD = sym([[200, 48], [180, 53], [168, 72], [167, 100], [174, 122], [187, 136], [200, 141]])
const NECK = smooth([[186, 124], [186, 180, 1], [214, 180, 1], [214, 124]])
const TORSO = sym([[200, 172], [188, 172], [160, 184], [134, 196], [139, 262], [150, 410], [147, 470], [158, 522], [200, 532]])
const [ARM_L, ARM_R] = both([[134, 196], [119, 245], [112, 330], [108, 400], [110, 480], [112, 560, 1], [132, 560, 1], [133, 480], [135, 400], [139, 310], [141, 262]])
const [HAND_L, HAND_R] = both([[111, 554], [106, 580], [109, 608], [117, 628], [125, 627], [131, 604], [134, 580], [133, 554]])
const [LEG_L, LEG_R] = both([[147, 470], [150, 560], [158, 720], [165, 840], [169, 936, 1], [191, 936, 1], [193, 840], [195, 720], [199, 560], [200, 532], [158, 522]])
const [FOOT_L, FOOT_R] = both([[168, 930], [163, 952], [169, 968], [191, 968], [195, 950], [191, 930]])

const HAIR = [
  // side part
  smooth([[226, 50], [238, 66], [238, 92, 1], [232, 76], [218, 68], [196, 66], [178, 72], [167, 92, 1], [165, 70], [176, 52], [200, 43]]),
  // close crop
  smooth([[200, 45], [224, 50], [236, 66], [237, 84, 1], [228, 70], [200, 64], [172, 70], [163, 84, 1], [164, 66], [176, 50]]),
  // swept back
  smooth([[200, 38], [228, 44], [240, 64], [238, 90, 1], [232, 72], [214, 62], [200, 60], [186, 62], [168, 72], [162, 90, 1], [160, 64], [172, 44]]),
]

export function Body({ skin, hair, hairStyle }: { skin: string; hair: string; hairStyle: number }) {
  const line = darken(skin, 0.45)
  return (
    <g>
      {[LEG_L, LEG_R, FOOT_L, FOOT_R, ARM_L, ARM_R, TORSO, NECK, HAND_L, HAND_R].map((d, i) => (
        <path key={i} d={d} fill={skin} stroke={line} strokeWidth={1.1} />
      ))}
      <ellipse cx={166} cy={98} rx={5} ry={10} fill={skin} stroke={line} strokeWidth={1} />
      <ellipse cx={234} cy={98} rx={5} ry={10} fill={skin} stroke={line} strokeWidth={1} />
      <path d={HEAD} fill={skin} stroke={line} strokeWidth={1.2} />
      <path d={HAIR[hairStyle % HAIR.length]} fill={hair} stroke={INK} strokeWidth={0.8} />
      {hairStyle % 3 === 0 && <L d="M186,66 C192,58 204,54 220,56" color={darken(hair, 0.4)} o={0.6} />}
      {/* features, drawn lightly as on a fashion plate */}
      <L d="M179,88 Q186,84 193,88 M207,88 Q214,84 221,88" color={darken(hair, 0.2)} sw={1.6} o={0.85} />
      <L d="M181,97 Q186,99.5 192,97 M208,97 Q214,99.5 219,97" color={line} sw={1.3} o={0.9} />
      <L d="M200,98 L197,112 Q200,115 204,113" color={line} sw={1} o={0.7} />
      <L d="M192,124 Q200,128 208,124" color={darken(skin, 0.35)} sw={1.4} o={0.8} />
      <L d="M114,590 Q118,598 116,606 M286,590 Q282,598 284,606" color={line} o={0.5} />
    </g>
  )
}
