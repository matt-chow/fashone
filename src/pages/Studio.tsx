import { Check, Dices, Info, Link2, RotateCcw, Save, Shirt, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { challenge as getChallenge } from '../data/challenges'
import { FORMALITY, garment } from '../data/garments'
import { OCCASIONS, occasion } from '../data/occasions'
import { colour } from '../data/palette'
import { PRESETS, preset } from '../data/presets'
import { STYLES } from '../data/styles'
import type { Outfit, PatternId, Season, Slot } from '../data/types'
import { HAIR_COLOURS, HAIR_STYLES, SKIN_TONES } from '../figure/body'
import { Figure } from '../figure/Figure'
import { explain, hasConflict, type Context, type Note } from '../lib/explain'
import { EMPTY, FITS, SLOTS, decode, describe, encode, optionsFor, pieceFor, randomOutfit, setPiece } from '../lib/outfit'
import { useStore } from '../lib/store'
import { Crumbs, Tag, useTitle } from '../ui/bits'

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']
const PATTERN_NAMES: Record<PatternId, string> = { solid: 'Solid', oxford: 'Oxford cloth', stripe: 'Stripe', pinstripe: 'Pinstripe', chalkstripe: 'Chalkstripe', gingham: 'Gingham', windowpane: 'Windowpane', tartan: 'Tartan', herringbone: 'Herringbone', houndstooth: 'Houndstooth', denim: 'Denim', cord: 'Corduroy', cable: 'Cable', rib: 'Rib', seersucker: 'Seersucker', satin: 'Satin' }

/** Guided comparisons the brief calls out; each toggles between presets. */
const LESSONS: { title: string; presets: string[]; prompt: string }[] = [
  { title: 'Winter dinner', presets: ['winter-dinner'], prompt: 'A roll-neck replaces shirt and tie. Try swapping the coat for a peacoat and read the layering note.' },
  { title: 'The navy blazer, smart casual', presets: ['navy-blazer'], prompt: 'Change the trousers to jeans, then to suit trousers, and watch the formality notes move.' },
  { title: 'Relaxed vs tailored trousers', presets: ['relaxed-trousers', 'tailored-trousers'], prompt: 'Same idea, two silhouettes. Switch between them and compare the silhouette notes.' },
  { title: 'Ivy style', presets: ['ivy-campus'], prompt: 'Set the tradition to Ivy to see which pieces belong — then try a blazer instead of the sweater.' },
  { title: 'Workwear layering', presets: ['workwear-layers'], prompt: 'Thin to thick, close to loose. Remove a layer at a time and see what each one adds.' },
  { title: 'Tonal vs contrast', presets: ['tonal-camel', 'contrast-navy-white'], prompt: 'One colour family in many depths, against light-on-dark. Neither is more correct.' },
]

function initial(params: URLSearchParams): Outfit {
  const p = params.get('preset')
  const base = decode(params.get('o')) ?? (p ? preset(p)?.outfit : undefined) ?? EMPTY
  const add = params.get('add') && garment(params.get('add')!)
  return add && add.slot && optionsFor(add.slot).includes(add) ? setPiece(base, add.slot, pieceFor(add, base.pieces[add.slot])) : base
}

export default function Studio() {
  const [params, setParams] = useSearchParams()
  const [outfit, setOutfit] = useState<Outfit>(() => initial(params))
  const ch = getChallenge(params.get('challenge') ?? '')
  const startPreset = preset(params.get('preset') ?? '')
  const [ctx, setCtx] = useState<Context>(() => ch ? { occasion: ch.occasion, season: ch.season, style: ch.style } : { occasion: startPreset?.occasion })
  const [focus, setFocus] = useState<Slot | null>(params.get('add') ? garment(params.get('add')!)?.slot ?? null : null)
  const [tab, setTab] = useState<'dress' | 'notes' | 'lessons'>('dress')
  const [flash, setFlash] = useState('')
  const { saveOutfit, markDone } = useStore()
  useTitle('Outfit Studio')

  // Keep the URL shareable without adding history entries per click.
  useEffect(() => {
    const next = new URLSearchParams()
    next.set('o', encode(outfit))
    if (ch) next.set('challenge', ch.id)
    setParams(next, { replace: true, preventScrollReset: true })
  }, [outfit, ch, setParams])

  useEffect(() => { if (flash) { const t = setTimeout(() => setFlash(''), 2400); return () => clearTimeout(t) } }, [flash])

  const notes = useMemo(() => explain(outfit, ctx), [outfit, ctx])
  const update = (slot: Slot, piece: Parameters<typeof setPiece>[2]) => setOutfit(o => setPiece(o, slot, piece))
  const randomise = () => {
    const occ = ctx.occasion ? occasion(ctx.occasion) : undefined
    setOutfit(o => ({ ...randomOutfit({ formality: occ?.formality, season: ctx.season, style: ctx.style }, x => !hasConflict(x, ctx)), figure: o.figure }))
    setFlash('A new combination, chosen to respect the occasion, season and tradition you set.')
  }
  const load = (id: string) => { const p = preset(id); if (p) { setOutfit(p.outfit); setCtx(c => ({ ...c, occasion: p.occasion ?? c.occasion })) } }

  const needs = ch?.needs?.filter(([ids]) => !Object.values(outfit.pieces).some(p => ids.includes(p.garmentId))) ?? []
  const broken = notes.filter(n => n.tone === 'consider' && n.kind === 'convention')
  const solved = !!ch && !needs.length && !broken.length
  useEffect(() => { if (solved && ch) markDone(ch.id) }, [solved, ch, markDone])

  return (
    <div className="mx-auto max-w-[84rem] px-4 pb-10 pt-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Crumbs trail={[['Fashone', '/'], ['Outfit Studio']]} />
          <h1 className="mt-2 text-4xl sm:text-5xl">The Outfit Studio</h1>
          <p className="mt-2 max-w-xl text-ink-2">Dress the figure layer by layer. Every change is explained — what follows convention, and what is a matter of taste.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={randomise}><Dices size={16} aria-hidden /> Randomise</button>
          <button className="btn" onClick={() => { setOutfit(EMPTY); setFocus(null) }}><RotateCcw size={16} aria-hidden /> Reset</button>
          <SaveButton onSave={name => { saveOutfit(name, outfit); setFlash(`Saved “${name || 'Untitled outfit'}”. Find it under Saved.`) }} />
          <button className="btn" onClick={() => navigator.clipboard?.writeText(location.href).then(() => setFlash('Link copied — anyone with it sees this outfit.'), () => setFlash('Copy the address bar to share this outfit.'))}><Link2 size={16} aria-hidden /> Share</button>
        </div>
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-6 text-sm text-accent-2">{flash}</p>

      {ch && (
        <section aria-label="Challenge" className="mt-3 border border-accent-2 bg-paper-3 p-4 sm:flex sm:items-start sm:gap-6">
          <div className="flex-1">
            <h2 className="text-2xl">Challenge: {ch.title}</h2>
            <p className="mt-1">{ch.brief}</p>
            <p className="mt-2 text-sm text-ink-2"><em>Hint:</em> {ch.hint}</p>
          </div>
          <div className="mt-3 sm:mt-0 sm:w-80">
            {solved
              ? <p className="flex items-start gap-2 text-accent-2"><Check size={18} className="mt-0.5 shrink-0" aria-hidden /> Well dressed. Every requirement is met and no convention is broken. Read the notes to see why it works.</p>
              : <ul className="space-y-1.5 text-sm">{[...needs.map(n => n[1]), ...broken.map(n => n.title)].map(t => <li key={t} className="flex gap-2"><Info size={15} className="mt-0.5 shrink-0 text-brass" aria-hidden />{t}</li>)}</ul>}
            <Link to="/studio" className="xref mt-2 inline-block text-sm">Leave challenge</Link>
          </div>
        </section>
      )}

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)_minmax(0,22rem)]">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <figure className="plate relative">
            <div
              className="mx-auto aspect-[280/1000] max-h-[78vh] w-full cursor-pointer px-6 pt-4 [&_[data-slot]]:transition-opacity"
              onClick={e => { const s = (e.target as Element).closest('[data-slot]')?.getAttribute('data-slot') as Slot | null; if (s) { setFocus(s); setTab('dress') } }}
            >
              <Figure outfit={outfit} title={describe(outfit)} className="h-full w-full" />
            </div>
            <figcaption className="border-t border-rule px-3 py-2 text-center text-sm italic text-ink-2">Select a garment on the figure to edit it.</figcaption>
          </figure>
          <FigureOptions outfit={outfit} onChange={figure => setOutfit(o => ({ ...o, figure }))} />
        </div>

        <div className="min-w-0">
          <ContextBar ctx={ctx} setCtx={setCtx} locked={!!ch} />
          <div role="tablist" aria-label="Studio panels" className="mt-4 flex border-b border-rule xl:hidden">
            {(['dress', 'notes', 'lessons'] as const).map(t => (
              <button key={t} role="tab" aria-selected={tab === t} aria-controls={`panel-${t}`} id={`tab-${t}`} onClick={() => setTab(t)} className={`label -mb-px border-b-2 px-4 py-2.5 ${tab === t ? 'border-accent text-accent' : 'border-transparent text-ink-2 hover:text-ink'}`}>
                {t === 'dress' ? 'Wardrobe' : t === 'notes' ? `Notes (${notes.length})` : 'Lessons'}
              </button>
            ))}
          </div>
          <div id="panel-dress" role="tabpanel" aria-labelledby="tab-dress" className={`${tab === 'dress' ? '' : 'hidden'} xl:block`}>
            <Wardrobe outfit={outfit} update={update} focus={focus} setFocus={setFocus} notes={notes} />
          </div>
          <div id="panel-notes" role="tabpanel" aria-labelledby="tab-notes" className={`${tab === 'notes' ? '' : 'hidden'} xl:hidden`}>
            <Notes notes={notes} onFocus={s => { setFocus(s); setTab('dress') }} />
          </div>
          <div id="panel-lessons" role="tabpanel" aria-labelledby="tab-lessons" className={`${tab === 'lessons' ? '' : 'hidden'} xl:block`}>
            <Lessons onLoad={load} />
          </div>
        </div>

        <aside aria-label="Notes on this outfit" className="hidden xl:block xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto">
          <Notes notes={notes} onFocus={setFocus} />
        </aside>
      </div>
    </div>
  )
}

