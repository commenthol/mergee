import assert from 'node:assert'
import { set } from '../src/index.js'

describe('set', function () {
  it('set properties', function () {
    const res = set({}, 'a."b.0".c["d.e.f"]', 1)
    const exp = { a: { 'b.0': { c: { 'd.e.f': 1 } } } }
    assert.deepStrictEqual(res, exp)
  })

  it('set without key', function () {
    assert.equal(set(), undefined)
  })

  it('delete a property', function () {
    const obj = { a: { b: { c: 1 } } }
    const res = set(obj, 'a.b', null)
    const exp = { a: {} }
    assert.deepStrictEqual(res, exp)
  })

  it('append', function () {
    const obj = { a: { b: { c: 1 } } }
    const res = set(obj, 'a.b.d', 2)
    const exp = { a: { b: { c: 1, d: 2 } } }
    assert.deepStrictEqual(res, exp)
  })
})
