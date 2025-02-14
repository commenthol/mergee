import assert from 'node:assert'
import { get } from '../src/index.js'

describe('get', function () {
  it('from a null object', function () {
    const obj = null
    const res = get(obj, ['test', 'test'])
    assert.deepStrictEqual(res, undefined)
  })

  it('with empty selectors', function () {
    const obj = {
      test: { a: 1 }
    }
    const res = get(obj)
    assert.deepStrictEqual(res, undefined)
  })

  it('select an existing object', function () {
    const obj = {
      test: {
        test: {
          test: { a: 1 }
        },
        test2: { b: 2 }
      }
    }
    const res = get(obj, 'test.test')
    assert.deepStrictEqual(res, { test: { a: 1 } })
  })

  it('select a 0 value from an existing object', function () {
    const obj = {
      test: {
        test: 0,
        test2: { b: 2 }
      }
    }
    const res = get(obj, ['test', 'test'])

    assert.deepStrictEqual(res, 0)
  })

  it('try select from undefined property', function () {
    const obj = {
      test: {
        test: 0,
        test2: { b: 2 }
      }
    }
    const res = get(obj, 'there.is.no.such.prop')

    assert.deepStrictEqual(res, undefined)
  })
})