function ContextBar({ ctx, setCtx, locked }: { ctx: Context; setCtx: (f: (c: Context) => Context) => void; locked: boolean }) {
  const sel = (label: string, value: string | undefined, opts: [string, string][], key: keyof Context) => (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="label text-ink-2">{label}</span>
      <select className="field w-full" value={value ?? ''} disabled={locked} onChange={e => setCtx(c => ({ ...c, [key]: e.target.value || undefined }))}>
        <option value="">Any</option>
        {opts.map(([v, n]) => <option key={v} value={v}>{n}</option>)}
      </select>
    </label>
  )
  return (
    <fieldset className="flex flex-wrap gap-3 border border-rule bg-paper-3 p-3">
      <legend className="sr-only">Dressing for</legend>
      {sel('Occasion', ctx.occasion, OCCASIONS.map(o => [o.id, o.name]), 'occasion')}
      {sel('Season', ctx.season, SEASONS.map(s => [s, s[0].toUpperCase() + s.slice(1)]), 'season')}
      {sel('Tradition', ctx.style, STYLES.map(s => [s.id, s.name]), 'style')}
    </fieldset>
  )
}

function Wardrobe({ outfit, update, focus, setFocus, notes }: { outfit: Outfit; update: (s: Slot, p: Parameters<typeof setPiece>[2]) => void; focus: Slot | null; setFocus: (s: Slot | null) => void; notes: Note[] }) {
  return (
    <ul className="mt-4 divide-y divide-rule border-y border-rule">
      {SLOTS.map(({ slot, label, required }) => {
        const piece = outfit.pieces[slot]
        const g = piece && garment(piece.garmentId)
        const open = focus === slot
        const flagged = notes.some(n => n.tone === 'consider' && n.slots?.includes(slot))
        const opts = optionsFor(slot)
        return (
          <li key={slot} className={open ? 'bg-paper-3' : ''}>
            <button aria-expanded={open} aria-controls={`slot-${slot}`} onClick={() => setFocus(open ? null : slot)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-paper-2">
              <span className="size-5 shrink-0 rounded-full border border-ink/40" style={{ background: piece ? colour(piece.colour).hex : 'transparent' }} aria-hidden />
              <span className="label w-28 shrink-0 text-ink-2">{label}</span>
              <span className={`min-w-0 flex-1 truncate ${g ? '' : 'italic text-ink-2'}`}>{g ? `${colour(piece!.colour).name} ${g.name.toLowerCase()}` : 'None'}</span>
              {flagged && <span className="label text-brass" title="See the notes">Note</span>}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div id={`slot-${slot}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                  <div className="space-y-4 px-3 pb-4">
                    <div>
                      <p className="label mb-1.5 text-ink-2" id={`g-${slot}`}>Garment</p>
                      <div role="radiogroup" aria-labelledby={`g-${slot}`} className="flex flex-wrap gap-1.5">
                        {!required && <Chip on={!piece} onClick={() => update(slot, undefined)}><X size={13} aria-hidden /> None</Chip>}
                        {opts.map(o => <Chip key={o.id} on={piece?.garmentId === o.id} onClick={() => update(slot, pieceFor(o, piece))}>{o.name}</Chip>)}
                      </div>
                    </div>
                    {piece && g && (
                      <>
                        <div>
                          <p className="label mb-1.5 text-ink-2" id={`c-${slot}`}>Colour · <span className="normal-case tracking-normal">{colour(piece.colour).name}</span></p>
                          <div role="radiogroup" aria-labelledby={`c-${slot}`} className="flex flex-wrap gap-1.5">
                            {g.colours.map(id => (
                              <button key={id} role="radio" aria-checked={piece.colour === id} aria-label={colour(id).name} title={colour(id).name} onClick={() => update(slot, { ...piece, colour: id })}
                                className={`size-8 rounded-full border transition-transform duration-150 active:scale-95 ${piece.colour === id ? 'border-ink ring-2 ring-accent ring-offset-2 ring-offset-paper-3' : 'border-ink/30 hover:scale-110'}`} style={{ background: colour(id).hex }} />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {g.patterns.length > 1 && (
                            <label className="flex flex-col gap-1">
                              <span className="label text-ink-2">Cloth & pattern</span>
                              <select className="field" value={piece.pattern} onChange={e => update(slot, { ...piece, pattern: e.target.value as PatternId })}>
                                {g.patterns.map(p => <option key={p} value={p}>{PATTERN_NAMES[p]}</option>)}
                              </select>
                            </label>
                          )}
                          {g.fits && (
                            <fieldset className="flex flex-col gap-1">
                              <legend className="label mb-1 text-ink-2">Silhouette</legend>
                              <div className="flex gap-1">{FITS.map(f => <Chip key={f} on={(piece.fit ?? 'straight') === f} onClick={() => update(slot, { ...piece, fit: f })}>{f[0].toUpperCase() + f.slice(1)}</Chip>)}</div>
                            </fieldset>
                          )}
                        </div>
                        <div className="flex gap-3 border-t border-rule pt-3 text-sm">
                          <Shirt size={16} className="mt-0.5 shrink-0 text-ink-2" aria-hidden />
                          <p><span className="text-ink-2">{FORMALITY[g.formality]}.</span> {g.summary} <Link to={`/encyclopedia/${g.id}`} className="xref whitespace-nowrap">Encyclopedia entry →</Link></p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button role="radio" aria-checked={on} onClick={onClick} className={`inline-flex items-center gap-1 border px-2.5 py-1.5 font-sans text-[0.82rem] transition-colors active:scale-[0.97] ${on ? 'border-ink bg-ink text-paper' : 'border-rule bg-paper hover:border-ink'}`}>{children}</button>
  )
}

function Notes({ notes, onFocus }: { notes: Note[]; onFocus: (s: Slot) => void }) {
  const ordered = [...notes].sort((a, b) => (a.tone === b.tone ? 0 : a.tone === 'consider' ? -1 : 1))
  return (
    <section className="mt-4 xl:mt-0">
      <h2 className="text-2xl">Notes on this outfit</h2>
      <p className="mt-1 text-sm text-ink-2">No scores — just observations. <Tag tone="convention">Convention</Tag> is widely shared; <Tag tone="interpretation">Interpretation</Tag> is taste.</p>
      <ol className="mt-4 space-y-3" aria-live="polite">
        <AnimatePresence initial={false}>
          {ordered.map(n => (
            <motion.li key={n.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={`border bg-paper-3 p-3.5 ${n.tone === 'consider' ? 'border-brass' : 'border-rule'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="label text-ink-2">{n.topic}</span>
                <Tag tone={n.kind}>{n.kind === 'convention' ? 'Convention' : 'Interpretation'}</Tag>
                <span className={`label ml-auto flex items-center gap-1 ${n.tone === 'works' ? 'text-accent-2' : 'text-brass'}`}>{n.tone === 'works' ? <><Check size={13} aria-hidden /> Works</> : <><Info size={13} aria-hidden /> Consider</>}</span>
              </div>
              <h3 className="mt-1.5 font-display text-lg leading-snug">{n.title}</h3>
              <p className="mt-1 text-[0.95rem] leading-relaxed">{n.body}</p>
              {!!n.slots?.length && (
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {[...new Set(n.slots)].map(s => <button key={s} onClick={() => onFocus(s)} className="xref font-sans text-xs">Edit {SLOTS.find(x => x.slot === s)?.label.toLowerCase()}</button>)}
                </p>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </section>
  )
}

function Lessons({ onLoad }: { onLoad: (id: string) => void }) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl">Lessons & presets</h2>
      <p className="mt-1 text-sm text-ink-2">Load an example, then change it and read how the notes respond.</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {LESSONS.map(l => (
          <li key={l.title} className="border border-rule p-3.5">
            <h3 className="font-display text-lg">{l.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{l.prompt}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {l.presets.map(id => <button key={id} className="btn min-h-0 py-1 text-xs" onClick={() => onLoad(id)}>Load {preset(id)!.name.toLowerCase()}</button>)}
            </div>
          </li>
        ))}
      </ul>
      <details className="mt-4 border border-rule">
        <summary className="cursor-pointer px-3.5 py-3 font-display text-lg">All {PRESETS.length} preset outfits</summary>
        <ul className="grid gap-x-4 px-3.5 pb-3 sm:grid-cols-2">
          {PRESETS.map(p => <li key={p.id}><button className="xref py-1 text-left text-sm" onClick={() => onLoad(p.id)}>{p.name}</button></li>)}
        </ul>
      </details>
    </section>
  )
}

function FigureOptions({ outfit, onChange }: { outfit: Outfit; onChange: (f: Outfit['figure']) => void }) {
  const f = outfit.figure
  const row = (label: string, items: { name: string; hex?: string }[], value: number, key: keyof Outfit['figure']) => (
    <div className="flex items-center gap-2">
      <span className="label w-20 shrink-0 text-ink-2" id={`fo-${key}`}>{label}</span>
      <div role="radiogroup" aria-labelledby={`fo-${key}`} className="flex flex-wrap gap-1.5">
        {items.map((it, i) => it.hex
          ? <button key={it.name} role="radio" aria-checked={value === i} aria-label={it.name} title={it.name} onClick={() => onChange({ ...f, [key]: i })} className={`size-6 rounded-full border ${value === i ? 'ring-2 ring-accent ring-offset-2 ring-offset-paper' : 'border-ink/30'}`} style={{ background: it.hex }} />
          : <Chip key={it.name} on={value === i} onClick={() => onChange({ ...f, [key]: i })}>{it.name}</Chip>)}
      </div>
    </div>
  )
  return (
    <details className="mt-3 border border-rule">
      <summary className="label cursor-pointer px-3 py-2.5 text-ink-2">The figure</summary>
      <div className="space-y-2.5 px-3 pb-3">
        {row('Skin', SKIN_TONES, f.skin, 'skin')}
        {row('Hair', HAIR_COLOURS, f.hair, 'hair')}
        {row('Cut', HAIR_STYLES.map(name => ({ name })), f.hairStyle, 'hairStyle')}
      </div>
    </details>
  )
}

function SaveButton({ onSave }: { onSave: (name: string) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  if (!open) return <button className="btn btn-primary" onClick={() => setOpen(true)}><Save size={16} aria-hidden /> Save</button>
  return (
    <form className="flex gap-2" onSubmit={e => { e.preventDefault(); onSave(name); setOpen(false); setName('') }}>
      <input autoFocus className="field w-44" placeholder="Name this outfit" aria-label="Outfit name" value={name} maxLength={80} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Escape' && setOpen(false)} />
      <button className="btn btn-primary">Save</button>
    </form>
  )
}
