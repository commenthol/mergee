import { get } from './get.js'
import { set } from './set.js'
import { clone } from './clone.js'
import { _splitProps, isObject } from './util.js'

/**
 * omit properties from `obj` into a new object
 *
 * @example
 * ````js
 * import { omit } from 'mergee'
 * const obj = { a: 1, b: [ 1, 2 ], c: { cc:3, 'c-d':4 }, '0d': { '0d0': 5 } }
 * let r = omit(obj, ['a', 'b[1]', 'c["c-d"]', '0d.0d0'])
 * //> r = { b: [ 1,  ], c: { cc: 3 }, '0d': {} }
 * r = omit(obj, 'a, b[1], c["c-d"], 0d.0d0')
 * //> r = { b: [ 1,  ], c: { cc: 3 }, '0d': {} }
 * ````
 *
 * @param {object} obj object
 * @param {string|string[]} props Array of properties or comma separated string of properties
 * @return {object} object with omitted properties
 */
export function omit(obj, props) {
  let key
  let out
  const test = _splitProps(props)

  if (isObject(obj)) {
    out = clone(obj)
    for (key in test) {
      if (get(obj, key)) {
        set(out, key, null)
      }
    }
  }
  return out
}
