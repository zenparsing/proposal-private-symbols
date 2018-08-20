import syntaxClassProps from '@babel/plugin-syntax-class-properties';

export default function({ types: t }) {
  function getSymbolIdentifier(path, names) {
    let name = '';
    switch (path.node.type) {
      case 'Identifier': name = path.node.name; break;
      case 'StringLiteral': name = path.node.value; break;
    }

    if (name.startsWith('_')) {
      let ident = names.get(name);
      if (ident) {
        return t.identifier(ident.name);
      }

      let { scope } = path;
      while (scope.parent) {
        scope = scope.parent;
      }

      ident = scope.generateUidIdentifier(name);
      names.set(name, ident);

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

    return null;
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
