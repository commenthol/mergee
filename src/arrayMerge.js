import { isObject } from './util.js'
import { _merge } from './merge.js'
import { deepEqual } from './deepEqual.js'

/** @typedef {import('./merge.js').MergeIntOptions} MergeIntOptions */
/**
 * @param {any} target
 * @param {any} source
 * @param {MergeIntOptions} opts
 * @returns {any}
 */
export const arrayMergeDeep = (target, source, opts) => {
  let tmp, equal, i, j
  const test = [...target] // test for duplicates
  for (i = 0; i < source.length; i++) {
    tmp = source[i]
    if (!~test.indexOf(tmp)) {
      if (!isObject(tmp) || tmp === null) {
        // primitive or function or null or undefined
        target.push(tmp)
      } else {
        equal = false
        j = test.length
        while (j-- > 0 && !(equal = deepEqual(test[j], tmp)));
        if (!equal) target.push(_merge(opts, null, tmp))
      }
    }
  }
  return target
}
