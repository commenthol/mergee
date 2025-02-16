import assert from 'node:assert'
import { clone } from '../src/index.js'

describe('clone', function () {
  it('deep clone object', function () {
    const o = {
      a: { b: { c: { d: 1 } }, map: new Map([['a', 1]]), set: new Set([1, 2]) }
    }
    const r = clone(o)
    assert.deepEqual(r, o)
    assert.ok(r !== o)
    assert.ok(r.a !== o.a)
    assert.ok(r.a.b !== o.a.b)
    assert.ok(r.a.b.c !== o.a.b.c)
    assert.ok(r.a.map !== o.a.map)
    assert.ok(r.a.set !== o.a.set)
  })

  it('deep clone object with function', function () {
    const fn = (a) => a * 2
    const o = { a: { fn } }
    const r = clone(o)
    assert.ok(r !== o)
    assert.ok(r.a.fn !== o.a.fn)
    assert.equal(r.a.fn(2), o.a.fn(2))
  })

  it('deep clone array', function () {
    const o = [{ a: { b: 1 } }, { b: 2 }, { c: 3 }]
    const r = clone(o)
    assert.deepStrictEqual(r, o)
    assert.ok(r !== o)
    assert.ok(r[0] !== o[0])
    assert.ok(r[0].a !== o[0].a)
  })

  it('clone sample', function () {
    const obj = { a: { b: { c: 1 } } }
    const cloned = clone(obj)
    assert.ok(cloned !== obj)
    assert.ok(cloned.a !== obj.a)
    assert.ok(cloned.a.b !== obj.a.b)
  })
})
