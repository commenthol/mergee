import assert from 'node:assert'
import { _splitProps, _splitPath, isObject } from '../src/util.js'

describe('utils', function () {
  describe('_splitProps', function () {
    it('string ', function () {
      const res = _splitProps('a, "b,0", c["d.a,e.a,f.a"]')
      const exp = { a: 1, 'b,0': 1, 'c["d.a,e.a,f.a"]': 1 }
      assert.deepStrictEqual(res, exp)
    })

    it('no props', function () {
      assert.deepEqual(_splitProps(), {})
    })
  })

  describe('_splitPath', function () {
    it('simple string ', function () {
      const res = _splitPath('a."b".c["d"]')
      const exp = ['a', 'b', 'c', 'd']
      assert.deepStrictEqual(res, exp)
    })
    it('complex string ', function () {
      const res = _splitPath('a."b.0".c["d.e.f"]')
      const exp = ['a', 'b.0', 'c', 'd.e.f']
      assert.deepStrictEqual(res, exp)
    })
  })

  describe('is...', function () {
    it('isObject({})', function () {
      assert.ok(isObject({}))
    })

    it('isObject(null)', function () {
      assert.ok(!isObject(null))
    })
  })
})
