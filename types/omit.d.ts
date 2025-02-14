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
export function omit(obj: object, props: string | string[]): object;
