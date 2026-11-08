import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { Link } from 'react-router'
import type { AnatomyId, Outfit, Piece, Slot } from '../data/types'
import { CROP, Figure } from '../figure/Figure'

interface Part { name: string; x: number; y: number; body: string }
interface Spec { title: string; slot?: Slot; piece?: Piece; viewBox?: string; parts: Part[]; link?: string }

// Coordinates are in figure space (viewBox 400×1000), or shoe space for the side view.
const SPECS: Record<AnatomyId, Spec> = {
  jacket: {
    title: 'The tailored jacket', slot: 'jacket', piece: { garmentId: 'blazer', colour: 'navy', pattern: 'solid' }, link: 'tailoring-fit',
    parts: [
      { name: 'Shoulder', x: 140, y: 200, body: 'Where the jacket hangs from. The seam should end at your shoulder bone — the one thing a tailor can barely change.' },
      { name: 'Lapel & gorge', x: 178, y: 240, body: 'The folded-back front. The notch where collar meets lapel is the gorge; its height and the lapel width date a jacket more than any other detail.' },
      { name: 'Breast pocket', x: 236, y: 272, body: 'A welted pocket for a folded square of silk or linen, never a pen.' },
      { name: 'Button stance', x: 200, y: 392, body: 'The height of the fastening button. A higher stance looks traditional; lower makes a deeper V and a longer line. Leave the bottom button undone.' },
      { name: 'Hip pockets', x: 158, y: 450, body: 'Flap pockets are standard; patch pockets are more casual; jetted pockets dressiest.' },
      { name: 'Sleeve & cuff', x: 116, y: 512, body: 'Should end so about a centimetre of shirt cuff shows. Working cuff buttons are a mark of tailoring but make shortening harder.' },
    ],
  },
  shirt: {
    title: 'The shirt', slot: 'top', piece: { garmentId: 'ocbd', colour: 'light-blue', pattern: 'oxford' }, link: 'shirts',
    parts: [
      { name: 'Collar', x: 186, y: 196, body: 'The shirt\'s most expressive part. Button-down points, as here, are casual and collegiate; spread and point collars are dressier.' },
      { name: 'Placket', x: 200, y: 300, body: 'The strip of cloth carrying the buttons. A front placket is sporty; a plain "French" front is cleaner and more formal.' },
      { name: 'Yoke & shoulder', x: 150, y: 210, body: 'The panel across the shoulders. It should sit flat with the seam at the edge of your shoulder.' },
      { name: 'Chest fit', x: 168, y: 280, body: 'No pulling between buttons. You should be able to pinch a little cloth either side of the chest.' },
      { name: 'Cuff', x: 120, y: 550, body: 'Barrel cuffs button; French cuffs fold back and need cufflinks. The cuff should reach the wrist bone.' },
    ],
  },
  trousers: {
    title: 'The trouser', slot: 'bottom', piece: { garmentId: 'pleated-trousers', colour: 'mid-grey', pattern: 'solid', fit: 'relaxed' }, link: 'trousers',
    parts: [
      { name: 'Waistband & rise', x: 200, y: 412, body: 'Where the trousers sit. A high rise reaches the natural waist; a low rise sits on the hips. Higher rises lengthen the legs.' },
      { name: 'Pleats', x: 172, y: 450, body: 'Folds at the waist that add room at the hip and help a fuller leg drape cleanly.' },
      { name: 'Crease', x: 165, y: 640, body: 'A pressed line down the front of each leg. It sharpens tailoring; casual trousers go without.' },
      { name: 'Leg & taper', x: 236, y: 760, body: 'How the width changes from thigh to hem. Slim, straight, relaxed and wide all work — if the shoes and top agree.' },
      { name: 'Hem & break', x: 168, y: 930, body: 'The break is the fold where the hem meets the shoe. A turn-up (cuff) adds weight to the hem.' },
    ],
  },
  coat: {
    title: 'The overcoat', slot: 'coat', piece: { garmentId: 'overcoat', colour: 'camel', pattern: 'solid' }, link: 'outerwear',
    parts: [
      { name: 'Collar & lapel', x: 178, y: 230, body: 'Wide enough to turn up against the wind. Notch lapels are classic; a peak or ulster collar is more dramatic.' },
      { name: 'Shoulder', x: 136, y: 200, body: 'Cut a little larger than a jacket so it sits over tailoring without strain.' },
      { name: 'Fastening', x: 200, y: 400, body: 'Single- or double-breasted; a fly front hides the buttons for a cleaner line.' },
      { name: 'Length', x: 200, y: 760, body: 'Long enough to cover any jacket beneath. Knee-length is the classic all-rounder.' },
    ],
  },
  knit: {
    title: 'The sweater', slot: 'mid', piece: { garmentId: 'crewneck-sweater', colour: 'forest', pattern: 'rib' }, link: 'knitwear',
    parts: [
      { name: 'Neckline', x: 200, y: 186, body: 'Crew, V, shawl or roll. A crew sits close; a V frames a collar and tie.' },
      { name: 'Gauge', x: 200, y: 320, body: 'Stitches per inch. Fine gauge is smooth and slim enough for tailoring; chunky knits stand alone.' },
      { name: 'Rib hem & cuffs', x: 200, y: 452, body: 'Elastic ribbing holds the hem and cuffs in place. It should end at the belt, not below.' },
    ],
  },
  shoe: {
    title: 'The shoe', viewBox: '30 40 350 150', link: 'shoes',
    parts: [
      { name: 'Toe cap', x: 330, y: 132, body: 'A separate piece of leather across the toe. A plain cap is formal; perforated, it becomes a brogue.' },
      { name: 'Vamp', x: 262, y: 116, body: 'The front of the upper. On a loafer it is the whole visible front.' },
      { name: 'Lacing & facings', x: 190, y: 84, body: 'Closed facings, stitched under the vamp, make an oxford; open facings sewn on top make a derby.' },
      { name: 'Quarter', x: 128, y: 112, body: 'The sides and back of the upper.' },
      { name: 'Heel counter', x: 86, y: 118, body: 'A stiffener that holds the heel. A firm counter keeps the shoe\'s shape for years.' },
      { name: 'Heel', x: 96, y: 168, body: 'Stacked leather on dress shoes; rubber or a block on casual ones.' },
      { name: 'Welt & sole', x: 240, y: 164, body: 'A welted shoe has a strip of leather stitched around the edge, so the sole can be replaced. Thin leather soles are dressy; thick rubber, casual.' },
    ],
  },
}

