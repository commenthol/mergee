/**
 * @copyright 2015 commenthol
 * @license MIT
 */

'use strict'

// module variables
var util = require('./lib/util')
exports.util = util

var deepEqual = require('./lib/deepequal')

var OPEN = /\[["']|^\s*["']/
var CLOSE = /["']\]|["']\s*$/
var QUOTES = /^(["'])(.*)\1$/

/**
 * deep comparison of `actual` and `expected`
 *
 * @see https://github.com/joyent/node/blob/v0.12.0-release/lib/assert.js
 *
 * @function deepEqual
 * @param {Any} actual
 * @param {Any} expected
 * @return {Boolean} true if `actual` equals `expected`
 */
exports.deepEqual = deepEqual

/**
 * check if an object `obj` contains circular structures
 *
 * #### Example
 *
 * ````js
 * var isCircular  = require('mergee').isCircular,
 *     obj = { a: {} };
 * obj.a.c = { c: 1 };
 * // isCircular(obj) === true
 * ````
 *
 * @param {Object} obj - Object to check
 * @return {Boolean} true if `obj` contains circularities
 */
function isCircular (obj) {
  return _checkCircular({ _visited: [] }, obj)
}
exports.isCircular = isCircular

/**
 * recursive helper function
 * @api private
 */
function _checkCircular (opts, obj) {
  var key
  if (util.isObject(obj)) {
    if (~opts._visited.indexOf(obj)) {
      return true
    }
    opts._visited.push(obj)
    for (key in obj) {
      if (obj.hasOwnProperty(key) && _checkCircular(opts, obj[key])) {
        return true
      }
    }
  }
  return false
}

/**
 * extend object `target` with multiple `source` objects
 *
 * #### Example
 *
 * ````js
 * var extend  = require('mergee').extend,
 *     target  = { a:{A:1}, b:{A:1} },
 *     source1 = { b:{B:2}, c:{B:2} },
 *     source2 = { d:{C:3} };
 * extend(target, source1, source2);
 * // target === { a:{A:1}, b:{B:2}, c:{B:2}, d:{C:3} };
 * ````
 *
 * @param {Object|Array|Function} target
 * @param {Any} source - arguments 2 ... n
 * @return {Object} extended target
 */
function extend (target) {
  var i, source, key

  for (i = 1; i < arguments.length; i++) {
    source = arguments[i]
    if (typeof source === 'object' && source) {
      for (key in source) {
        if (source.hasOwnProperty(key)) {
          target[key] = source[key]
        }
      }
    }
  }
  return target
}
exports.extend = extend
exports.assign = extend

/**
 * merge multiple objects into `target`
 *
 * #### Example
 *
 * ````js
 * var merge = require('mergee').merge,
 *     target  = { t: 1, x: { y: 'z' } },
 *     source1 = { t: { s1: /source1/ } },
 *     source2 = { t: { s2: new Date(100), x: null } };
 * merge(target, source1, source2);
 * // target === { t: { s1: /source1/, s2: Wed Dec 31 1969 17:00:00 GMT-0700 (MST) }, x: null }
 * ````
 *
 * @param {Object|Function|Array} target - target object
 * @param {Any} source - arguments 2 ... n
 * @return {Object} merged target
 */
function merge () {
  var args = [].slice.call(arguments)
  args.unshift({})
  return mergeExt.apply(null, args)
}
exports.merge = merge

/**
 * extended merge
 *
 * #### Example
 *
 * ````js
 * var merge = require('mergee').merge,
 *     target  = { t: 1, x: { y: 'z' } },
 *     source1 = { t: { s1: /source1/ } },
 *     source2 = { t: { s2: new Date(100), x: null } };
 * mergeExt({ ignoreNull: true }, target, source1, source2);
 * // target === { t: { s1: /source1/, s2: Wed Dec 31 1969 17:00:00 GMT-0700 (MST) }, x: { y: 'z' } }
 * ````
 *
 * @param {Object} opts - options
 * @param {Boolean} opts.ignoreNull - treat `source === null` as undefined - target does not get deleted
 * @param {Boolean} opts.ignoreCircular - ignore cirular structures - no error gets thrown
 * @param {Object|Function|Array} target - target object
 * @param {Any} source - arguments 3 ... n
 * @return {Object} merged target
 */
function mergeExt (opts, target) {
  var visited = []

  opts = opts || {}
  opts._visited = visited
  opts._count = 0

  for (var i = 2; i < arguments.length; i++) {
    target = _merge(opts, target, arguments[i])
  }

  return target
}
exports.mergeExt = mergeExt

/**
 * recursive merge helper
 *
 * @api private
 * @param {Object} opts
 * @param {Any} target
 * @param {Any} source
 * @return {Any} source merged into target
 */
function _merge (opts, target, source) {
  var i
  var j
  var tmp
  var test
  var equal
  var key
  var s = { // hold booleans for source
    isObj: util.isObject(source),
    isFn: util.isFunction(source),
    isArr: util.isArray(source)
  }
  var t = { // hold booleans for target
    isObj: util.isObject(target),
    isFn: util.isFunction(target),
    isArr: util.isArray(target)
  }

  if (!opts._visited) {
    opts._visited = []
  }

  if (target === source || // for primitives or null
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

  if (target === null || undefined === target) {
    if (s.isObj && s.isArr) {
      // clone into array
      target = _merge(opts, [], source)
    } else if (s.isObj) {
      // clone source
      target = _merge(opts, {}, source)
    } else {
      // copy primitives
      target = source
    }
    return target
  }

  // create new instances for "special" objects
  if (s.isObj) {
    if (util.isRegExp(source)) {
      // create new RegExp
      target = new RegExp(source)
      return target
    } else if (util.isDate(source)) {
      // create new Date
      target = new Date(source)
      return target
    } else if (util.isBuffer(source)) {
      // create new Buffer
      target = Buffer.from(source)
      return target
    }
  }

  if (s.isFn) { // replace with source function
    target = source
    // TODO - clone possible keys
    return target
  }

  if (s.isArr) {
    if (t.isArr) {
      test = [].concat(target) // test for duplicates
      for (i = 0; i < source.length; i++) {
        tmp = source[i]
        if (!~test.indexOf(tmp)) {
          if (!util.isObject(tmp) || tmp === null) { // primitive or function or null or undefined
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

  if (!t.isFn && !t.isObj && !t.isArr) {
    // copy primitives
    target = source
    return target
  }

  // copy properties if not circular
  if (!~opts._visited.indexOf(source)) {
    opts._visited.push(source)
    for (key in source) {
      if (source.hasOwnProperty(key) && key !== '__proto__') {
        target[key] = _merge(opts, target[key], source[key])
      }
    }
    opts._visited.pop()
  } else if (!opts.ignoreCircular) {
    throw new Error('can not merge circular structures.')
  }

  return target
}
exports._merge = _merge

/**
 * perform a deep clone of `obj`
 *
 * #### Example
 *
 * ```js
 * var clone = require('mergee').clone,
 *     obj = { a: { b: { c: 1 } } };
 * var cloned = clone(obj);
 * // (cloned !== obj)
 * // (cloned.a !== obj.a)
 * // (cloned.a.b !== obj.a.b)
 * ```
 *
 * @param {Object|Array} obj - object to get cloned
 * @return {Object|Array} deep cloned object
 */
function clone (obj) {
  return _merge({}, (util.isArray(obj) ? [] : {}), obj)
}
exports.clone = clone

/**
 * segment path or properties string
 * @api private
 * @param {String} char - separator char
 * @return {Function}
 */
function _segment (char) {
  var tmp
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
 * @param {Array|String} keys
 * @return {Object} obj for comparison
 */
function _splitPath (keys) {
  var out

  if (util.isString(keys)) {
    out = []
    keys
      .split('.')
      .map(_segment('.'))
      .forEach(function (k) {
        k = (k || ' ').trim()
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
exports._splitPath = _splitPath

/**
 * split comma separated String or Array into a test hash
 * @private
 * @param {Array|String} keys
 * @return {Object} obj for comparison
 */
function _splitProps (props) {
  var test = {}

  if (util.isString(props)) {
    props = props
      .split(',')
      .map(_segment(','))
      .filter(function (k) {
        return k
      })
  }
  if (util.isArray(props)) {
    props.forEach(function (key) {
      test[key] = 1
    })
    return test
  }
  return {}
}
exports._splitProps = _splitProps

/**
 * pick properties from `obj` into a new object
 *
 * #### Example
 *
 * ```js
 * var r,
 *     pick = require('mergee').pick,
 *     obj = { a: 1, b: [ 1, 2 ], c: { cc:3, 'c-d':4 }, '0d': { '0d0': 5 } };
 * r = pick(obj, ['a', 'b[1]', 'c["c-d"]', '0d.0d0']);
 * //> r = { a: 1, b: { '1': 2 }, c: { 'c-d': 4 }, '0d': { '0d0': 5 } }
 * r = pick(obj, 'a, b[1], c["c-d"], 0d.0d0');
 * //> r = { a: 1, b: { '1': 2 }, c: { 'c-d': 4 }, '0d': { '0d0': 5 } }
 * ```
 *
 * @param {Object} obj - object to pick properties from
 * @param {Array|String} props - Array of properties or comma separated string of properties
 * @return {Object} object with picked properties
 */
function pick (obj, props) {
  var key
  var val
  var out
  var test = _splitProps(props)

  if (util.isObject(obj)) {
    out = {}
    for (key in test) {
      val = get(obj, key)
      if (val !== undefined && val !== null) {
        set(out, key, val)
      }
    }
  }
  return out
}
exports.pick = pick

/**
 * omit properties from `obj` into a new object
 *
 * #### Example
 *
 * ```js
 * var r,
 *     omit = require('mergee').omit,
 *     obj = { a: 1, b: [ 1, 2 ], c: { cc:3, 'c-d':4 }, '0d': { '0d0': 5 } };
 * r = omit(obj, ['a', 'b[1]', 'c["c-d"]', '0d.0d0']);
 * // r = { b: [ 1,  ], c: { cc: 3 }, '0d': {} }
 * r = omit(obj, 'a, b[1], c["c-d"], 0d.0d0');
 * // r = { b: [ 1,  ], c: { cc: 3 }, '0d': {} }
 * ```
 *
 * @param {Object} obj - object
 * @param {Array|String} props - Array of properties or comma separated string of properties
 * @return {Object} object with omitted properties
 */
function omit (obj, props) {
  var key
  var out
  var test = _splitProps(props)

  if (util.isObject(obj)) {
    out = clone(obj)
    for (key in test) {
      if ((get(obj, key))) {
        set(out, key, null)
      }
    }
  }
  return out
}
exports.omit = omit

/**
 * get properties from `obj`
 *
 *
 * #### Example
 *
 * ```js
 * var r,
 *     get = require('mergee').get,
 *     obj = { a: { b: { c: 1 } } };
 * r = get(obj, ['a', 'b', 'c']);
 * // r = 1
 * r = get(obj, 'a.b');
 * // r = { c: 1 }
 * r = get(obj, 'there.is.no.such.property'); // this will not throw!
 * // r = undefined
 * ```
 *
 * @param {Object} obj - object to select from
 * @param {Array|String} keys - Array of properties or dot separated string of properties; If using a String avoid using property names containing a `.`
 * @return {Object} selected object
 */
function get (obj, keys, _default) {
  var i
  var key
  var tmp = obj || {}

  keys = _splitPath(keys)

  if (!keys || keys.length === 0) {
    return _default
  }

  for (i = 0; i < keys.length; i++) {
    key = keys[i]
    if (tmp && tmp.hasOwnProperty(key)) {
      tmp = tmp[key]
    } else {
      return _default
    }
  }
  return tmp
}
exports.get = get

/**
 * select properties from `obj`
 * same as `get` - maintained for compatibility reasons
 */
exports.select = get

/**
 * set a property in `obj`
 *
 * #### Example
 *
 * ```js
 * var r,
 *     set = require('mergee').set,
 *     obj = {};
 * r = set(obj, ['a', 'b'], { c:1 });
 * //> r = { a: { b: { c: 1 } } }
 * r = set(obj, 'a.b.d', 2);
 * //> r = { a: { b: { c:1, d:2 } } }
 * ```
 *
 * @param {Object} obj - object to select from
 * @param {Array|String} keys - Array of properties or dot separated string of properties; If using a String avoid using property names containing a `.`
 * @param {Any} value - The value to set
 * @return {Object} set object
 */
function set (obj, keys, value) {
  var i
  var key
  var last
  var tmp = obj || {}

  keys = _splitPath(keys)

  if (!keys || keys.length === 0) {
    return
  }

  last = keys.pop()

  for (i = 0; i < keys.length; i++) {
    key = keys[i]
    if (!tmp[key]) {
      tmp[key] = {}
    }
    if (tmp.hasOwnProperty(key)) {
      tmp = tmp[key]
    }
  }
  if (value === null) {
    delete (tmp[last])
  } else {
    tmp[last] = value
  }
  return obj
}
exports.set = set
