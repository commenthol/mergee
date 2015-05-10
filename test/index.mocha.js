'use strict';

/* global describe, it */

var assert = require('assert');
var M = require('../index');

function log (arg) {
	console.log(JSON.stringify(arg).replace(/"/g, ''));
}

describe('#isCircular', function(){
	it('circular object', function(){
		var o = { a: { b: {} } };
		o.a.c = o.a.b;
		assert.ok(M.isCircular(o));
	});
	it('not a circular object', function(){
		var o = { a: {} };
		o.a.c = { c: 1 };
		assert.ok(!M.isCircular(o));
	});
});

describe('#extend', function(){
	it('nothing', function(){
		var r = M.extend();
		assert.ok(r === undefined);
	});
	it('null', function(){
		var r = M.extend(null);
		assert.ok(r === null);
	});
	it('empty', function(){
		var r = M.extend({});
		var e = {};
		assert.deepEqual(r, e);
	});
	it('array', function(){
		var r = M.extend([]);
		var e = [];
		assert.deepEqual(r, e);
	});
	it('function', function(){
		var f = function(){ return 1; };
		var r = M.extend(f);
		var e = f;
		assert.deepEqual(r, e);
	});
	it('object with two objects', function(){
		var r = M.extend({ a:1, b:1 }, { b:2, c:2 }, { d:3 });
		var e = { a:1, b:2, c:2, d:3 };
		assert.deepEqual(r, e);
	});
	it('object with two objects of objects', function(){
		var r = M.extend({ a:{A:1}, b:{A:1} }, { b:{B:2}, c:{B:2} }, { d:{C:3} });
		var e = { a:{A:1}, b:{B:2}, c:{B:2}, d:{C:3} };
		assert.deepEqual(r, e);
	});
	it('object with string', function(){
		var r = M.extend({ a:1 }, 'abc');
		var e = { a: 1 };
		assert.deepEqual(r, e);
	});
	it('object with arrays', function(){
		var r = M.extend({a:1}, [ 1,2,3 ], [4,5]);
		var e = { '0': 4, '1': 5, '2': 3, a: 1 };
		assert.deepEqual(r, e);
	});
	it('object with objects of array', function(){
		var r = M.extend({a:1}, {b:[ 1,2,3 ]}, {b:[4,5]});
		var e =  {a:1,b:[4,5]};
		assert.deepEqual(r, e);
	});
	it('function with objects', function(){
		var f = function(){ return 1; };
		var r = M.extend(f, {a: 1}, {b: 2});
		var e = function(){ return 1; };
		e.a = 1; e.b = 2;
		assert.equal(r.toString(), e.toString());
		Object.keys(e).forEach(function(i){
			assert.equal(r[i], e[i]);
		});
	});
	it('array with objects', function(){
		var r = M.extend([1,2], {a: 1}, {b: 2});
		var e = [ 1, 2 ];
		e.a = 1; e.b = 2;
		assert.deepEqual(r, e);
	});
	it('extending values',function(){
		var s1 = { a:1, b:1};
		var s2 = { b:2, c:2};
		var s3 = { b:3, d:3};
		var res = M.extend (s1, s2, s3);
		assert.deepEqual(res, { a: 1, b: 3, c: 2, d: 3 });
	});
	it('extending objects',function(){
		var s1 = { a: { a:1, b:1 } };
		var s2 = { b: { b:2, c:2 } };
		var s3 = { a: { b:3, d:null } };
		var res = M.extend (s1, s2, s3);
		assert.deepEqual(res, {
			a: { d: null, b: 3 },
			b: { c: 2, b: 2 }
		});
	});
	it('extending objects of objects',function(){
		var s1 = { a: { a:1, b: { c: 2 } } };
		var s2 = { b: { b:2, c:2 } };
		var s3 = { a: { b: { d: 4 }, d:null } };
		var res = M.extend (s1, s2, s3);
		assert.deepEqual(res, {
			a: { d: null, b: { d: 4 } },
			b: { c: 2, b: 2 }
		});
	});
	it('extending arrays',function(){
		var s1 = { a: [ 1, 2, 3 ] };
		var s2 = { b: [ 4, 5 ] };
		var s3 = { b: [ 6 ] };
		var res = M.extend (s1, s2, s3);
		assert.deepEqual(res, {
			a: [ 1, 2, 3 ],
			b: [ 6 ]
		});
	});
	it('extending arrays of objects',function(){
		var s1 = { a: [ {a: 1} , {b: 2}, 3 ] };
		var s2 = { b: [ 3, {e: 4}, {f: 5} ] };
		var s3 = { b: [ {g: 6} ] };
		var res = M.extend (s1, s2, s3);
		assert.deepEqual(res, {
			a: [ {a: 1} , {b: 2}, 3 ],
			b: [ {g: 6} ]
		});
	});

});

describe('#merge', function(){

	it('merge nothing', function(){
		var r = M.merge();
		var e;
		assert.deepEqual(r,e);
	});

	it('merge null', function(){
		var r = M.merge({ a: 1 }, null);
		var e = null;
		assert.deepEqual(r,e);
	});

	it('merge undefined', function(){
		var r = M.merge({ a:1 }, undefined, { b:2 });
		var e = { a:1, b:2 };
		assert.deepEqual(r,e);
	});

	it('merge objects', function(){
		var r = M.merge(
			{ a:1 },
			{ b:2 },
			{ c:3 },
			{ d:4 }
		);
		var e = { a:1, b:2, c:3, d:4 };
		assert.deepEqual(r,e);
	});

 	it('deep merge objects', function(){
		var r = M.merge(
			{ a: { b: { c: 1 } } },
			{ a: { c: { d: 2 } } },
			{ a: { c: { d: 3 } } },
			{ a: { c: { e: 4 } } }
		);
		var e = { a: { b: { c: 1 }, c: { d: 3, e: 4 } } };
		//~ console.log(r)
		assert.deepEqual(r,e);
	});

	it('merging circular objects throws', function(){
		var r;
		var err;
		var o1 = { a: {} };
		o1.a.c = o1.a;
		var o2 = { a: { b: {} } };
		o2.a.b.c = o2.a.b;
		try {
			r = M.merge(o1, o2);
		} catch (e) {
			err = e;
		}
		assert.ok(err);
	});

	it('merge object into function', function(){
		var f = function(){ return this; };
		f.a = { b: 1 };
		var o = { a: { b: 2 } };
		var r = M.merge(f, o);
		//~ console.log(r)
		assert.ok(r === f);
		assert.ok(typeof r === 'function');
		assert.deepEqual(r.a, o.a);
	});

	it('merge function into object', function(){
		var f = function(){ return this; };
		f.a = { b: 2 } ;
		var o = { a: { b: 1 } };
		var r = M.merge(o, f);
		assert.ok(r === f);
		assert.ok(typeof r === 'function');
		assert.deepEqual(r.a, f.a);
	});

	it('merge Dates', function(){
		var d5 = new Date(5*24*3600*1000);
		var d7 = new Date(7*24*3600*1000);
		var d9 = new Date(9*24*3600*1000);
		var o1 = { a: d5 };
		var o2 = { b: d7 };
		var o3 = { b: d9 };
		var r = M.merge({}, o1, o2, o3);
		assert.equal(r.a.toISOString(), d5.toISOString());
		assert.ok(r.a !== d5);
		assert.equal(r.b.toISOString(), d9.toISOString());
		assert.ok(r.b !== d9);
	});

	it('merging values',function(){

		var s1 = { a:1, b:1};
		var s2 = { b:2, c:2};
		var s3 = { b:3, d:3};
		var res = M.merge (s1, s2, s3);

		assert.deepEqual(res, { a: 1, b: 3, c: 2, d: 3 });
	});

	it('merging objects',function(){

		var s1 = { a: { a:1, b:1 } };
		var s2 = { a: { c: { a: null } }, b: { b:2, c:2 } };
		var s3 = { a: { b:3, d:3 } };
		var res = M.merge (s1, s2, s3);

		assert.deepEqual(res, {
			a: { a: 1, c: { a: null }, b: 3, d: 3 },
			b: { b: 2, c: 2 }
		});
	});

	it('merging arrays',function(){
		var s1 = { a: [ 1, 2, 3 ] };
		var s2 = { b: [ 4, 5 ] };
		var s3 = { b: [ 6 ] };
		var res = M.merge (s1, s2, s3);
		var exp = { a: [ 1, 2, 3 ],b: [ 4, 5, 6 ]};
		assert.deepEqual(res, exp);
	});

	it('merging arrays of objects',function(){
		var s1 = { a: [ {a: 1} , {b: 2}, 3 ] };
		var s2 = { b: [ 3, {e: 4}, {f: 5} ] };
		var s3 = { a: [ 4, {g: 5}, 6 ], b: [ {g: 6} ] };
		var exp = {a:[{a:1},{b:2},3,4,{g:5},6],b:[3,{e:4},{f:5},{g:6}]};
		var res = M.merge (s1, s2, s3);
		assert.deepEqual(res, exp);
	});

	it('merging arrays of objects of objects',function(){
		var s1 = {a:[{aa:{ab:{ac:1}}},{ba:{bb:2}},3],b:[{a:1}]};
		var s2 = {a:[{aa:{ab:{ac:2}}},{ba:{bb:3}},4],b:[{a:1}]};
		var s3 = {a:[4,{g:5},6],b:[{a:1},{g:6},{a:2}]};
		var exp = {a:[{aa:{ab:{ac:1}}},{ba:{bb:2}},3,{aa:{ab:{ac:2}}},{ba:{bb:3}},4,{g:5},6],b:[{a:1},{g:6},{a:2}]};
		var res = M.merge (s1, s2, s3);
		assert.deepEqual(res, exp);
	});

	it('merging objects of objects',function(){
		var s1 = {a:{a:1,b:1}};
		var s2 = {b:{b:2,c:2}};
		var s3 = {a:{b:{e:3,f:4},d:3}};
		var exp = {a:{a:1,b:{e:3,f:4},d:3},b:{b:2,c:2}};
		var res = M.merge (s1, s2, s3);
		assert.deepEqual(res, exp);
	});

	it('merging objects with null objects',function(){
		var s1 = { a: { a:1, b:1 } };
		var s2 = { b: { b:2, c:2 } };
		var s3 = { a: null };
		var exp = {a:null,b:{b:2,c:2}};
		var res = M.merge (s1, s2, s3);
		assert.deepEqual(res, exp);
	});

	it('merging sample', function(){
		var target  = { t: 1, x: { y: 'z' } },
			source1 = { t: { s1: /source1/ }, x: null },
			source2 = { t: { s2: new Date(100) } };

		var res = M.merge(target, source1, source2);
		var exp = { t: { s1: /source1/, s2: new Date(100) }, x: null };
		assert.deepEqual(res, exp);
	});

});

describe('#mergeExt', function(){

	var opts = {
		ignoreNull: true,	// treat source === null as undefined - target does not get deleted
		ignoreCircular: true,	// ignore cirular structures - no error gets thrown
	};

	it('merge null', function(){
		var res = M.mergeExt(opts, { a: 1 }, null);
		var exp = { a: 1 };
		assert.deepEqual(res, exp);
	});

	it('ignore merging objects with null objects',function(){
		var s1 = { a: { a:1, b:1 } };
		var s2 = { b: { b:2, c:2 } };
		var s3 = { a: null };
		var exp = {a:{a:1,b:1},b:{b:2,c:2}};
		var res = M.mergeExt (opts, s1, s2, s3);
		assert.deepEqual(res, exp);
	});

	it('dont merge circular objects', function(){
		var o1 = { a: {} };
		o1.a.c = o1.a;
		var o2 = { a: { b: {} } };
		o2.a.b.c = o2.a.b;
		var r = M.mergeExt(opts, o1, o2);
		assert.ok(r == o1);
	});

	it('merging sample', function(){
		var target  = { t: 1, x: { y: 'z' } },
			source1 = { t: { s1: /source1/ }, x: null },
			source2 = { t: { s2: new Date(100) } };

		var res = M.mergeExt({ ignoreNull: true }, target, source1, source2);
		var exp = { t: { s1: /source1/, s2: new Date(100) }, x: { y: 'z' } };
		//~ console.log(res)
		assert.deepEqual(res, exp);
	});

});

describe('#clone', function(){
	it('deep clone object', function(){
		var o = { a: { b: { c: { d: 1 } } } };
		var r = M.clone(o);
		assert.deepEqual(r, o);
		assert.ok(r !== o);
		assert.ok(r.a !== o.a);
		assert.ok(r.a.b !== o.a.b);
		assert.ok(r.a.b.c !== o.a.b.c);
	});
	it('deep clone array', function(){
		var o = [ {a: { b:1 } }, {b:2}, {c:3} ];
		var r = M.clone(o);
		assert.deepEqual(r, o);
		assert.ok(r !== o);
		assert.ok(r[0] !== o[0]);
		assert.ok(r[0].a !== o[0].a);
	});
	it('clone sample', function(){
		var obj = { a: { b: { c: 1 } } };
		var cloned = M.clone(obj);
		assert.ok(cloned !== obj)
		assert.ok(cloned.a !== obj.a)
		assert.ok(cloned.a.b !== obj.a.b)
	});

});

describe('#deepEqual', function(){
	it('boolean equal', function(){
		var a = true;
		var b = true;
		assert.ok(M.deepEqual(a, b));
	});
	it('boolean not equal', function(){
		var a = true;
		var b = false;
		assert.ok(!M.deepEqual(a, b));
	});
	it('number equals', function(){
		var a = 0;
		var b = 0;
		assert.ok(M.deepEqual(a, b));
	});
	it('number not equals', function(){
		var a = 1;
		var b = 0;
		assert.ok(!M.deepEqual(a, b));
	});
	it('undefined equals', function(){
		var a;
		var b;
		assert.ok(M.deepEqual(a, b));
	});
	it('compare undefined with null', function(){
		var a = null;
		var b;
		assert.ok(M.deepEqual(a, b));
	});
	it('compare object references', function(){
		var a = { a: { b: { c: 1 }, d: 2 } };
		var b = a;
		assert.ok(M.deepEqual(a, b));
	});
	it('deep compare objects', function(){
		var a = { a: { b: { c: 1 }, d: 2 } };
		var b = { a: { b: { c: 1 }, d: 2 } };
		assert.ok(M.deepEqual(a, b));
	});
	it('deep compare mixed objects', function(){
		var a = { a: { b: { c: [ 1, 1, 2, 3 ] }, d: 2, e: null } };
		var b = { a: { b: { c: [ 1, 1, 2, 3 ] }, d: 2, e: undefined } };
		assert.ok(M.deepEqual(a, b));
	});
	it('deep compare prototype objects', function(){
		var a = { a: 1 };
		a.prototype = { a: {}, d: 2, e: undefined };
		var b = { a: 1 };
		b.prototype = { a: {}, d: 2, e: undefined };
		assert.ok(!M.deepEqual(a, b));
	});
});

describe('#pick', function(){
	it('pick a and d using Array', function(){
		var o = { a:1, b:2, c:3, d:4 };
		var e = { a:1, d:4 };
		var r = M.pick(o, ['a', 'd']);
		assert.deepEqual(r, e);
	});
	it('pick a and d using String', function(){
		var o = { a:1, b:2, c:3, d:4 };
		var e = { a:1, d:4 };
		var r = M.pick(o, 'a,d');
		assert.deepEqual(r, e);
	});
	it('pick a and d using String with spaces', function(){
		var o = { a:1, b:2, c:3, d:4 };
		var e = { a:1, d:4 };
		var r = M.pick(o, 'a, d ');
		assert.deepEqual(r, e);
	});
	it('pick only d using String', function(){
		var o = { a:1, b:2, c:3, d:4 };
		var e = { d:4 };
		var r = M.pick(o, 'd');
		assert.deepEqual(r, e);
	});
	it('pick a.b and c.d using String', function(){
		var o = { a: { a:1, b:2 }, c: { c:3, d:4 }, e: 5 };
		var e = { a: {b:2}, c: {d:4} };
		var r = M.pick(o, 'a.b, c.d');
		assert.deepEqual(r, e);
	});
	it('pick from empty object', function(){
		var o = {};
		var e = {};
		var r = M.pick(o, 'a,d');
		assert.deepEqual(r, e);
	});
	it('pick from null', function(){
		var o = null;
		var r = M.pick(o, 'a,d');
		assert.ok(r === undefined);
	});
	it('pick from String', function(){
		var o = '';
		var r = M.pick(o, 'a,d');
		assert.ok(r === undefined);
	});
});

describe('#omit', function(){
	it('omit a and d using Array', function(){
		var o = { a:1, b:2, c:3, d:4 };
		var e = { b:2, c:3 };
		var r = M.omit(o, ['a', 'd']);
		assert.deepEqual(r, e);
	});
	it('omit a and d using String', function(){
		var o = { a:1, b:2, c:3, d:4 };
		var e = { b:2, c:3 };
		var r = M.omit(o, 'a,d');
		assert.deepEqual(r, e);
	});
	it('omit only d using String', function(){
		var o = { a:1, b:2, c:3, d:4 };
		var e = { a:1, b:2, c:3 };
		var r = M.omit(o, 'd');
		assert.deepEqual(r, e);
	});
	it('omit a.b and c.d using String', function(){
		var o = { a: { a:1, b:2 }, c: { c:3, d:4 }, e: 5 };
		var e = { a: { a:1 }, c: { c:3 }, e: 5 };
		var r = M.omit(o, 'a.b, c.d');
		assert.deepEqual(r, e);
	});
	it('omit from empty object', function(){
		var o = {};
		var e = {};
		var r = M.omit(o, 'a,d');
		assert.deepEqual(r, e);
	});
	it('omit from null', function(){
		var o = null;
		var r = M.omit(o, 'a,d');
		assert.ok(r === undefined);
	});
	it('omit from String', function(){
		var o = '';
		var r = M.omit(o, 'a,d');
		assert.ok(r === undefined);
	});
});

describe('#select', function(){
	it('from a null object', function(){
		var obj = null;
		var res = M.select(obj, ["test", "test"] );
		assert.deepEqual(res, undefined);
	});
	it('with empty selectors', function(){
		var obj = {
			test: { a:1 }
		};
		var res = M.select(obj);
		assert.deepEqual(res, undefined);
	});
	it('select an existing object', function(){
		var obj = {
			test: {
				test: {
					test: { a: 1 }
				},
				test2: { b: 2 }
			}
		};
		var res = M.select(obj, 'test.test' );
		assert.deepEqual(res, {test: { a: 1 }});
	});
	it('select a 0 value from an existing object', function(){
		var obj = {
			test: {
				test: 0,
				test2: { b: 2 }
			}
		};
		var res = M.select(obj, ["test", "test"] );

		assert.deepEqual(res, 0);
	});
	it('try select from undefined property', function(){
		var obj = {
			test: {
				test: 0,
				test2: { b: 2 }
			}
		};
		var res = M.select(obj, 'there.is.no.such.prop' );

		assert.deepEqual(res, undefined);
	});
});

describe('#util', function(){
	it('isObject', function(){
		assert.ok(M.util.isObject({}));
	});
});
