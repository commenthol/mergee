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
export const isArray = (arg) => Array.isArray(arg)

/**
 * @param {unknown} arg
 * @returns {arg is boolean}
 */
export const isBoolean = (arg) => typeof arg === 'boolean'

/**
 * @param {unknown} arg
 * @returns {arg is null}
 */
export const isNull = (arg) => arg === null

/**
 * @param {unknown} arg
 * @returns {arg is null|undefined}
 */
export const isNullOrUndefined = (arg) => isNull(arg) || isUndefined(arg)

/**
 * @param {unknown} arg
 * @returns {arg is number}
 */
export const isNumber = (arg) => typeof arg === 'number'

/**
 * @param {unknown} arg
 * @returns {arg is string}
 */
export const isString = (arg) => typeof arg === 'string'

/**
 * @param {unknown} arg
 * @returns {arg is Symbol}
 */
export const isSymbol = (arg) => typeof arg === 'symbol'

/**
 * @param {unknown} arg
 * @returns {arg is undefined}
 */
export const isUndefined = (arg) => arg === undefined

/**
 * @param {unknown} arg
 * @returns {arg is RegExp}
 */
export const isRegExp = (arg) =>
  isObject(arg) && objectToString(arg) === '[object RegExp]'

/**
 * @param {unknown} arg
 * @returns {arg is NonNullable<object>}
 */
export const isObject = (arg) => typeof arg === 'object' && arg !== null

/**
 * @param {unknown} arg
 * @returns {arg is Date}
 */
export const isDate = (arg) =>
  isObject(arg) && objectToString(arg) === '[object Date]'

/**
 * @param {unknown} arg
 * @returns {arg is function}
 */
export const isFunction = (arg) => typeof arg === 'function'

/**
 * @param {unknown} arg
 * @returns {arg is Buffer}
 */
export const isBuffer = (arg) => arg instanceof Buffer

/**
 * @param {unknown} arg
 * @returns {arg is Map}
 */
export const isMap = (arg) => arg instanceof Map

/**
 * @param {unknown} arg
 * @returns {arg is Set}
 */
export const isSet = (arg) => arg instanceof Set

/**
 * @param {unknown} arg
 * @returns {arg is BigInt}
 */
export const isBigInt = (arg) => typeof arg === 'bigint'

/**
 * @param {any} arg
 * @returns {string}
 */
export const objectToString = (arg) =>
  Object.prototype.toString.call(arg).slice(8, -1)

const OPEN = /\[["']|^\s*["']/
const CLOSE = /["']\]|["']\s*$/
const QUOTES = /^(["'])(.*)\1$/

/**
 * segment path or properties string
 * @private
 * @param {string} char separator char
 * @return {(string) => string}
 */
export function _segment(char) {
  let tmp
  char = char || '.'
  return function (k) {
    if (tmp) {
      tmp += char + k
      if (CLOSE.test(k)) {
        k = tmp
        tmp = ''
      } else {
        return
      }
    } else if (OPEN.test(k)) {
      tmp = k
      if (CLOSE.test(k)) {
        tmp = ''
      } else {
        return
      }
    }
    return k.trim().replace(QUOTES, '$2')
  }
}

/**
 * split dot separated String or Array into a property path
 * @private
 * @param {string|string[]} keys
 * @return {object} obj for comparison
 */
export function _splitPath(keys) {
  let out

  if (isString(keys)) {
    out = []
    keys
      .split('.')
      .map(_segment('.'))
      .forEach(function (k) {
        k = (k || ' ')
          .trim()
          .replace(/^([^[]+)\[(["']?)(.+)\2\]$/, function (m, m1, m2, m3) {
            if (m1 && m3) {
              out.push(m1, m3)
            }
            return ''
          })
        if (k) {
          out.push(k)
        }
      })
    keys = out
  }
  return keys
}

/**
 * split comma separated String or Array into a test hash
 * @private
 * @param {string|string[]} props
 * @return {object} obj for comparison
 */
export function _splitProps(props) {
  const test = {}

  if (isString(props)) {
    props = props
      .split(',')
      .map(_segment(','))
      .filter((k) => k)
  }
  if (isArray(props)) {
    props.forEach((key) => (test[key] = 1))
    return test
  }
  return {}
}
