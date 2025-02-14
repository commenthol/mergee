/**
 * pick properties from `obj` into a new object
 *
 * @example
 * ````js
 * import { pick } from 'mergee'
 * const obj = { a: 1, b: [ 1, 2 ], c: { cc:3, 'c-d':4 }, '0d': { '0d0': 5 } }
 * let r = pick(obj, ['a', 'b[1]', 'c["c-d"]', '0d.0d0'])
 * //> r = { a: 1, b: { '1': 2 }, c: { 'c-d': 4 }, '0d': { '0d0': 5 } }
 * r = pick(obj, 'a, b[1], c["c-d"], 0d.0d0')
 * //> r = { a: 1, b: { '1': 2 }, c: { 'c-d': 4 }, '0d': { '0d0': 5 } }
 * ````
 *
 * @param {object} obj object to pick properties from
 * @param {string|string[]} props Array of properties or comma separated string of properties
 * @return {object} object with picked properties
 */
export function pick(obj: object, props: string | string[]): object;
