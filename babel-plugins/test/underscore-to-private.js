const babel = require('@babel/core');
const diff = require('diff');
const colors = require('colors');
const assert = require('assert');

function test(literals) {
  let [input, output] = literals[0].split(/\/\/=+/).map(s => s.trim());

  let { code } = babel.transform(input, {
    plugins: ['./src/underscore-to-private.js'],
  });

  let result = diff.diffChars(code, output);
  if (!result.some(part => (part.added || part.removed) && part.value.trim())) {
    return;
  }

  console.log(
    result.map(part => {
      let color = part.added ? 'green' : part.removed ? 'red' : 'grey';
      return part.value[color];
    }).join('')
  );

  assert.ok(false);
}

test`

class C {
  _foo = 1;

  constructor() {
    this._foo = 2;
  }

  _m() {
    ('_foo' in this);
  }
}

//=============

var _foo = Symbol.private("foo"),
  _m = Symbol.private("m");

class C {
  [_foo] = 1;

  constructor() {
    this[_foo] = 2;
  }

  [_m]() {
    _foo in this;
  }

}

`;

test`

let obj = {
  _x: 1,
  _y: 2,
  _z() { this['_x'] },
  get _a() {},
  '_b': 3,
}

//================

var _x = Symbol.private("x"),
    _y = Symbol.private("y"),
    _z = Symbol.private("z"),
    _a = Symbol.private("a"),
    _b = Symbol.private("b");

let obj = {
  [_x]: 1,
  [_y]: 2,

  [_z]() {
    this[_x];
  },

  get [_a]() {},

  [_b]: 3

};

`
