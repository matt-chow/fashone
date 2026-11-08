import { expect, test } from 'vitest'
import { preset, PRESETS } from '../data/presets'
import { explain, hasConflict } from '../lib/explain'
import { decode, encode, randomOutfit, setPiece } from '../lib/outfit'
import { search } from '../lib/search'
import { importJson, exportJson, migrate, EMPTY_DATA } from '../lib/store'
import { plain, links } from '../lib/inline'

const ids = (o: Parameters<typeof explain>[0], ctx = {}) => explain(o, ctx).map(n => `${n.id}:${n.tone}`)

test('outfit codes round-trip and reject junk', () => {
  for (const p of PRESETS) expect(decode(encode(p.outfit))).toEqual(p.outfit)
  expect(decode('nonsense')).toBeNull()
  expect(decode('top.ocbd.white.oxford')).toBeNull() // missing required slots
  expect(decode('top.ocbd.white.tartan~bottom.jeans.indigo.denim~shoes.derby.brown.solid|99.0.0')?.pieces.top?.pattern).toBe('solid')
})

test('every note is labelled and every preset avoids broken conventions in its own occasion', () => {
  for (const p of PRESETS) {
    const notes = explain(p.outfit, { occasion: p.occasion })
    expect(notes.every(n => n.kind === 'convention' || n.kind === 'interpretation')).toBe(true)
    expect(notes.filter(n => n.tone === 'consider' && n.kind === 'convention').map(n => `${p.id} ${n.id}`)).toEqual([])
  }
})

test('black tie kit is checked', () => {
  expect(ids(preset('black-tie')!.outfit, { occasion: 'black-tie' })).toContain('black-tie-kit:works')
  expect(ids(preset('navy-blazer')!.outfit, { occasion: 'black-tie' })).toContain('black-tie-kit:consider')
})

test('common mistakes are explained', () => {
  const base = preset('navy-blazer')!.outfit
  const tee = setPiece(setPiece(base, 'top', { garmentId: 't-shirt', colour: 'white', pattern: 'solid' }), 'neck', { garmentId: 'tie', colour: 'burgundy', pattern: 'solid' })
  expect(ids(tee)).toContain('layer-tie-collar:consider')
  const orphan = setPiece(base, 'jacket', { garmentId: 'suit-jacket', colour: 'navy', pattern: 'solid' })
  expect(ids(orphan)).toContain('layer-orphan:consider')
  const gap = setPiece(preset('business-suit')!.outfit, 'shoes', { garmentId: 'sandals', colour: 'brown', pattern: 'solid' })
  expect(ids(gap)).toContain('formality-gap:consider')
  expect(ids(base, { season: 'summer' }).some(i => i.startsWith('season'))).toBe(true)
})

test('tonal and contrast presets are described as such', () => {
  expect(ids(preset('tonal-camel')!.outfit)).toContain('colour-tonal:works')
  expect(ids(preset('contrast-navy-white')!.outfit)).toContain('contrast-high:works')
})

test('randomiser honours constraints and avoids conflicts when it can', () => {
  let seed = 1
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 20; i++) {
    const ctx = { occasion: 'office', season: 'winter' as const }
    const o = randomOutfit({ formality: [2, 4], season: 'winter' }, x => !hasConflict(x, ctx), rnd)
    expect(o.pieces.top && o.pieces.bottom && o.pieces.shoes).toBeTruthy()
  }
})

test('search ranks title matches first and spans content types', () => {
  expect(search('oxford')[0].title.toLowerCase()).toContain('oxford')
  const kinds = new Set(search('ivy').map(h => h.kind))
  expect(kinds.has('Style') && kinds.has('Chapter')).toBe(true)
  expect(search('')).toEqual([])
})

test('store migration tolerates bad data and round-trips exports', () => {
  expect(migrate(null)).toEqual(EMPTY_DATA)
  expect(migrate({ outfits: [{ code: 'bad' }], bookmarks: ['c:fit-first', 3], progress: { a: 'x', b: 0.5 } }))
    .toEqual({ ...EMPTY_DATA, bookmarks: ['c:fit-first'], progress: { b: 0.5 } })
  expect(() => migrate({ schema: 99 })).toThrow()
  const d = { ...EMPTY_DATA, outfits: [{ id: '1', name: 'A', code: encode(preset('ivy-campus')!.outfit), created: 1 }] }
  expect(importJson(exportJson(d))).toEqual(d)
  expect(() => importJson('{"foo":1}')).toThrow()
  expect(() => importJson('not json')).toThrow()
})

test('inline markup', () => {
  expect(plain('A **bold** [link](g:ocbd)')).toBe('A bold link')
  expect(links('[a](g:x) and [b](/studio)')).toEqual(['g:x', '/studio'])
})
