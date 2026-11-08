import { ArrowDown, ArrowUp, Check, RotateCcw, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { FORMALITY, garment } from '../data/garments'
import { colour } from '../data/palette'
import type { Fit, Outfit, Piece, Slot } from '../data/types'
import { Figure } from '../figure/Figure'
import { explain, type Note, type Topic } from '../lib/explain'
import { FITS, describe, optionsFor, setPiece } from '../lib/outfit'
import { useStore } from '../lib/store'
import { Tag } from './bits'

const FIG = { skin: 1, hair: 1, hairStyle: 0 }
const p = (garmentId: string, c: string, pattern: Piece['pattern'] = 'solid', fit?: Fit): Piece => ({ garmentId, colour: c, pattern, fit })
const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((x, y) => x[0] - y[0]).map(x => x[1])

export const ACTIVITIES = [
  { id: 'colour-workshop', title: 'Colour workshop', note: 'Choose jacket, shirt and trousers colours and see how contrast and harmony change the effect.' },
  { id: 'silhouette-lab', title: 'Silhouette lab', note: 'Change the trouser cut and the jacket to see how proportion shifts.' },
  { id: 'formality-ladder', title: 'Formality ladder', note: 'Put garments in order from most casual to most formal.' },
  { id: 'pattern-match', title: 'Pattern & texture', note: 'Pick the pairing that follows convention, then read why.' },
  { id: 'identify', title: 'Name that garment', note: 'Identify garments from their catalogue drawings.' },
] as const

/** True when an activity is the page itself (Practice route), so its title becomes the h1. */
export const Standalone = createContext(false)

function Frame({ title, children, intro }: { title: string; intro: string; children: ReactNode }) {
  const H = useContext(Standalone) ? 'h1' : 'h3'
  return (
    <section aria-label={title} className="plate p-4 sm:p-6">
      <H className="text-2xl">{title}</H>
      <p className="mt-1 max-w-prose text-ink-2">{intro}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function NoteList({ notes }: { notes: Note[] }) {
  return (
    <ul className="space-y-2.5" aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        {notes.map(n => (
          <motion.li key={n.id} layout initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className={`border bg-paper-3 p-3 ${n.tone === 'consider' ? 'border-brass' : 'border-rule'}`}>
            <p className="flex flex-wrap items-center gap-2"><Tag tone={n.kind}>{n.kind === 'convention' ? 'Convention' : 'Interpretation'}</Tag><strong className="font-display text-base font-normal">{n.title}</strong></p>
            <p className="mt-1 text-[0.94rem] leading-relaxed">{n.body}</p>
          </motion.li>
        ))}
      </AnimatePresence>
      {!notes.length && <li className="italic text-ink-2">Nothing to remark on — a quiet, coherent combination.</li>}
    </ul>
  )
}

const Swatches = ({ label, ids, value, onPick }: { label: string; ids: string[]; value: string; onPick: (id: string) => void }) => (
  <div>
    <p className="label mb-1.5 text-ink-2">{label} · <span className="normal-case tracking-normal">{colour(value).name}</span></p>
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {ids.map(id => (
        <button key={id} role="radio" aria-checked={value === id} aria-label={colour(id).name} title={colour(id).name} onClick={() => onPick(id)}
          className={`size-8 rounded-full border transition-transform duration-150 active:scale-95 ${value === id ? 'border-ink ring-2 ring-accent ring-offset-2 ring-offset-plate' : 'border-ink/30 hover:scale-110'}`} style={{ background: colour(id).hex }} />
      ))}
    </div>
  </div>
)

const topics = (o: Outfit, t: Topic[]) => explain(o).filter(n => t.includes(n.topic))

export function ColourWorkshop() {
  const { markDone } = useStore()
  const [c, setC] = useState({ jacket: 'navy', top: 'white', bottom: 'mid-grey' })
  const [changes, setChanges] = useState(0)
  const outfit: Outfit = { figure: FIG, pieces: { jacket: p('blazer', c.jacket), top: p('ocbd', c.top, 'oxford'), bottom: p('dress-trousers', c.bottom), shoes: p('loafer', 'dark-brown') } }
  const pick = (k: keyof typeof c) => (id: string) => { setC(x => ({ ...x, [k]: id })); if (changes === 2) markDone('colour-workshop'); setChanges(n => n + 1) }
  const notes = topics(outfit, ['Colour', 'Contrast'])
  return (
    <Frame title="Colour workshop" intro="Three garments, a handful of colours. Look for value contrast (light against dark) and how many colours compete for attention.">
      <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
        <div className="mx-auto aspect-[280/1000] w-32 md:w-full"><Figure outfit={outfit} title={describe(outfit)} className="h-full w-full" /></div>
        <div className="space-y-4">
          <Swatches label="Jacket" ids={['navy', 'charcoal', 'mid-grey', 'brown', 'olive', 'camel', 'forest', 'burgundy']} value={c.jacket} onPick={pick('jacket')} />
          <Swatches label="Shirt" ids={['white', 'ecru', 'light-blue', 'pink', 'sky', 'charcoal', 'black']} value={c.top} onPick={pick('top')} />
          <Swatches label="Trousers" ids={['mid-grey', 'charcoal', 'navy', 'stone', 'khaki', 'olive', 'brown', 'white']} value={c.bottom} onPick={pick('bottom')} />
          <NoteList notes={notes} />
        </div>
      </div>
    </Frame>
  )
}

export function SilhouetteLab() {
  const { markDone } = useStore()
  const [fit, setFit] = useState<Fit>('straight')
  const [jacket, setJacket] = useState<'none' | 'blazer' | 'chore-coat' | 'bomber'>('blazer')
  let outfit: Outfit = { figure: FIG, pieces: { top: p('ocbd', 'white', 'oxford'), bottom: p('pleated-trousers', 'mid-grey', 'solid', fit), shoes: p('loafer', 'dark-brown') } }
  if (jacket !== 'none') outfit = setPiece(outfit, 'jacket', p(jacket, jacket === 'blazer' ? 'navy' : jacket === 'bomber' ? 'olive' : 'navy'))
  const notes = topics(outfit, ['Silhouette', 'Layering'])
  return (
    <Frame title="Silhouette lab" intro="The outline of an outfit is decided mostly by the trouser leg and the length of what you wear on top.">
      <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
        <motion.div layout className="mx-auto aspect-[280/1000] w-32 md:w-full"><Figure outfit={outfit} title={describe(outfit)} className="h-full w-full" /></motion.div>
        <div className="space-y-4">
          <fieldset>
            <legend className="label mb-1.5 text-ink-2">Trouser leg</legend>
            <div className="flex flex-wrap gap-1.5">{FITS.map(f => <Choice key={f} on={fit === f} onClick={() => { setFit(f); markDone('silhouette-lab') }}>{f[0].toUpperCase() + f.slice(1)}</Choice>)}</div>
          </fieldset>
          <fieldset>
            <legend className="label mb-1.5 text-ink-2">On top</legend>
            <div className="flex flex-wrap gap-1.5">{(['none', 'blazer', 'chore-coat', 'bomber'] as const).map(j => <Choice key={j} on={jacket === j} onClick={() => setJacket(j)}>{j === 'none' ? 'Shirt only' : garment(j)!.name}</Choice>)}</div>
          </fieldset>
          <NoteList notes={notes} />
        </div>
      </div>
    </Frame>
  )
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return <button role="radio" aria-checked={on} onClick={onClick} className={`border px-2.5 py-1.5 font-sans text-[0.82rem] active:scale-[0.97] ${on ? 'border-ink bg-ink text-paper' : 'border-rule bg-paper-3 hover:border-ink'}`}>{children}</button>
}

const LADDERS = [['t-shirt', 'chambray-shirt', 'blazer', 'suit-jacket', 'dinner-jacket'], ['sneakers', 'chukka-boots', 'loafer', 'oxford', 'opera-pumps'], ['shorts', 'jeans', 'chinos', 'suit-trousers', 'dress-trousers-braid']]

export function FormalityLadder() {
  const { markDone } = useStore()
  const [round, setRound] = useState(0)
  const answer = LADDERS[round % LADDERS.length]
  const [order, setOrder] = useState(() => shuffle(answer))
  const [checked, setChecked] = useState(false)
  const move = (i: number, d: -1 | 1) => setOrder(o => { const n = [...o]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n })
  const right = order.every((id, i) => garment(id)!.formality === garment(answer[i])!.formality)
  const next = () => { const r = round + 1; setRound(r); setOrder(shuffle(LADDERS[r % LADDERS.length])); setChecked(false) }
  return (
    <Frame title="Formality ladder" intro="Order these from most casual (top) to most formal (bottom). Use the arrows — the explanation appears when you check.">
      <ol className="space-y-2">
        {order.map((id, i) => {
          const g = garment(id)!
          const ok = checked && g.formality === garment(answer[i])!.formality
          return (
            <motion.li layout key={id} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className={`flex items-center gap-3 border bg-paper-3 p-2 ${checked ? (ok ? 'border-accent-2' : 'border-brass') : 'border-rule'}`}>
              <span className="w-5 text-center font-display text-lg text-ink-2">{i + 1}</span>
              <div className="h-14 w-12 shrink-0"><Figure outfit={{ figure: FIG, pieces: { [g.slot!]: p(id, g.colours[0], g.patterns[0]) } }} only={g.slot} title={g.name} className="h-full w-full" /></div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight">{g.name}</p>
                {checked && <p className="text-sm text-ink-2">{FORMALITY[g.formality]} — {g.summary}</p>}
              </div>
              <div className="flex flex-col">
                <button className="btn btn-quiet min-h-0 p-1" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${g.name} up`}><ArrowUp size={16} aria-hidden /></button>
                <button className="btn btn-quiet min-h-0 p-1" disabled={i === order.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${g.name} down`}><ArrowDown size={16} aria-hidden /></button>
              </div>
            </motion.li>
          )
        })}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3" aria-live="polite">
        {!checked ? <button className="btn btn-primary" onClick={() => { setChecked(true); if (right) markDone('formality-ladder') }}>Check my order</button>
          : <button className="btn" onClick={next}><RotateCcw size={15} aria-hidden /> Another ladder</button>}
        {checked && <p className={right ? 'text-accent-2' : 'text-ink-2'}>{right ? 'Correct — each step up adds structure, polish or tradition.' : 'Not quite. Read the notes: formality rises with structure, smoothness and darker, plainer colour.'}</p>}
      </div>
    </Frame>
  )
}

interface Round { question: string; topic: Topic[]; options: { label: string; outfit: Outfit; crop: Slot }[]; right: number }
const sh = (top: Piece, jacket?: Piece, neck?: Piece): Outfit => ({ figure: FIG, pieces: { top, bottom: p('suit-trousers', 'charcoal'), shoes: p('oxford', 'black'), ...(jacket && { jacket }), ...(neck && { neck }) } })
const ROUNDS: Round[] = [
  { question: 'Which shirt and tie pair the patterns well?', topic: ['Pattern'], right: 1, options: [
    { label: 'Fine stripe shirt, fine stripe tie', outfit: sh(p('dress-shirt', 'light-blue', 'stripe'), undefined, p('tie', 'navy', 'stripe')), crop: 'top' },
    { label: 'Fine stripe shirt, solid tie', outfit: sh(p('dress-shirt', 'light-blue', 'stripe'), undefined, p('tie', 'burgundy')), crop: 'top' },
  ] },
  { question: 'Which jacket sits better over a gingham shirt?', topic: ['Pattern'], right: 0, options: [
    { label: 'Herringbone sport coat', outfit: sh(p('ocbd', 'light-blue', 'gingham'), p('sport-coat', 'brown', 'herringbone')), crop: 'jacket' },
    { label: 'Windowpane sport coat', outfit: sh(p('ocbd', 'light-blue', 'gingham'), p('sport-coat', 'mid-grey', 'windowpane')), crop: 'jacket' },
  ] },
  { question: 'For a business suit, which shirt is the more conventional choice?', topic: ['Pattern', 'Formality'], right: 0, options: [
    { label: 'Plain white dress shirt', outfit: sh(p('dress-shirt', 'white'), p('suit-jacket', 'charcoal', 'pinstripe'), p('tie', 'navy')), crop: 'jacket' },
    { label: 'Tartan flannel shirt', outfit: sh(p('flannel-shirt', 'red', 'tartan'), p('suit-jacket', 'charcoal', 'pinstripe'), p('tie', 'navy')), crop: 'jacket' },
  ] },
]

export function PatternMatch() {
  const { markDone } = useStore()
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const r = ROUNDS[i % ROUNDS.length]
  const notes = useMemo(() => (pick === null ? [] : r.options.flatMap((o, k) => topics(o.outfit, r.topic).map(n => ({ ...n, id: `${k}-${n.id}`, title: `${String.fromCharCode(65 + k)}: ${n.title}` })))), [pick, r])
  return (
    <Frame title="Pattern & texture" intro="Mixing patterns works when their scales differ. Pick one, then read why.">
      <p className="font-display text-xl">{r.question}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {r.options.map((o, k) => (
          <button key={o.label} onClick={() => { setPick(k); if (k === r.right) markDone('pattern-match') }} disabled={pick !== null} aria-pressed={pick === k}
            className={`flex flex-col items-center border p-2 text-center transition-colors ${pick === null ? 'border-rule hover:border-ink' : k === r.right ? 'border-accent-2 bg-paper-3' : pick === k ? 'border-brass' : 'border-rule opacity-70'}`}>
            <span className="h-48 w-full"><Figure outfit={o.outfit} only={o.crop} title={o.label} className="h-full w-full" /></span>
            <span className="mt-2 font-sans text-sm"><span className="font-display">{String.fromCharCode(65 + k)}.</span> {o.label}</span>
            {pick !== null && k === r.right && <span className="label mt-1 flex items-center gap-1 text-accent-2"><Check size={13} aria-hidden /> Convention</span>}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="mt-4 space-y-3">
          <p aria-live="polite">{pick === r.right ? 'Yes.' : 'Not this time.'} Here is what the notes say about each:</p>
          <NoteList notes={notes} />
          <button className="btn" onClick={() => { setI(i + 1); setPick(null) }}>Next pairing</button>
        </div>
      )}
    </Frame>
  )
}

const POOL = (['jacket', 'top', 'mid', 'coat', 'shoes', 'bottom'] as Slot[]).flatMap(optionsFor)

export function Identify() {
  const { markDone } = useStore()
  const make = () => {
    const g = POOL[Math.floor(Math.random() * POOL.length)]
    const same = POOL.filter(x => x.slot === g.slot && x.id !== g.id)
    return { g, options: shuffle([g, ...shuffle(same).slice(0, 3)]) }
  }
  const [q, setQ] = useState(make)
  const [pick, setPick] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const { g } = q
  return (
    <Frame title="Name that garment" intro="A catalogue drawing, four names. Look at the collar, the length, the closures.">
      <div className="grid gap-5 sm:grid-cols-[14rem_1fr]">
        <div className="plate mx-auto h-64 w-full max-w-56 p-3"><Figure outfit={{ figure: FIG, pieces: { [g.slot!]: p(g.id, g.colours[0], g.patterns[0]) } }} only={g.slot} title="The garment to identify" className="h-full w-full" /></div>
        <div>
          <div className="grid gap-2">
            {q.options.map(o => (
              <button key={o.id} disabled={!!pick} onClick={() => { setPick(o.id); if (o.id === g.id) { setScore(s => s + 1); if (score >= 2) markDone('identify') } }}
                className={`flex items-center justify-between border px-3 py-2.5 text-left font-display text-lg ${!pick ? 'border-rule hover:border-ink' : o.id === g.id ? 'border-accent-2 bg-paper-3' : pick === o.id ? 'border-brass' : 'border-rule opacity-60'}`}>
                {o.name}
                {pick && o.id === g.id && <Check size={18} className="text-accent-2" aria-label="Correct" />}
                {pick === o.id && o.id !== g.id && <X size={18} className="text-brass" aria-label="Incorrect" />}
              </button>
            ))}
          </div>
          {pick && (
            <div className="mt-4" aria-live="polite">
              <p><strong className="font-display font-normal">{g.name}.</strong> {g.summary} <Link to={`/encyclopedia/${g.id}`} className="xref">Full entry</Link></p>
              {g.features[0] && <p className="mt-1 text-sm text-ink-2">Tell-tale: {g.features[0]}</p>}
              <button className="btn mt-3" onClick={() => { setQ(make()); setPick(null) }}>Next garment</button>
            </div>
          )}
          <p className="label mt-4 text-ink-2">Correct so far: {score}</p>
        </div>
      </div>
    </Frame>
  )
}

export const ACTIVITY: Record<string, () => ReactNode> = {
  'colour-workshop': ColourWorkshop, 'silhouette-lab': SilhouetteLab, 'formality-ladder': FormalityLadder, 'pattern-match': PatternMatch, identify: Identify,
}
