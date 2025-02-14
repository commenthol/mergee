import * as util from './util.js'
import { deepEqual } from './deepEqual.js'

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
export function merge(target, ...source) {
  return mergeExt({}, target, ...source)
}

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
export function mergeExt(options, target, ...source) {
  const opts = { ...options, _visited: [], _count: 0 }
  return source.reduce((acc, curr) => _merge(opts, acc, curr), target)
}

/**
 * recursive merge helper
 *
 * @private
 * @param {Object} opts
 * @param {any} target
 * @param {any} source
 * @return {any} source merged into target
 */
export function _merge(opts, target, source) {
  let i
  let j
  let tmp
  let equal
  let key

  if (!opts._visited) {
    opts._visited = []
  }

  if (
    target === source || // for primitives or null
    undefined === source // target stays the same
  ) {
    return target
  }

  if (source === null) {
    if (!opts.ignoreNull || target === undefined) {
      target = source
    }
    return target
  }

  if (target === null || target === undefined) {
    return _merge(opts, util.isArray(source) ? [] : {}, source)
  }

  const sourceType = util.objectToString(source)

  switch (sourceType) {
    case 'RegExp': {
      return new RegExp(source, source.flags)
    }
    case 'Date':
      return new Date(source)
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'BigInt64Array':
    case 'BigUint64Array': {
      // @ts-expect-error
      return globalThis[sourceType].from(source)
    }
    case 'ArrayBuffer':
    case 'SharedArrayBuffer': {
      return new globalThis[sourceType](source)
    }
    case 'Map': {
      if (util.isMap(target)) {
        for (key of source.keys()) {
          target = new Map(target)
          target.set(key, merge(target.get(key), source.get(key)))
        }
      } else {
        target = new Map(source)
      }
      return target
    }
    case 'Set': {
      if (util.isSet(target)) {
        target = new Set(target).union(source)
      } else {
        target = new Set(source)
      }
      return target
    }
    case 'Error':
      const err = new Error(source.message)
      Object.defineProperties(err, Object.getOwnPropertyDescriptors(source))
      return err
    case 'Function': {
      const fn = function (...args) {
        return source(...args)
      }
      Object.defineProperties(fn, Object.getOwnPropertyDescriptors(source))
      return fn
    }
    case 'Array': {
      if (util.isArray(target)) {
        const test = [...target] // test for duplicates
        for (i = 0; i < source.length; i++) {
          tmp = source[i]
          if (!~test.indexOf(tmp)) {
            if (!util.isObject(tmp) || tmp === null) {
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
      } else {
        // if target is not array replace with source
        target = _merge(opts, [], source)
      }
      return target
    }
    case 'Object': {
      if (!(util.isObject(target) || util.isFunction(target))) {
        return source
      }
      // copy properties if not circular
      if (!~opts._visited.indexOf(source)) {
        opts._visited.push(source)
        for (key in source) {
          if (propertyIsUnsafe(target, key)) {
            continue
          }
          target[key] = _merge(opts, target[key], source[key])
        }
        opts._visited.pop()
      } else if (!opts.ignoreCircular) {
        throw new Error('can not merge circular structures.')
      }
      return target
    }
    default:
      // copy primitives
      return source
  }
}

const propertyIsUnsafe = (target, key) =>
  key in target &&
  (!Object.hasOwnProperty.call(target, key) || // unsafe if they exist up the prototype chain,
    !Object.propertyIsEnumerable.call(target, key))
