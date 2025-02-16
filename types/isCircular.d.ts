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
export function isCircular(obj: object): boolean;
