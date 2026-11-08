import { expect, test } from 'vitest'
import { validate } from '../data/validate'

test('all content cross-references resolve', () => {
  expect(validate()).toEqual([])
})
