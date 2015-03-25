/**
 * @module deepequal.js
 * @see https://github.com/joyent/node/blob/v0.12.0-release/lib/assert.js
 */

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// can't use standard util here as required functions are missing in node < 0.11
var util = require('./util');

/**
 * deep comparison of `actual` and `expected`
 * @param {Any} actual
 * @param {Any} expected
 * @return {Boolean} true if `actual` equals `expected`
 */
function deepEqual(actual, expected) {
	// 7.1. All identical values are equivalent, as determined by ===.
	if (actual === expected) {
		return true;

	} else if (util.isBuffer(actual) && util.isBuffer(expected)) {
		if (actual.length != expected.length) return false;

		for (var i = 0; i < actual.length; i++) {
			if (actual[i] !== expected[i]) return false;
		}

		return true;

	// 7.2. If the expected value is a Date object, the actual value is
	// equivalent if it is also a Date object that refers to the same time.
	} else if (util.isDate(actual) && util.isDate(expected)) {
		return actual.getTime() === expected.getTime();

	// 7.3 If the expected value is a RegExp object, the actual value is
	// equivalent if it is also a RegExp object with the same source and
	// properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	} else if (util.isRegExp(actual) && util.isRegExp(expected)) {
		return actual.source === expected.source &&
					 actual.global === expected.global &&
					 actual.multiline === expected.multiline &&
					 actual.lastIndex === expected.lastIndex &&
					 actual.ignoreCase === expected.ignoreCase;

	// 7.4. Other pairs that do not both pass typeof value == 'object',
	// equivalence is determined by ==.
	} else if (!util.isObject(actual) && !util.isObject(expected)) {
		return actual == expected;

	// 7.5 For all other Object pairs, including Array objects, equivalence is
	// determined by having the same number of owned properties (as verified
	// with Object.prototype.hasOwnProperty.call), the same set of keys
	// (although not necessarily the same order), equivalent values for every
	// corresponding key, and an identical 'prototype' property. Note: this
	// accounts for both named and indexed properties on Arrays.
	} else {
		return _objEquiv(actual, expected);
	}
}
module.exports = deepEqual;

function isArguments(object) {
	return Object.prototype.toString.call(object) == '[object Arguments]';
}

/**
 * @see https://github.com/joyent/node/blob/v0.12.0-release/lib/assert.js
 */
function _objEquiv(a, b) {
	var ka, kb, key, i;

	if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
		return false;

	// an identical 'prototype' property.
	if (a.prototype !== b.prototype) return false;
	//~~~I've managed to break Object.keys through screwy arguments passing.
	//   Converting to array solves the problem.
	var aIsArgs = isArguments(a),
		bIsArgs = isArguments(b);
	if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
		return false;
	if (aIsArgs) {
		a = Array.prototype.slice.call(a);
		b = Array.prototype.slice.call(b);
		return deepEqual(a, b);
	}
	try {
		ka = Object.keys(a);
		kb = Object.keys(b);
	} catch (e) {//happens when one is a string literal and the other isn't
		return false;
	}
	// having the same number of owned properties (keys incorporates
	// hasOwnProperty)
	if (ka.length != kb.length)
		return false;
	//the same set of keys (although not necessarily the same order),
	ka.sort();
	kb.sort();
	//~~~cheap key test
	for (i = ka.length - 1; i >= 0; i--) {
		if (ka[i] != kb[i])
			return false;
	}
	//equivalent values for every corresponding key, and
	//~~~possibly expensive deep test
	for (i = ka.length - 1; i >= 0; i--) {
		key = ka[i];
		if (!deepEqual(a[key], b[key])) return false;
	}
	return true;
}
