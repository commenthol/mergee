/**
 * @copyright 2015 commenthol
 * @license MIT
 */

'use strict';

// module variables
var util = require('./lib/util');
var deepEqual = require('./lib/deepequal');
exports.deepEqual = deepEqual;

/**
 * check if an object `obj` contains circular structures
 */
function isCircular (obj) {
	return _checkCircular({_visited: []}, obj);
}
exports.isCircular = isCircular;

/**
 * @private
 */
function _checkCircular(opts, obj) {
	var key;
	if (util.isObject(obj)) {
		if (~opts._visited.indexOf(obj)) {
			return true;
		}
		opts._visited.push(obj);
		for (key in obj) {
			if (obj.hasOwnProperty(key) && _checkCircular(opts, obj[key])) {
				return true;
			}
		}
	}
	return false;
}

/**
 * extend object `target` with multiple other objects
 * @param {Object} target
 * @param {Any} arguments 1 ... n
 * @return {Object} extended target
 */
function extend (target) {
	var i, source, key;

	for (i = 1; i < arguments.length; i++) {
		source = arguments[i];
		if (typeof source === 'object' && source) {
			for (key in source) {
				if (source.hasOwnProperty(key)) {
					target[key] = source[key];
				}
			}
		}
	}
	return target;
}
exports.extend = extend;

/**
 * merge multiple objects into `target`
 * @param {Object|Function|Array} target
 * @param {Any} arguments 1 ... n
 * @return {Object} merged target
 */
function merge () {
	var args = [].slice.call(arguments);
	args.unshift({});
	return mergeExt.apply(null, args);
}
exports.merge = merge;

/**
 * extended merge
 *
 * ignoreNull: true,		// treat source === null as undefined - target does not get deleted
 * ignoreCircular: true,	// ignore cirular structures - no error gets thrown
 */
function mergeExt (opts, target) {
	var visited = [];

	opts = opts || {};
	opts._visited = visited;
	opts._count = 0;

	for (var i = 2; i < arguments.length; i++) {
		target = _merge(opts, target, arguments[i]);
	}

	return target;
}
exports.mergeExt = mergeExt;

/**
 * @private
 * @param {Object} opts
 * @param {Any} target
 * @param {Any} source
 * @return {Any} source merged into target
 */
function _merge(opts, target, source) {
	var i,
		j,
		tmp,
		test,
		equal,
		key,
		s = { // hold booleans for source
			isObj: util.isObject(source),
			isFn:  util.isFunction(source),
			isArr: util.isArray(source),
		},
		t = { // hold booleans for target
			isObj: util.isObject(target),
			isFn:  util.isFunction(target),
			isArr: util.isArray(target),
		};

	if (!opts._visited) {
		opts._visited = [];
	}

	if (target === source || 	// for primitives or null
		undefined === source	// target stays the same
	){
		return target;
	}

	if (null === source) {
		if (!opts.ignoreNull) target = source;
		return target;
	}

	if (null === target || undefined === target) {
		if (s.isObj && s.isArr){
			// clone into array
			target = _merge(opts, [], source);
		}
		else if (s.isObj) {
			// clone source
			target = _merge(opts, {}, source);
		}
		else {
			// copy primitives
			target = source;
		}
		return target;
	}

	// create new instances for "special" objects
	if (s.isObj) {
		if (util.isRegExp(source)){
			// create new RegExp
			target = new RegExp(source);
			return target;
		}
		else if (util.isDate(source)){
			// create new Date
			target = new Date(source);
			return target;
		}
		else if (util.isBuffer(source)){
			// create new Buffer
			target = new Buffer(source);
			return target;
		}
	}

	if (s.isFn) { // replace with source function
		target = source;
		// TODO - clone possible keys
		return target;
	}

	if (s.isArr) {
		if (t.isArr) {
			test = [].concat(target); // test for duplicates
			for (i = 0; i < source.length; i++) {
				tmp = source[i];
				if (! ~test.indexOf(tmp)) {
					if (!util.isObject(tmp) || null === tmp) { // primitive or function or null or undefined
						target.push(tmp);
					}
					else {
						equal = false;
						j = test.length;
						while (j-->0 && !(equal = deepEqual(test[j], tmp)));
						if (!equal) target.push( _merge(opts, null, tmp) );
					}
				}
			}
		}
		else {
			// if target is not array replace with source
			target = _merge(opts, [], source);
		}
		return target;
	}

	if (!t.isFn && !t.isObj && !t.isArr){
		// copy primitives
		target = source;
		return target;
	}

	// copy properties if not circular
	if ( ! ~opts._visited.indexOf(source) ){
		opts._visited.push(source);
		for (key in source) {
			if( source.hasOwnProperty(key) ) {

				target[key] = _merge(opts, target[key], source[key]);
			}
		}
		opts._visited.pop();
	}
	else if (!opts.ignoreCircular) {
		throw new Error('can not merge circular structures.');
	}

	return target;
}
exports._merge = _merge;

/**
 * perform a deep clone of `obj`
 * @param {Object|Array} obj
 * @return {Object|Array} deep cloned object
 */
function clone (obj) {
	return _merge({}, (util.isArray(obj) ? [] : {}), obj);
}
exports.clone = clone;

/**
 * split comma separated String or Array into a test hash
 * @private
 * @param {Array|String} keys
 * @return {Object} obj for comparison
 */
function _splitKeys (keys, opts) {
	var test = {};
	opts = extend({ char: ','}, opts);

	if (util.isString(keys)) {
		if (~keys.indexOf(opts.char)) {
			keys = keys.split(opts.char);
		}
		else {
			keys = [ keys ];
		}
	}
	if (opts.array) {
		return keys;
	}
	if (util.isArray(keys)) {
		keys.forEach(function(key){
			test[key] = 1;
		});
	}
	return test;
}

/**
 * pick properties from `obj` into a new object
 * @param {Object} obj
 * @param {Array|String} keys - Array of properties or comma separated string of properties
 * @return {Object} object with picked properties
 */
function pick (obj, keys) {
	var key,
		out,
		test = _splitKeys(keys);

	if (util.isObject(obj)) {
		out = {};
		for (key in obj) {
			if (obj.hasOwnProperty(key) && (key in test)) {
				out[key] = obj[key];
			}
		}
	}
	return out;
}
exports.pick = pick;

/**
 * omit properties from `obj` into a new object
 * @param {Object} obj
 * @param {Array|String} keys - Array of properties or comma separated string of properties
 * @return {Object} object with omitted properties
 */
function omit (obj, keys) {
	var key,
		out,
		test = _splitKeys(keys);

	if (util.isObject(obj)) {
		out = {};
		for (key in obj) {
			if (obj.hasOwnProperty(key) && !(key in test)) {
				out[key] = obj[key];
			}
		}
	}
	return out;
}
exports.omit = omit;

/**
 * select properties from `obj`
 * @param {Object} obj
 * @param {Array|String} keys - Array of properties or dot separated string of properties
 * @return {Object} selected object
 */
function select(obj, keys) {
	var i,
		key,
		tmp = obj || {};

	keys = _splitKeys(keys, { char: '.', array: true });

	if (!keys || keys.length === 0) {
		return;
	}

	for (i=0; i<keys.length; i++) {
		key = keys[i];
		if (tmp && tmp.hasOwnProperty(key)) {
			tmp = tmp[key];
		}
		else {
			return;
		}
	}
	return tmp;
}
exports.select = select;

