import assert from 'node:assert'
import { pick } from '../src/index.js'

describe('pick', function () {
  it('pick a and d using Array', function () {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    const e = { a: 1, d: 4 }
    const r = pick(o, ['a', 'd'])
    assert.deepStrictEqual(r, e)
  })

  it('pick a and d using String', function () {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    const e = { a: 1, d: 4 }
    const r = pick(o, 'a,d')
    assert.deepStrictEqual(r, e)
  })

  it('pick a and d using String with spaces', function () {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    const e = { a: 1, d: 4 }
    const r = pick(o, 'a, d ')
    assert.deepStrictEqual(r, e)
  })

  it('pick only d using String', function () {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    const e = { d: 4 }
    const r = pick(o, 'd')
    assert.deepStrictEqual(r, e)
  })

  it('pick a.b and c.d using String', function () {
    const o = { a: { a: 1, b: 2 }, c: { c: 3, d: 4 }, e: 5 }
    const e = { a: { b: 2 }, c: { d: 4 } }
    const r = pick(o, 'a.b, c.d')
    assert.deepStrictEqual(r, e)
  })

  it('pick from empty object', function () {
    const o = {}
    const e = {}
    const r = pick(o, 'a,d')
    assert.deepStrictEqual(r, e)
  })

  it('pick from null', function () {
    const o = null
    const r = pick(o, 'a,d')
    assert.ok(r === undefined)
  })

  it('pick from String', function () {
    const o = ''
    const r = pick(o, 'a,d')
    assert.ok(r === undefined)
  })
})
