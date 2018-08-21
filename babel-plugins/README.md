# Babel Plugins

## underscore-to-private

Converts underscore property names into computed property names backed by a private symbol.

The following code:

```js

class Point {

  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  toString() {
    return `<${ this._x }:${ this._y }>`;
  }

  add(other) {
    return new Point(this._x + other._x, this._y + other._y);
  }

}

```

is transformed into:

```js
var _x = Symbol.private('x'),
    _y = Symbol.private('y');

class Point {

  constructor(x, y) {
    this[_x] = x;
    this[_y] = y;
  }

  toString() {
    return `<${ this[_x] }:${ this[_y] }>`
  }

  add(other) {
    return new Point(this[_x] + other[_x], this[_y] + other[_y]);
  }

}

```
