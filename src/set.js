import { _splitPath } from './util.js'

/**
 * set a property in `obj`
 *
 * @example
 * ````js
 * import { set } from 'mergee'
 * const obj = {};
 * let r = set(obj, ['a', 'b'], { c:1 });
 * //> r = { a: { b: { c: 1 } } }
 * r = set(obj, 'a.b.d', 2);
 * //> r = { a: { b: { c:1, d:2 } } }
 * ````
 * @param {object} obj object to select from
 * @param {string|string[]} keys - Array of properties or dot separated string of properties; If using a String avoid using property names containing a `.`
 * @param {any} value The value to set
 * @return {object} set object
 */
export function set(obj, keys, value) {
  let i
  let key
  let tmp = obj || {}

  const _keys = _splitPath(keys)

  if (!_keys || _keys.length === 0) {
    return
  }

  const last = _keys.pop()

  for (i = 0; i < _keys.length; i++) {
    key = _keys[i]
    if (!tmp[key]) {
      tmp[key] = {}
    }
    if (Object.prototype.hasOwnProperty.call(tmp, key)) {
      tmp = tmp[key]
    }
  }
  if (value === null) {
    delete tmp[last]
  } else {
    tmp[last] = value
  }
  return obj
}
