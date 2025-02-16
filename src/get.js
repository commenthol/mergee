import { _splitPath } from './util.js'

/**
 * get properties from `obj`
 *
 * @example
 * ````js
 * import { get } from 'mergee'
 * const obj = { a: { b: { c: 1 } } };
 * let r = get(obj, ['a', 'b', 'c']);
 * //> r = 1
 * r = get(obj, 'a.b');
 * //> r = { c: 1 }
 * r = get(obj, 'there.is.no.such.property'); // this will not throw!
 * //> r = undefined
 * ````
 *
 * @template T
 * @param {object} obj object to select from
 * @param {string|string[]} keys Array of properties or dot separated string of properties; If using a String avoid using property names containing a `.`
 * @param {T} [def] default value if key was not found
 * @return {object|T} selected or empty object
 */
export function get(obj, keys, def) {
  let i
  let key
  let tmp = obj || {}

  keys = _splitPath(keys)

  if (!keys || keys.length === 0) {
    return def
  }

  for (i = 0; i < keys.length; i++) {
    key = keys[i]
    if (tmp && Object.prototype.hasOwnProperty.call(tmp, key)) {
      tmp = tmp[key]
    } else {
      return def
    }
  }
  return tmp
}
