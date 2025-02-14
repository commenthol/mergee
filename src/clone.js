import { _merge } from './merge.js'
import { isArray } from './util.js'

/**
 * perform a deep clone of `source`
 *
 * @example
 * ````js
 * import { clone } from 'mergee'
 * const obj = { a: { b: { c: 1 } } }
 * const cloned = clone(obj)
 * //> (cloned !== obj)
 * //> (cloned.a !== obj.a)
 * //> (cloned.a.b !== obj.a.b)
 * ````
 * @param {object|any[]} source object to get cloned
 * @return {object|any[]} deep cloned object
 */
export const clone = (source) => _merge({}, isArray(source) ? [] : {}, source)
