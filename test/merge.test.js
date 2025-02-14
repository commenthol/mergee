import assert from 'node:assert'
import { merge, mergeExt } from '../src/index.js'

describe('merge', function () {
  it('merge nothing', function () {
    const r = merge()
    const e = undefined
    assert.deepStrictEqual(r, e)
  })

  it('merge null', function () {
    const r = merge({ a: 1 }, null)
    const e = null
    assert.deepStrictEqual(r, e)
  })

  it('merge undefined', function () {
    const r = merge({ a: 1 }, undefined, { b: 2 })
    const e = { a: 1, b: 2 }
    assert.deepStrictEqual(r, e)
  })

  it('merge objects', function () {
    const r = merge({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 })
    const e = { a: 1, b: 2, c: 3, d: 4 }
    assert.deepStrictEqual(r, e)
  })

  it('deep merge objects', function () {
    const r = merge(
      { a: { b: { c: 1 } } },
      { a: { c: { d: 2 } } },
      { a: { c: { d: 3 } } },
      { a: { c: { e: 4 } } }
    )
    const e = { a: { b: { c: 1 }, c: { d: 3, e: 4 } } }
    // ~ console.log(r)
    assert.deepStrictEqual(r, e)
  })

  it('merging circular objects throws', function () {
    let err
    const o1 = { a: {} }
    o1.a.c = o1.a
    const o2 = { a: { b: {} } }
    o2.a.b.c = o2.a.b
    try {
      merge(o1, o2)
    } catch (e) {
      err = e
    }
    assert.ok(err)
  })

  it('merge object into function', function () {
    const f = function () {
      return this
    }
    f.a = { b: 1 }
    const o = { a: { b: 2 } }
    const r = merge(f, o)
    // ~ console.log(r)
    assert.ok(r === f)
    assert.ok(typeof r === 'function')
    assert.deepStrictEqual(r.a, o.a)
  })

  it('merge function into object', function () {
    const f = function () {
      return this
    }
    f.a = { b: 2 }
    const o = { a: { b: 1 } }
    const r = merge(o, f)
    assert.ok(r !== f)
    assert.ok(typeof r === 'function')
    assert.deepStrictEqual(r.a, f.a)
  })

  it('merge Dates', function () {
    const d5 = new Date(5 * 24 * 3600 * 1000)
    const d7 = new Date(7 * 24 * 3600 * 1000)
    const d9 = new Date(9 * 24 * 3600 * 1000)
    const o1 = { a: d5 }
    const o2 = { b: d7 }
    const o3 = { b: d9 }
    const r = merge({}, o1, o2, o3)
    assert.strictEqual(r.a.toISOString(), d5.toISOString())
    assert.ok(r.a !== d5)
    assert.strictEqual(r.b.toISOString(), d9.toISOString())
    assert.ok(r.b !== d9)
  })

  it('merging numbers', function () {
    const s1 = { a: 1, b: 1 }
    const s2 = { b: 2, c: 2 }
    const s3 = { b: 3, d: 3 }
    const res = merge(s1, s2, s3)

    assert.deepStrictEqual(res, { a: 1, b: 3, c: 2, d: 3 })
  })

  it('merging bitints', function () {
    const s1 = { a: 1n, b: 2n }
    const s2 = { b: 22n, c: 3n }
    const res = merge(s1, s2)

    assert.deepStrictEqual(res, { a: 1n, b: 22n, c: 3n })
  })

  it('merging objects', function () {
    const s1 = { a: { a: 1, b: 1 } }
    const s2 = { a: { c: { a: null } }, b: { b: 2, c: 2 } }
    const s3 = { a: { b: 3, d: 3 } }
    const res = merge(s1, s2, s3)

    assert.deepStrictEqual(res, {
      a: { a: 1, c: { a: null }, b: 3, d: 3 },
      b: { b: 2, c: 2 }
    })
  })

  it('merging array with primitive', function () {
    const s1 = { a: [1, 2, 3] }
    const res = merge({ a: 1 }, s1)
    const exp = { a: [1, 2, 3] }
    assert.deepStrictEqual(res, exp)
  })

  it('merging arrays', function () {
    const s1 = { a: [1, 2, 3] }
    const s2 = { b: [4, 5] }
    const s3 = { b: [6] }
    const res = merge(s1, s2, s3)
    const exp = { a: [1, 2, 3], b: [4, 5, 6] }
    assert.deepStrictEqual(res, exp)
  })

  it('merging arrays of objects', function () {
    const s1 = { a: [{ a: 1 }, { b: 2 }, 3] }
    const s2 = { b: [3, { e: 4 }, { f: 5 }] }
    const s3 = { a: [4, { g: 5 }, 6], b: [{ g: 6 }] }
    const exp = {
      a: [{ a: 1 }, { b: 2 }, 3, 4, { g: 5 }, 6],
      b: [3, { e: 4 }, { f: 5 }, { g: 6 }]
    }
    const res = merge(s1, s2, s3)
    assert.deepStrictEqual(res, exp)
  })

  it('merging arrays of objects of objects', function () {
    const s1 = {
      a: [{ aa: { ab: { ac: 1 } } }, { ba: { bb: 2 } }, 3],
      b: [{ a: 1 }]
    }
    const s2 = {
      a: [{ aa: { ab: { ac: 2 } } }, { ba: { bb: 3 } }, 4],
      b: [{ a: 1 }]
    }
    const s3 = { a: [4, { g: 5 }, 6], b: [{ a: 1 }, { g: 6 }, { a: 2 }] }
    const exp = {
      a: [
        { aa: { ab: { ac: 1 } } },
        { ba: { bb: 2 } },
        3,
        { aa: { ab: { ac: 2 } } },
        { ba: { bb: 3 } },
        4,
        { g: 5 },
        6
      ],
      b: [{ a: 1 }, { g: 6 }, { a: 2 }]
    }
    const res = merge(s1, s2, s3)
    assert.deepStrictEqual(res, exp)
  })

  it('merging objects of objects', function () {
    const s1 = { a: { a: 1, b: 1 } }
    const s2 = { b: { b: 2, c: 2 } }
    const s3 = { a: { b: { e: 3, f: 4 }, d: 3 } }
    const exp = { a: { a: 1, b: { e: 3, f: 4 }, d: 3 }, b: { b: 2, c: 2 } }
    const res = merge(s1, s2, s3)
    assert.deepStrictEqual(res, exp)
  })

  it('merging objects with null objects', function () {
    const s1 = { a: { a: 1, b: 1 } }
    const s2 = { b: { b: 2, c: 2 } }
    const s3 = { a: null }
    const exp = { a: null, b: { b: 2, c: 2 } }
    const res = merge(s1, s2, s3)
    assert.deepStrictEqual(res, exp)
  })

  it('merging RegExp to object returns RegExp', function () {
    const re = /aaa/
    const res = merge({}, re)
    assert.deepEqual(res, re)
  })

  it('merging two RegExp`s', function () {
    const re = /aaa/gim
    const res = merge(/bbb/, re)
    assert.deepEqual(res, re)
  })

  it('merging Date to object returns Date', function () {
    const date = new Date('2025-01-01T12:00:00Z')
    const res = merge({}, date)
    assert.deepEqual(res, date)
  })

  it('merging two Dates', function () {
    const date = new Date('2025-01-01T12:00:00Z')
    const res = merge(new Date('2024-01-01T12:00:00Z'), date)
    assert.deepEqual(res, date)
  })

  it('merging Buffer to object returns Buffer', function () {
    const buffer = Buffer.from('2025-01-01T12:00:00Z')
    const res = merge({}, buffer)
    assert.deepEqual(res, buffer)
  })

  it('merging ArrayBuffer', function () {
    const buffer = new ArrayBuffer([1, 2, 3, 4])
    const res = merge({}, buffer)
    assert.deepEqual(res, buffer)
    assert.ok(res !== buffer) // result was cloned
  })

  it('merging Int8Array', function () {
    const array = new Int8Array([1, 2, 3, 4])
    const res = merge({}, array)
    assert.deepEqual(res, array)
    assert.ok(res !== array) // result was cloned
  })

  it('merging Map with object', function () {
    const source = new Map([['a', 1]])
    const res = merge({}, source)
    assert.deepEqual(res, source)
  })

  it('merging Map', function () {
    const s1 = new Map([
      ['a', 1],
      ['b', 2]
    ])
    const s2 = new Map([
      ['b', 22],
      ['c', 3]
    ])
    const exp = new Map([
      ['a', 1],
      ['b', 22],
      ['c', 3]
    ])
    const res = merge(s1, s2)
    assert.deepStrictEqual(res, exp)
  })

  it('merging Set with object', function () {
    const source = new Set(['a', 1])
    const res = merge({}, source)
    assert.deepEqual(res, source)
  })

  it('merging Set', function () {
    const s1 = new Set(['a', 1, 'b', 2])
    const s2 = new Set(['b', 22, 'c', 3])
    const exp = new Set(['a', 1, 'b', 22, 2, 'c', 3])
    const res = merge(s1, s2)
    assert.deepStrictEqual(res, exp)
  })

  it('merging error', function () {
    const s1 = {}
    const s2 = new Error('bar')
    const res = merge(s1, s2)
    assert.deepStrictEqual(res, s2)
  })

  it('merging sample', function () {
    const target = { t: 1, x: { y: 'z' } }
    const source1 = { t: { s1: /source1/ }, x: null }
    const source2 = { t: { s2: new Date(100) } }

    const res = merge(target, source1, source2)
    const exp = { t: { s1: /source1/, s2: new Date(100) }, x: null }
    assert.deepStrictEqual(res, exp)
  })

  it('should be save against prototype pollution', function () {
    assert.equal(JSON.stringify({}.__proto__), '{}')
    const a = {}
    merge({}, JSON.parse('{"__proto__":{"oops":"It works !"}}'))
    assert.strictEqual(a.oops, undefined)
    assert.equal(JSON.stringify({}.__proto__), '{}')
  })

  it('should be save against prototype pollution using constructor', function () {
    assert.equal(JSON.stringify({}.__proto__), '{}')
    const someObj = {}
    try {
      merge(
        true,
        someObj,
        JSON.parse('{"constructor":{"prototype":{"pollutedKey":123}}}')
      )
    } catch (_err) {
      // noop
    }
    assert.equal(JSON.stringify({}.__proto__), '{}')
  })
})

