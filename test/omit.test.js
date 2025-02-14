import assert from 'node:assert'
import { omit } from '../src/index.js'

describe('omit', function () {
  it('omit a and d using Array', function () {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    const e = { b: 2, c: 3 }
    const r = omit(o, ['a', 'd'])
    assert.deepStrictEqual(r, e)
  })

  it('omit a and d using String', function () {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    const e = { b: 2, c: 3 }
    const r = omit(o, 'a,d')
    assert.deepStrictEqual(r, e)
  })

  it('omit only d using String', function () {
    const o = { a: 1, b: 2, c: 3, d: 4 }
    const e = { a: 1, b: 2, c: 3 }
    const r = omit(o, 'd')
    assert.deepStrictEqual(r, e)
  })

  it('omit a.b and c.d using String', function () {
    const o = { a: { a: 1, b: 2 }, c: { c: 3, d: 4 }, e: 5 }
    const e = { a: { a: 1 }, c: { c: 3 }, e: 5 }
    const r = omit(o, 'a.b, c.d')
    assert.deepStrictEqual(r, e)
  })

  it('omit from empty object', function () {
    const o = {}
    const e = {}
    const r = omit(o, 'a,d')
    assert.deepStrictEqual(r, e)
  })

  it('omit from null', function () {
    const o = null
    const r = omit(o, 'a,d')
    assert.ok(r === undefined)
  })

  it('omit from String', function () {
    const o = ''
    const r = omit(o, 'a,d')
    assert.ok(r === undefined)
  })
})
