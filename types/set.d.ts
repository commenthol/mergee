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
export function set(obj: object, keys: string | string[], value: any): object;
