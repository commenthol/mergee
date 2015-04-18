# mergee

> Utilities for objects

[![NPM version](https://badge.fury.io/js/mergee.svg)](https://www.npmjs.com/package/mergee/)
[![Build Status](https://secure.travis-ci.org/commenthol/mergee.svg?branch=master)](https://travis-ci.org/commenthol/mergee)

This is a selection of utilities for objects and contains:

* extend - extends a target object with multiple sources
* merge - merge multiple sources into a target object
* mergeExt - same as merge but with options
* clone - deep clone of an object or array.
* pick - pick properties from an object
* omit - omit properties from an object
* select - select properties from an object
* isCircular - check object for circular structures
* deepEqual - deep comparison

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Methods](#methods)
  * [extend(target, source)](#extendtarget-source)
  * [merge(target, source)](#mergetarget-source)
  * [mergeExt(opts, opts.ignoreNull, opts.ignoreCircular, target, source)](#mergeextopts-optsignorenull-optsignorecircular-target-source)
  * [clone(obj)](#cloneobj)
  * [pick(obj, keys)](#pickobj-keys)
  * [omit(obj, keys)](#omitobj-keys)
  * [select(obj, keys)](#selectobj-keys)
  * [isCircular(obj)](#iscircularobj)
  * [deepEqual(actual, expected)](#deepequalactual-expected)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)

<!-- toc! -->

## Methods


### extend(target, source)

extend object `target` with multiple `source` objects

#### Example

````js
var extend  = require('mergee').extend,
    target  = { a:{A:1}, b:{A:1} },
    source1 = { b:{B:2}, c:{B:2} },
    source2 = { d:{C:3} };
extend(target, source1, source2);
// target === { a:{A:1}, b:{B:2}, c:{B:2}, d:{C:3} };
````

**Parameters**

**target**: `Object | Array | function`, extend object `target` with multiple `source` objects

#### Example

````js
var extend  = require('mergee').extend,
    target  = { a:{A:1}, b:{A:1} },
    source1 = { b:{B:2}, c:{B:2} },
    source2 = { d:{C:3} };
extend(target, source1, source2);
// target === { a:{A:1}, b:{B:2}, c:{B:2}, d:{C:3} };
````

**source**: `Any`, arguments 2 ... n

**Returns**: `Object`, extended target


### merge(target, source)

merge multiple objects into `target`

#### Example

````js
var merge = require('mergee').merge,
    target  = { t: 1, x: { y: 'z' } },
    source1 = { t: { s1: /source1/ } },
    source2 = { t: { s2: new Date(100), x: null } };
merge(target, source1, source2);
// target === { t: { s1: /source1/, s2: Wed Dec 31 1969 17:00:00 GMT-0700 (MST) }, x: null }
````

**Parameters**

**target**: `Object | function | Array`, target object

**source**: `Any`, arguments 2 ... n

**Returns**: `Object`, merged target


### mergeExt(opts, opts.ignoreNull, opts.ignoreCircular, target, source)

extended merge

#### Example

````js
var merge = require('mergee').merge,
    target  = { t: 1, x: { y: 'z' } },
    source1 = { t: { s1: /source1/ } },
    source2 = { t: { s2: new Date(100), x: null } };
mergeExt({ ignoreNull: true }, target, source1, source2);
// target === { t: { s1: /source1/, s2: Wed Dec 31 1969 17:00:00 GMT-0700 (MST) }, x: { y: 'z' } }
````

**Parameters**

**opts**: `Object`, options

**opts.ignoreNull**: `Boolean`, treat `source === null` as undefined - target does not get deleted

**opts.ignoreCircular**: `Boolean`, ignore cirular structures - no error gets thrown

**target**: `Object | function | Array`, target object

**source**: `Any`, arguments 3 ... n

**Returns**: `Object`, merged target


### clone(obj)

perform a deep clone of `obj`

#### Example

```js
var clone = require('mergee').clone,
    obj = { a: { b: { c: 1 } } };
var cloned = clone(obj);
// (cloned !== obj)
// (cloned.a !== obj.a)
// (cloned.a.b !== obj.a.b)
```

**Parameters**

**obj**: `Object | Array`, object to get cloned

**Returns**: `Object | Array`, deep cloned object


### pick(obj, keys)

pick properties from `obj` into a new object

#### Example

```js
var r,
    pick = require('mergee').pick,
    obj = { a:1, b:2, c:3, d:4 };
r = pick(o, ['a', 'd']);
// r = { a:1, d: 4 }
r = pick(o, 'a,d');
// r = { a:1, d: 4 }
```

**Parameters**

**obj**: `Object`, object to pick properties from

**keys**: `Array | String`, Array of properties or comma separated string of properties

**Returns**: `Object`, object with picked properties


### omit(obj, keys)

omit properties from `obj` into a new object

#### Example

```js
var r,
    omit = require('mergee').omit,
    obj = { a:1, b:2, c:3, d:4 };
r = omit(o, ['a', 'd']);
// r = { b:2, c: 3 }
r = omit(o, 'a,d');
// r = { b:2, c: 3 }
```

**Parameters**

**obj**: `Object`, object

**keys**: `Array | String`, Array of properties or comma separated string of properties

**Returns**: `Object`, object with omitted properties


### select(obj, keys)

select properties from `obj`

#### Example

```js
var r,
    select = require('mergee').select,
    obj = { a: { b: { c: 1 } } };
r = select(obj, [a, b, c]);
// r = 1
r = select(obj, 'a.b.c');
// r = 1
r = select(obj, 'there.is.no.such.property'); // this will not throw!
// r = undefined
```

**Parameters**

**obj**: `Object`, object to select from

**keys**: `Array | String`, Array of properties or dot separated string of properties

**Returns**: `Object`, selected object


### isCircular(obj)

check if an object `obj` contains circular structures

#### Example

````js
var isCircular  = require('mergee').isCircular,
    obj = { a: {} };
obj.a.c = { c: 1 };
// isCircular(obj) === true
````

**Parameters**

**obj**: `Object`, Object to check

**Returns**: `Boolean`, true if `obj` contains circularities


### deepEqual(actual, expected)

deep comparison of `actual` and `expected`

**Parameters**

**actual**: `Any`, deep comparison of `actual` and `expected`

**expected**: `Any`, deep comparison of `actual` and `expected`

**Returns**: `Boolean`, true if `actual` equals `expected`


## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the MIT license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and licence.

## License

This module contains code from other MIT licensed sources:

* `lib/deepequal.js` is from [node v0.12 assert.js](https://github.com/joyent/node/blob/v0.12.0-release/lib/assert.js) - MIT licensed
* `lib/util.js` is from [node v0.12 util.js](https://github.com/joyent/node/blob/v0.12.0-release/lib/util.js) - MIT licensed

Copyright (c) 2015 commenthol (MIT License)

See [LICENSE][] for more info.

[LICENSE]: ./LICENSE