function Shoe() {
  return (
    <svg viewBox="30 40 350 150" className="h-full w-full" role="img" aria-label="Side view of a cap-toe oxford shoe">
      <g stroke="var(--figure-ink)" strokeWidth="1.6" strokeLinejoin="round" fill="none">
        <path d="M70 156 C60 125 64 92 80 70 L150 64 C172 68 192 78 210 90 L292 112 C332 120 360 132 366 150 L362 158 L70 158 Z" fill="#4a2c1a" />
        <path d="M66 158 L128 158 L126 182 L72 182 Z" fill="#2f1c11" />
        <path d="M124 160 L370 160 Q376 168 364 172 L124 174 Z" fill="#2f1c11" />
        <path d="M300 116 C288 130 290 146 300 158" />
        <path d="M80 72 C100 100 110 130 112 158" />
        <path d="M150 64 C168 92 190 120 214 140 C236 150 260 154 300 156" strokeOpacity=".6" />
        <path d="M128 162 L364 162" strokeDasharray="3 3" strokeOpacity=".7" />
        {[0, 1, 2, 3, 4].map(i => <circle key={i} cx={168 + i * 10} cy={72 + i * 5} r="1.8" fill="#d8ccb0" />)}
        <path d="M166 74 L210 92 M172 70 L206 98 M182 76 L214 96" strokeWidth="1" stroke="#d8ccb0" />
      </g>
    </svg>
  )
}

export function Anatomy({ id, compact }: { id: AnatomyId; compact?: boolean }) {
  const spec = SPECS[id]
  const [active, setActive] = useState(0)
  const uid = useId()
  const [vx, vy, vw, vh] = (spec.slot ? CROP[spec.slot] : spec.viewBox!).split(' ').map(Number)
  const outfit: Outfit | null = spec.slot && spec.piece ? { figure: { skin: 1, hair: 1, hairStyle: 0 }, pieces: { [spec.slot]: spec.piece } } : null
  const part = spec.parts[active]

  return (
    <section aria-label={`Anatomy: ${spec.title}`} className={`plate grid gap-0 ${compact ? '' : 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'}`}>
      <div className="relative mx-auto w-full max-w-sm p-4" style={{ aspectRatio: `${vw} / ${vh}` }}>
        <div className="absolute inset-4">
          {outfit ? <Figure outfit={outfit} only={spec.slot} title={`Diagram of ${spec.title.toLowerCase()}`} className="h-full w-full" /> : <Shoe />}
          {spec.parts.map((p, i) => (
            <button
              key={p.name} onClick={() => setActive(i)} aria-pressed={i === active} aria-controls={`${uid}-desc`}
              className={`absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-sans text-xs font-semibold transition-[transform,background-color] duration-150 hover:scale-110 active:scale-95 ${i === active ? 'border-accent bg-accent text-on-accent' : 'border-ink bg-paper-3 text-ink'}`}
              style={{ left: `${((p.x - vx) / vw) * 100}%`, top: `${((p.y - vy) / vh) * 100}%` }}
            >
              {i + 1}<span className="sr-only">: {p.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-rule p-5 md:border-l md:border-t-0">
        <h3 className="text-2xl">Anatomy of {spec.title.replace(/^The /, 'the ')}</h3>
        <ol className="mt-3 flex flex-wrap gap-1.5">
          {spec.parts.map((p, i) => (
            <li key={p.name}>
              <button onClick={() => setActive(i)} aria-pressed={i === active} className={`border px-2 py-1 font-sans text-xs ${i === active ? 'border-accent text-accent' : 'border-rule text-ink-2 hover:text-ink'}`}>{i + 1}. {p.name}</button>
            </li>
          ))}
        </ol>
        <div id={`${uid}-desc`} aria-live="polite" className="mt-4 min-h-28">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
              <h4 className="font-display text-xl">{part.name}</h4>
              <p className="mt-1 leading-relaxed">{part.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        {spec.link && <Link to={`/handbook/${spec.link}`} className="xref mt-3 inline-block text-sm">Read the chapter →</Link>}
      </div>
    </section>
  )
}
