import assert from 'node:assert'
import { isCircular } from '../src/index.js'

describe('isCircular', function () {
  it('circular object', function () {
    const o = { a: { b: {} } }
    o.a.c = o.a.b
    assert.ok(isCircular(o))
  })

  it('not a circular object', function () {
    const o = { a: {} }
    o.a.c = { c: 1 }
    assert.ok(!isCircular(o))
  })
})
