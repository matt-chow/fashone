import { createStore, get, set } from 'idb-keyval'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Outfit } from '../data/types'
import { decode, encode } from './outfit'

/** Everything the reader keeps locally. Bump SCHEMA and extend `migrate` when the shape changes. */
export const SCHEMA = 1
export interface SavedOutfit { id: string; name: string; code: string; created: number }
export interface Data {
  schema: typeof SCHEMA
  outfits: SavedOutfit[]
  /** Bookmarks as `c:chapter`, `g:garment` or `s:style`. */
  bookmarks: string[]
  /** Chapter id → furthest scroll fraction reached (0–1). */
  progress: Record<string, number>
  /** Activity / challenge id → completion timestamp. */
  done: Record<string, number>
}
export const EMPTY_DATA: Data = { schema: SCHEMA, outfits: [], bookmarks: [], progress: {}, done: {} }

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x)
const strings = (x: unknown) => (Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string' && s.length < 200) : [])
const numbers = (x: unknown) => Object.fromEntries(isObj(x) ? Object.entries(x).filter(([, v]) => typeof v === 'number' && Number.isFinite(v)) : []) as Record<string, number>

/** Accepts anything (old versions, imported files) and returns valid current-schema data. */
export function migrate(raw: unknown): Data {
  if (!isObj(raw)) return EMPTY_DATA
  if (typeof raw.schema === 'number' && raw.schema > SCHEMA) throw new Error('This file was saved by a newer version of Fashone.')
  const outfits = (Array.isArray(raw.outfits) ? raw.outfits : []).flatMap((s): SavedOutfit[] => {
    if (!isObj(s) || typeof s.code !== 'string' || !decode(s.code)) return []
    return [{ id: typeof s.id === 'string' ? s.id : crypto.randomUUID(), name: typeof s.name === 'string' ? s.name.slice(0, 80) : 'Untitled outfit', code: s.code, created: typeof s.created === 'number' ? s.created : Date.now() }]
  })
  return { schema: SCHEMA, outfits, bookmarks: [...new Set(strings(raw.bookmarks))], progress: numbers(raw.progress), done: numbers(raw.done) }
}

const db = typeof indexedDB === 'undefined' ? null : createStore('fashone', 'kv')
const KEY = 'data'

interface Store {
  data: Data
  /** 'memory' when IndexedDB is unavailable — changes last only for this visit. */
  status: 'loading' | 'ready' | 'memory'
  saveOutfit: (name: string, o: Outfit) => SavedOutfit
  removeOutfit: (id: string) => void
  renameOutfit: (id: string, name: string) => void
  toggleBookmark: (key: string) => void
  setProgress: (chapter: string, f: number) => void
  markDone: (id: string) => void
  replace: (d: Data) => void
}
const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(EMPTY_DATA)
  const [status, setStatus] = useState<Store['status']>(db ? 'loading' : 'memory')
  const loaded = useRef(false)

  useEffect(() => {
    if (!db) return
    get(KEY, db).then(raw => { setData(migrate(raw)); setStatus('ready') }, () => setStatus('memory')).finally(() => { loaded.current = true })
  }, [])

  // Write-through after load; failures downgrade to memory mode rather than losing the session.
  useEffect(() => {
    if (!db || !loaded.current || status !== 'ready') return
    set(KEY, data, db).catch(() => setStatus('memory'))
  }, [data, status])

  const update = useCallback((f: (d: Data) => Data) => setData(f), [])
  const store = useMemo<Store>(() => ({
    data, status,
    saveOutfit: (name, o) => {
      const s = { id: crypto.randomUUID(), name: name.trim().slice(0, 80) || 'Untitled outfit', code: encode(o), created: Date.now() }
      update(d => ({ ...d, outfits: [s, ...d.outfits] }))
      return s
    },
    removeOutfit: id => update(d => ({ ...d, outfits: d.outfits.filter(s => s.id !== id) })),
    renameOutfit: (id, name) => update(d => ({ ...d, outfits: d.outfits.map(s => (s.id === id ? { ...s, name: name.slice(0, 80) } : s)) })),
    toggleBookmark: key => update(d => ({ ...d, bookmarks: d.bookmarks.includes(key) ? d.bookmarks.filter(b => b !== key) : [key, ...d.bookmarks] })),
    setProgress: (c, f) => update(d => (f > (d.progress[c] ?? 0) + 0.02 || (f >= 0.98 && (d.progress[c] ?? 0) < 1) ? { ...d, progress: { ...d.progress, [c]: f >= 0.98 ? 1 : f } } : d)),
    markDone: id => update(d => (d.done[id] ? d : { ...d, done: { ...d.done, [id]: Date.now() } })),
    replace: d => setData(d),
  }), [data, status, update])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside StoreProvider')
  return s
}

export const exportJson = (d: Data) => JSON.stringify({ app: 'fashone', exported: new Date().toISOString(), ...d }, null, 2)
export function importJson(text: string): Data {
  let raw: unknown
  try { raw = JSON.parse(text) } catch { throw new Error('That file is not valid JSON.') }
  if (!isObj(raw) || raw.app !== 'fashone') throw new Error('That file does not look like a Fashone export.')
  return migrate(raw)
}
