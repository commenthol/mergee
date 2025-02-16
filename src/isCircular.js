import { isObject } from './util.js'

/**
 * check if an object `obj` contains circular structures
 *
 * @example
 * ````js
 * import { isCircular } from 'mergee'
 * const obj = { a: {} };
 * obj.a.c = { c: 1 };
 * //> isCircular(obj) === true
 * ````
 * @param {object} obj - Object to check
 * @return {boolean} true if `obj` is circular
 */
export const isCircular = (obj) => _checkCircular({ _visited: [] }, obj)

/**
 * recursive helper function
 * @api private
 */
function _checkCircular(opts, obj) {
  let key
  if (isObject(obj)) {
    if (~opts._visited.indexOf(obj)) {
      return true
    }
    opts._visited.push(obj)
    for (key in obj) {
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        _checkCircular(opts, obj[key])
      ) {
        return true
      }
    }
  }
  return false
}
