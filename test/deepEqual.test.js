import assert from 'node:assert'
import { deepEqual } from '../src/index.js'

describe('deepEqual', function () {
  it('boolean equal', function () {
    const a = true
    const b = true
    assert.ok(deepEqual(a, b))
  })

  it('boolean not equal', function () {
    const a = true
    const b = false
    assert.ok(!deepEqual(a, b))
  })

  it('number equals', function () {
    const a = 0
    const b = 0
    assert.ok(deepEqual(a, b))
  })

  it('number not equals', function () {
    const a = 1
    const b = 0
    assert.ok(!deepEqual(a, b))
  })

  it('undefined equals', function () {
    let a
    let b
    assert.ok(deepEqual(a, b))
  })

  it('compare undefined with null', function () {
    const a = null
    let b
    assert.ok(deepEqual(a, b))
  })

  it('compare object references', function () {
    const a = { a: { b: { c: 1 }, d: 2 } }
    const b = a
    assert.ok(deepEqual(a, b))
  })

  it('deep compare objects', function () {
    const a = { a: { b: { c: 1 }, d: 2 } }
    const b = { a: { b: { c: 1 }, d: 2 } }
    assert.ok(deepEqual(a, b))
  })

  it('deep compare mixed objects', function () {
    const a = { a: { b: { c: [1, 1, 2, 3] }, d: 2, e: null } }
    const b = { a: { b: { c: [1, 1, 2, 3] }, d: 2, e: undefined } }
    assert.ok(deepEqual(a, b))
  })

  it('deep compare prototype objects', function () {
    const a = { a: 1 }
    a.prototype = { a: {}, d: 2, e: undefined }
    const b = { a: 1 }
    b.prototype = { a: {}, d: 2, e: undefined }
    assert.ok(!deepEqual(a, b))
  })
})
