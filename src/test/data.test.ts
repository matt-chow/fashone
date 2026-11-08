import { expect, test } from 'vitest'
import { ARCHIVE } from '../data/archive'
import { validate } from '../data/validate'

test('every archive image file is on disk', () => {
  const onDisk = new Set(Object.keys(import.meta.glob('/public/archive/*.webp')))
  expect(ARCHIVE.filter(a => !onDisk.has(`/public/${a.file}`)).map(a => a.file)).toEqual([])
})

test('all content cross-references resolve', () => {
  expect(validate()).toEqual([])
})
