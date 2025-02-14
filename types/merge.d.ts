/**
 * merge multiple objects into `target`
 *
 * @example
 * ````js
 * import { merge } from 'mergee'
 * const target  = { t: 1, x: { y: 'z' } }
 * const source1 = { t: { s1: /source1/ } }
 * const source2 = { t: { s2: new Date(100), x: null } }
 * merge(target, source1, source2)
 * //> target === { t: { s1: /source1/, s2: Wed Dec 31 1969 17:00:00 GMT-0700 (MST) }, x: null }
 * ````
 *
 * @param {object|function|array} target - target object
 * @param {any[]} source - arguments 2 ... n
 * @return {object} merged target
 */
export function merge(target: object | Function | any[], ...source: any[]): object;
/**
 * extended merge
 *
 * @example
 * ````js
 * import { mergeExt } from 'mergee'
 * const target  = { t: 1, x: { y: 'z' } }
 * const source1 = { t: { s1: /source1/ } }
 * const source2 = { t: { s2: new Date(100), x: null } }
 * mergeExt({ ignoreNull: true }, target, source1, source2)
 * //> target === { t: { s1: /source1/, s2: Wed Dec 31 1969 17:00:00 GMT-0700 (MST) }, x: { y: 'z' } }
 * ````
 *
 * @param {object} options options
 * @param {boolean} [options.ignoreNull] treat `source === null` as undefined - target does not get deleted
 * @param {boolean} [options.ignoreCircular] ignore circular structures - no error gets thrown
 * @param {object|function|array} target target object
 * @param {any[]} source arguments 3 ... n
 * @return {object} merged target
 */
export function mergeExt(options: {
    ignoreNull?: boolean | undefined;
    ignoreCircular?: boolean | undefined;
}, target: object | Function | any[], ...source: any[]): object;
/**
 * recursive merge helper
 *
 * @private
 * @param {Object} opts
 * @param {any} target
 * @param {any} source
 * @return {any} source merged into target
 */
export function _merge(opts: any, target: any, source: any): any;
