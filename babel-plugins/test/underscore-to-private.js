import * as babel from '@babel/core';

{
  let result = babel.transform(`
    class C {
      _foo = 1;
      constructor() {
        this._foo = 2;
      }

      _m() {

      }
    }
  `, { plugins: ['./src/underscore-to-private.js'] });

  console.log(result.code);

}