describe('mergeExt', function () {
  const opts = {
    ignoreNull: true, // treat source === null as undefined - target does not get deleted
    ignoreCircular: true // ignore cirular structures - no error gets thrown
  }

  it('merge null', function () {
    const res = mergeExt(opts, { a: 1 }, null)
    const exp = { a: 1 }
    assert.deepStrictEqual(res, exp)
  })

  it('ignore merging objects with null objects', function () {
    const s1 = { a: { a: 1, b: 1 } }
    const s2 = { b: { b: 2, c: 2 } }
    const s3 = { a: null }
    const exp = { a: { a: 1, b: 1 }, b: { b: 2, c: 2 } }
    const res = mergeExt(opts, s1, s2, s3)
    assert.deepStrictEqual(res, exp)
  })

  it('merging null objects with undefined target', function () {
    const s1 = { b: { c: { d: 1 } } }
    const s2 = { b: { e: { f: null } } }
    const exp = { b: { c: { d: 1 }, e: { f: null } } }
    const res = mergeExt({ ignoreNull: true }, s1, s2)
    assert.deepStrictEqual(res, exp)
  })

  it('dont merge circular objects', function () {
    const o1 = { a: {} }
    o1.a.c = o1.a
    const o2 = { a: { b: {} } }
    o2.a.b.c = o2.a.b
    const r = mergeExt(opts, o1, o2)
    assert.ok(r === o1)
  })

  it('merging sample', function () {
    const target = { t: 1, x: { y: 'z' } }
    const source1 = { t: { s1: /source1/ }, x: null }
    const source2 = { t: { s2: new Date(100) } }

    const res = mergeExt({ ignoreNull: true }, target, source1, source2)
    const exp = { t: { s1: /source1/, s2: new Date(100) }, x: { y: 'z' } }
    // ~ console.log(res)
    assert.deepStrictEqual(res, exp)
  })
})
