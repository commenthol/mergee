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
export function clone(source: object | any[]): object | any[];
