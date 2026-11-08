import { expect, test } from 'vitest'
import { ARCHIVE } from '../data/archive'
import { PHOTOS } from '../data/photos'
import { validate } from '../data/validate'

test('every archive image and photograph file is on disk', () => {
  const onDisk = new Set(Object.keys(import.meta.glob(['/public/archive/*.webp', '/public/photos/*.webp'])))
  expect([...ARCHIVE, ...PHOTOS].filter(a => !onDisk.has(`/public/${a.file}`)).map(a => a.file)).toEqual([])
})

test('all content cross-references resolve', () => {
  expect(validate()).toEqual([])
})
