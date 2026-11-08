import { Download, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { CHAPTERS, chapter } from '../data/chapters'
import { garment } from '../data/garments'
import { style } from '../data/styles'
import { decode } from '../lib/outfit'
import { exportJson, importJson, useStore } from '../lib/store'
import { Crumbs, Plate, useTitle } from '../ui/bits'

const BOOKMARK: Record<string, (id: string) => [string, string] | undefined> = {
  c: id => { const c = chapter(id); return c && [c.title, `/handbook/${id}`] },
  g: id => { const g = garment(id); return g && [g.name, `/encyclopedia/${id}`] },
  s: id => { const s = style(id); return s && [s.name, `/atlas/${id}`] },
}

export default function Saved() {
  const { data, status, removeOutfit, renameOutfit, toggleBookmark, replace } = useStore()
  const [msg, setMsg] = useState('')
  const file = useRef<HTMLInputElement>(null)
  useTitle('Saved')
  const read = CHAPTERS.filter(c => (data.progress[c.id] ?? 0) >= 1).length

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportJson(data)], { type: 'application/json' }))
    Object.assign(document.createElement('a'), { href: url, download: `fashone-${new Date().toISOString().slice(0, 10)}.json` }).click()
    URL.revokeObjectURL(url)
  }
  const upload = async (f: File | undefined) => {
    if (!f) return
    try {
      const d = importJson(await f.text())
      if (!confirm(`Replace your current saved data with this file (${d.outfits.length} outfits, ${d.bookmarks.length} bookmarks)?`)) return
      replace(d); setMsg('Imported.')
    } catch (e) { setMsg(e instanceof Error ? e.message : 'That file could not be read.') }
    if (file.current) file.current.value = ''
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <Crumbs trail={[['Fashone', '/'], ['Saved']]} />
      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl sm:text-6xl">Your wardrobe book</h1>
          <p className="mt-3 text-lg text-ink-2">Stored in this browser only{status === 'memory' ? ' — but storage is unavailable, so this session will not be kept' : ''}. Export a copy to move it elsewhere.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={download}><Download size={16} aria-hidden /> Export JSON</button>
          <button className="btn" onClick={() => file.current?.click()}><Upload size={16} aria-hidden /> Import</button>
          <input ref={file} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden onChange={e => upload(e.target.files?.[0])} />
        </div>
      </header>
      <p role="status" className="mt-2 min-h-6 text-sm text-accent-2">{msg}</p>

      <section aria-labelledby="o-h" className="mt-6">
        <h2 id="o-h" className="border-b border-rule pb-2 text-3xl">Outfits <span className="font-sans text-base text-ink-2">({data.outfits.length})</span></h2>
        {!data.outfits.length && <p className="mt-4 italic text-ink-2">No outfits yet. Dress the figure in the <Link to="/studio" className="xref">Studio</Link> and press Save.</p>}
        <ul className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {data.outfits.map(s => {
            const o = decode(s.code)
            if (!o) return null
            return (
              <li key={s.id}>
                <Link to={`/studio?o=${encodeURIComponent(s.code)}`} aria-label={`Open ${s.name} in the Studio`}><Plate outfit={o} figClass="aspect-[280/1000] w-full px-4 pt-3" /></Link>
                <input className="mt-2 w-full border-b border-transparent bg-transparent font-display text-lg hover:border-rule focus:border-accent focus:outline-none" defaultValue={s.name} aria-label="Outfit name" onBlur={e => renameOutfit(s.id, e.target.value.trim() || s.name)} />
                <div className="flex items-center justify-between font-sans text-xs text-ink-2">
                  <time dateTime={new Date(s.created).toISOString()}>{new Date(s.created).toLocaleDateString()}</time>
                  <button onClick={() => removeOutfit(s.id)} className="btn btn-quiet min-h-0 p-1.5" aria-label={`Delete ${s.name}`}><Trash2 size={14} aria-hidden /></button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section aria-labelledby="b-h">
          <h2 id="b-h" className="border-b border-rule pb-2 text-3xl">Bookmarks</h2>
          {!data.bookmarks.length && <p className="mt-4 italic text-ink-2">Bookmark chapters, garments and styles to find them here.</p>}
          <ul className="divide-y divide-rule">
            {data.bookmarks.map(b => {
              const [kind, id] = [b[0], b.slice(2)]
              const hit = BOOKMARK[kind]?.(id)
              return hit && (
                <li key={b} className="flex items-center justify-between gap-3 py-2.5">
                  <Link to={hit[1]} className="font-display text-lg hover:text-accent">{hit[0]}</Link>
                  <span className="flex items-center gap-2"><span className="label text-ink-2">{kind === 'c' ? 'Chapter' : kind === 'g' ? 'Garment' : 'Style'}</span>
                    <button className="btn btn-quiet min-h-0 p-1.5" onClick={() => toggleBookmark(b)} aria-label={`Remove bookmark ${hit[0]}`}><Trash2 size={14} aria-hidden /></button></span>
                </li>
              )
            })}
          </ul>
        </section>
        <section aria-labelledby="p-h">
          <h2 id="p-h" className="border-b border-rule pb-2 text-3xl">Reading progress</h2>
          <p className="mt-4">{read} of {CHAPTERS.length} chapters read · {Object.keys(data.done).length} exercises and challenges completed.</p>
          <div className="mt-3 flex h-2 overflow-hidden bg-paper-2" role="img" aria-label={`${read} of ${CHAPTERS.length} chapters read`}>
            <div className="bg-accent-2" style={{ width: `${(read / CHAPTERS.length) * 100}%` }} />
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            {CHAPTERS.filter(c => data.progress[c.id]).map(c => (
              <li key={c.id} className="flex justify-between gap-3"><Link className="xref" to={`/handbook/${c.id}`}>{c.title}</Link><span className="text-ink-2">{Math.round(data.progress[c.id] * 100)}%</span></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
