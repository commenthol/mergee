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
 * @param {MergeExtOptions} options options
 * @param {object|function|array} target target object
 * @param {any[]} source arguments 3 ... n
 * @return {object} merged target
 */
export function mergeExt(options: MergeExtOptions, target: object | Function | any[], ...source: any[]): object;
/**
 * @typedef {object} MergeExtOptions
 * @property {boolean} [ignoreNull] treat `source === null` as undefined - target does not get deleted
 * @property {boolean} [ignoreCircular] ignore circular structures - no error gets thrown
 * @property {function} [arrayMerge] array merge function
 */
/**
 * @typedef {object} MergeIntOptionsI
 * @property {any[]} _visited visited references
 */
/**
 * @typedef {MergeExtOptions & MergeIntOptionsI} MergeIntOptions
 */
/**
 * recursive merge helper
 *
 * @private
 * @param {MergeIntOptions} opts
 * @param {any} target
 * @param {any} source
 * @return {any} source merged into target
 */
export function _merge(opts: MergeIntOptions, target: any, source: any): any;
export function merge(target: object | Function | any[], ...source: any[]): object;
export type MergeExtOptions = {
    /**
     * treat `source === null` as undefined - target does not get deleted
     */
    ignoreNull?: boolean | undefined;
    /**
     * ignore circular structures - no error gets thrown
     */
    ignoreCircular?: boolean | undefined;
    /**
     * array merge function
     */
    arrayMerge?: Function | undefined;
};
export type MergeIntOptionsI = {
    /**
     * visited references
     */
    _visited: any[];
};
export type MergeIntOptions = MergeExtOptions & MergeIntOptionsI;
