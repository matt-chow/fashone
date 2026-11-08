import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { challenge } from '../data/challenges'
import { preset } from '../data/presets'
import type { Block } from '../data/types'
import { useStore } from '../lib/store'
import { ACTIVITY } from './Activities'
import { Anatomy } from './Anatomy'
import { Plate } from './bits'

/** Renders a chapter's `demo` block: an embedded activity, anatomy plate, preset or challenge card. */
export function Demo({ block }: { block: Extract<Block, { t: 'demo' }> }) {
  const { data } = useStore()
  if (block.kind === 'anatomy' && block.anatomy) return <Anatomy id={block.anatomy} />
  if (block.kind === 'preset' && block.preset) {
    const p = preset(block.preset)!
    return (
      <div className="grid items-center gap-5 sm:grid-cols-[11rem_1fr]">
        <Plate outfit={p.outfit} className="mx-auto w-40 sm:w-full" figClass="aspect-[280/1000] w-full px-4 pt-3" />
        <div>
          <h3 className="text-2xl">{p.name}</h3>
          <p className="mt-1">{block.caption ?? p.note}</p>
          <Link to={`/studio?preset=${p.id}`} className="btn mt-3">Try it in the Studio <ArrowRight size={15} aria-hidden /></Link>
        </div>
      </div>
    )
  }
  if (block.kind === 'challenge' && block.challenge) {
    const c = challenge(block.challenge)!
    return (
      <div className="border border-accent-2 bg-paper-3 p-5">
        <h3 className="text-2xl">Challenge: {c.title}</h3>
        {data.done[c.id] && <p className="label mt-1 text-accent-2">Completed</p>}
        <p className="mt-1">{block.caption ?? c.brief}</p>
        <Link to={`/studio?challenge=${c.id}`} className="btn btn-primary mt-3">Dress for it <ArrowRight size={15} aria-hidden /></Link>
      </div>
    )
  }
  const A = ACTIVITY[block.kind]
  return A ? <A /> : null
}
