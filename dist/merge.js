/**
 * @module util.js
 * @see https://github.com/joyent/node/blob/v0.12.0-release/lib/util.js
 */

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @template T
 * @param {unknown} arg
 * @returns {arg is Array<T>}
 */
const isArray = (arg) => Array.isArray(arg);

/**
 * @param {unknown} arg
 * @returns {arg is null}
 */
const isNull = (arg) => arg === null;

/**
 * @param {unknown} arg
 * @returns {arg is null|undefined}
 */
const isNullOrUndefined = (arg) => isNull(arg) || isUndefined(arg);

/**
 * @param {unknown} arg
 * @returns {arg is undefined}
 */
const isUndefined = (arg) => arg === undefined;

/**
 * @param {unknown} arg
 * @returns {arg is RegExp}
 */
const isRegExp = (arg) =>
  isObject(arg) && objectToString(arg) === '[object RegExp]';

/**
 * @param {unknown} arg
 * @returns {arg is NonNullable<object>}
 */
const isObject = (arg) => typeof arg === 'object' && arg !== null;

/**
 * @param {unknown} arg
 * @returns {arg is Date}
 */
const isDate = (arg) =>
  isObject(arg) && objectToString(arg) === '[object Date]';

/**
 * @param {unknown} arg
 * @returns {arg is function}
 */
const isFunction = (arg) => typeof arg === 'function';

/**
 * @param {unknown} arg
 * @returns {arg is Buffer}
 */
const isBuffer = (arg) => arg instanceof Buffer;

/**
 * @param {unknown} arg
 * @returns {arg is Map}
 */
const isMap = (arg) => arg instanceof Map;

/**
 * @param {unknown} arg
 * @returns {arg is Set}
 */
const isSet = (arg) => arg instanceof Set;

/**
 * @param {any} arg
 * @returns {string}
 */
const objectToString = (arg) =>
  Object.prototype.toString.call(arg).slice(8, -1);

/**
 * @module deepEqual.js
 * @see https://github.com/joyent/node/blob/v0.12.0-release/lib/assert.js
 */


/**
 * deep comparison of `actual` and `expected`
 * @param {any} actual
 * @param {any} expected
 * @return {boolean} true if `actual` equals `expected`
 */
function deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true
  } else if (isBuffer(actual) && isBuffer(expected)) {
    if (actual.length != expected.length) return false

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false
    }

    return true

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
  } else if (isDate(actual) && isDate(expected)) {
    return actual.getTime() === expected.getTime()

    // 7.3 If the expected value is a RegExp object, the actual value is
    // equivalent if it is also a RegExp object with the same source and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (isRegExp(actual) && isRegExp(expected)) {
    return (
      actual.source === expected.source &&
      actual.global === expected.global &&
      actual.multiline === expected.multiline &&
      actual.lastIndex === expected.lastIndex &&
      actual.ignoreCase === expected.ignoreCase
    )

    // 7.4. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
  } else if (!isObject(actual) && !isObject(expected)) {
    return actual == expected

    // 7.5 For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
  } else {
    return _objEquiv(actual, expected)
  }
}

/**
 * @param {any} object
 * @returns {boolean}
 */
function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]'
}

/**
 * @see https://github.com/joyent/node/blob/v0.12.0-release/lib/assert.js
 */
function _objEquiv(a, b) {
  var ka, kb, key, i;

  if (isNullOrUndefined(a) || isNullOrUndefined(b)) {
    return false
  }

  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false
  // ~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  var aIsArgs = isArguments(a),
    bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs)) {
    return false
  }
  if (aIsArgs) {
    a = Array.prototype.slice.call(a);
    b = Array.prototype.slice.call(b);
    return deepEqual(a, b)
  }
  try {
    ka = Object.keys(a);
    kb = Object.keys(b);
  } catch (_err) {
    // happens when one is a string literal and the other isn't
    return false
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length) {
    return false
  }
  // the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  // ~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) {
      return false
    }
  }
  // equivalent values for every corresponding key, and
  // ~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key])) return false
  }
  return true
}

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
function merge(target, ...source) {
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
function mergeExt(options, target, ...source) {
  const opts = { ...options, _visited: []};
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
function _merge(opts, target, source) {
  let i;
  let j;
  let tmp;
  let equal;
  let key;

  if (!opts._visited) {
    opts._visited = [];
  }

  if (
    target === source || // for primitives or null
    undefined === source // target stays the same
  ) {
    return target
  }

  if (source === null) {
    if (!opts.ignoreNull || target === undefined) {
      target = source;
    }
    return target
  }

  if (target === null || target === undefined) {
    return _merge(opts, isArray(source) ? [] : {}, source)
  }

  const sourceType = objectToString(source);

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
      if (isMap(target)) {
        for (key of source.keys()) {
          target = new Map(target);
          target.set(key, merge(target.get(key), source.get(key)));
        }
      } else {
        target = new Map(source);
      }
      return target
    }
    case 'Set': {
      if (isSet(target)) {
        target = new Set(target).union(source);
      } else {
        target = new Set(source);
      }
      return target
    }
    case 'Error':
      const err = new Error(source.message);
      Object.defineProperties(err, Object.getOwnPropertyDescriptors(source));
      return err
    case 'Function': {
      const fn = function (...args) {
        return source(...args)
      };
      Object.defineProperties(fn, Object.getOwnPropertyDescriptors(source));
      return fn
    }
    case 'Array': {
      if (isArray(target)) {
        const test = [...target]; // test for duplicates
        for (i = 0; i < source.length; i++) {
          tmp = source[i];
          if (!~test.indexOf(tmp)) {
            if (!isObject(tmp) || tmp === null) {
              // primitive or function or null or undefined
              target.push(tmp);
            } else {
              equal = false;
              j = test.length;
              while (j-- > 0 && !(equal = deepEqual(test[j], tmp)));
              if (!equal) target.push(_merge(opts, null, tmp));
            }
          }
        }
      } else {
        // if target is not array replace with source
        target = _merge(opts, [], source);
      }
      return target
    }
    case 'Object': {
      if (!(isObject(target) || isFunction(target))) {
        return source
      }
      // copy properties if not circular
      if (!~opts._visited.indexOf(source)) {
        opts._visited.push(source);
        for (key in source) {
          if (propertyIsUnsafe(target, key)) {
            continue
          }
          target[key] = _merge(opts, target[key], source[key]);
        }
        opts._visited.pop();
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
    !Object.propertyIsEnumerable.call(target, key));

export { _merge, merge, mergeExt };
