[![npm badge][npm-badge]][npm]
![types badge][types-badge]
[![CI badge][ci-badge]][ci]

# mergee

> Utilities for objects

This is a selection of utilities for objects containing:

- merge - merge multiple sources into a target object; merges Map() and Set()
- mergeExt - same as merge but with options
- clone - deep clone of an object or array.
- pick - pick properties from an object
- omit - omit properties from an object
- isCircular - check object for circular structures
- deepEqual - deep comparison
- set - set values on objects
- get - get values from objectsΩ

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Methods](#methods)
  * [merge(target, ...source)](#mergetarget-source)
  * [mergeExt(opts, target, source)](#mergeextopts-target-source)
  * [clone(obj)](#cloneobj)
  * [pick(obj, props)](#pickobj-props)
  * [omit(obj, props)](#omitobj-props)
  * [get(obj, keys, def?)](#getobj-keys-def)
  * [set(obj, keys, value)](#setobj-keys-value)
  * [isCircular(obj)](#iscircularobj)
  * [deepEqual(actual, expected)](#deepequalactual-expected)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)

<!-- toc! -->

## Methods

### merge(target, ...source)

Deep merge of multiple objects into `target`.  
Merges [Map][] and [Set][].  
Clones [ArrayBuffer][], [Date][],[Error][], [Function][],[RegExp][] and [TypedArray][]s.

[ArrayBuffer]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[Error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[Set]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
[TypedArray]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray

#### Example

```js
import { merge } from 'mergee'
const target = { t: 1, x: { y: 'z' } }
const source1 = { t: { s1: /source1/ } }
const source2 = { t: { s2: new Date(100), x: null } }

merge(target, source1, source2)
//> target === { t: { s1: /source1/, s2: Wed Dec 31 1969 17:00:00 GMT-0700 (MST) }, x: null }
```

**Parameters**

**target**: `object | function | any[]`, target object

**source**: `any`, arguments 2 ... n

**Returns**: `object | function | any[]`, merged target

### mergeExt(opts, target, source)

extended merge

#### Example

```js
import { mergeExt } from 'mergee'
const target = { t: 1, x: { y: 'z' } }
const source1 = { t: { s1: /source1/ } }
const source2 = { t: { s2: new Date(100), x: null } }

mergeExt({ ignoreNull: true }, target, source1, source2)
//> target === { t: { s1: /source1/, s2: Wed Dec 31 1969 17:00:00 GMT-0700 (MST) }, x: { y: 'z' } }
```


**Parameters**

**opts**: `object`, options

**opts.ignoreNull**: `boolean`, treat `source === null` as undefined - target does not get deleted

**opts.ignoreCircular**: `boolean`, ignore cirular structures - no error gets thrown

**opts.arrayMerge**: `(target: any, source: any, opts) => any` - custom array merge function.

If deep comparison for array merge operations is required:

```js
import { arrayMergeDeep as arrayMerge, mergeExt } from 'mergee'
const target = { a: [{ b: 1 }, 2] }
const source = { a: [3, { b: 1 }] }
r = mergeExt({ arrayMerge }, target, source)
//> r = { a: [{ b:1 }, 2, 3]}
```

**target**: `object | function | any[]`, target object

**source**: `any`, arguments 2 ... n

**Returns**: `object | function | any[]`, merged target

### clone(obj)

Perform a deep clone of `obj`

#### Example

```js
import { clone } from 'mergee'
const obj = { a: { b: { c: 1 } } }

var cloned = clone(obj)
//> (cloned !== obj)
//> (cloned.a !== obj.a)
//> (cloned.a.b !== obj.a.b)
```

**Parameters**

**obj**: `object | any[]`, to get cloned

**Returns**: `object | any[]`, deep cloned object

### pick(obj, props)

pick properties from `obj` into a new object

#### Example

```js
import { pick } from 'mergee'
const obj = { a: 1, b: [1, 2], c: { cc: 3, 'c-d': 4 }, '0d': { '0d0': 5 } }
const r = pick(obj, ['a', 'b[1]', 'c["c-d"]', '0d.0d0'])
//> r = { a: 1, b: { '1': 2 }, c: { 'c-d': 4 }, '0d': { '0d0': 5 } }
r = pick(obj, 'a, b[1], c["c-d"], 0d.0d0')
//> r = { a: 1, b: { '1': 2 }, c: { 'c-d': 4 }, '0d': { '0d0': 5 } }
```

**Parameters**

**obj**: `object`, object to pick properties from

**props**: `string | string[]`, Array of properties or comma separated string of properties

**Returns**: `object`, object with picked properties

### omit(obj, props)

omit properties from `obj` into a new object

#### Example

```js
import { omit } from 'mergee'
const obj = { a: 1, b: [1, 2], c: { cc: 3, 'c-d': 4 }, '0d': { '0d0': 5 } }
let r = omit(obj, ['a', 'b[1]', 'c["c-d"]', '0d.0d0'])
//> r = { b: [ 1,  ], c: { cc: 3 }, '0d': {} }
r = omit(obj, 'a, b[1], c["c-d"], 0d.0d0')
//> r = { b: [ 1,  ], c: { cc: 3 }, '0d': {} }
```

**Parameters**

**obj**: `object`, object

**props**: `string | string[]`, Array of properties or comma separated string of properties

**Returns**: `object`, object with omitted properties

### get(obj, keys, def?)

get properties from `obj`

#### Example

```js
import { get } from 'mergee'
const obj = { a: { b: { c: 1 } } }
let r = get(obj, ['a', 'b', 'c'])
//> r = 1
r = get(obj, 'a.b')
//> r = { c: 1 }
r = get(obj, 'there.is.no.such.property') // this will not throw!
//> r = undefined
```

**Parameters**

**obj**: `object`, object to select from

**keys**: `string | string[]`, Array of properties or dot separated string of properties; If using a String avoid using property names containing a `.`

**def?** default value if key was not found

**Returns**: `object|_def`, selected object or default value

### set(obj, keys, value)

set a property in `obj`

#### Example

```js
import { set } from 'mergee'
const obj = {}
let r = set(obj, ['a', 'b'], { c: 1 })
//> r = { a: { b: { c: 1 } } }
r = set(obj, 'a.b.d', 2)
//> r = { a: { b: { c:1, d:2 } } }
```

**Parameters**

**obj**: `object`, object to select from

**keys**: `string|string[]`, Array of properties or dot separated string of properties; If using a String avoid using property names containing a `.`

**value**: `any`, The value to set

**Returns**: `object`, set object

### isCircular(obj)

check if an object `obj` contains circular structures

#### Example

```js
import { isCircular } from 'mergee'
const obj = { a: {} }
obj.a.c = { c: 1 }
//> isCircular(obj) === true
```

**Parameters**

**obj**: `object`, Object to check

**Returns**: `boolean`, true if `obj` is circular

### deepEqual(actual, expected)

deep comparison of `actual` and `expected`

**Parameters**

**actual**: `any`, deep comparison of `actual` and `expected`

**expected**: `any`, deep comparison of `actual` and `expected`

**Returns**: `boolean`, true if `actual` deep equals `expected`

## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your
code to be distributed under the MIT license. You are also implicitly
verifying that all code is your original work or correctly attributed
with the source of its origin and licence.

## License

This module contains code from other MIT licensed sources:

- `src/deepEqual.js` is from [node v0.12 assert.js](https://github.com/joyent/node/blob/v0.12.0-release/lib/assert.js) - MIT licensed
- `src/util.js` is from [node v0.12 util.js](https://github.com/joyent/node/blob/v0.12.0-release/lib/util.js) - MIT licensed

Copyright (c) 2015- commenthol (MIT License)

See [LICENSE][] for more info.

[LICENSE]: ./LICENSE
[npm-badge]: https://badgen.net/npm/v/mergee
[npm]: https://www.npmjs.com/package/mergee
[types-badge]: https://badgen.net/npm/types/mergee
[ci-badge]: https://github.com/commenthol/mergee/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/commenthol/mergee/actions/workflows/ci.yml
