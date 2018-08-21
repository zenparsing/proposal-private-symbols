const syntaxClassProps = require('@babel/plugin-syntax-class-properties').default;

/*

This plugin converts all underscore-prefixed property names into computed
property names where the property name expression evaluates to a generated
private symbol.

*/


function underscoreToPrivatePlugin({ types: t }) {

  function getSymbolIdentifier(path, names) {
    let name = '';
    switch (path.node.type) {
      case 'Identifier': name = path.node.name; break;
      case 'StringLiteral': name = path.node.value; break;
    }

    if (!name.startsWith('_')) {
      return null;
    }

    let symbolName = names.get(name);
    if (symbolName) {
      return t.identifier(symbolName);
    }

    let { scope } = path;
    while (scope.parent) {
      scope = scope.parent;
    }

    let ident = scope.generateUidIdentifier(name);
    names.set(name, ident.name);

    scope.push({
      id: t.identifier(ident.name),
      init: t.callExpression(
        t.memberExpression(
          t.identifier('Symbol'),
          t.identifier('private')
        ),
        [t.stringLiteral(name.slice(1))],
      ),
    });

    return ident;
  }

  function visitObjectMember(path, names) {
    let name = getSymbolIdentifier(path.get('key'), names);
    if (name) {
      path.node.computed = true;
      path.node.key = name;
    }
  }

  return {

    inherits: syntaxClassProps,

    pre() {
      this.names = new Map();
    },

    visitor: {

      MemberExpression(path) {
        let name = getSymbolIdentifier(path.get('property'), this.names);
        if (name) {
          path.node.computed = true;
          path.node.property = name;
        }
      },

      BinaryExpression(path) {
        let { node } = path;
        if (node.operator === 'in' && node.left.type === 'StringLiteral') {
          let name = getSymbolIdentifier(path.get('left'), this.names);
          if (name) {
            node.left = name;
          }
        }
      },

      ObjectMember(path) {
        visitObjectMember(path, this.names);
      },

      ObjectMethod(path) {
        visitObjectMember(path, this.names);
      },

      ClassMethod(path) {
        visitObjectMember(path, this.names);
      },

      ClassProperty(path) {
        visitObjectMember(path, this.names);
      },

    },
  };
}

module.exports = underscoreToPrivatePlugin;
