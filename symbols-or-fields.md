# Private Symbols, or Private Fields?

Private symbols were originally dropped from the ES6 specification because of the complexity that they introduced into the object model, particularly with respect to proxies. At the time, various mechanisms were proposed to allow some level of interaction between proxies and private symbols, but each of these mechanisms felt inelegant and unjustified. It seemed that by using WeakMap as the model for private state we could avoid those issues.

It turns out that we weren't able to eliminate object model complexity by pursuing the WeakMap model of private state. In fact, we've traded local complexity for global complexity. We've smoothed out a winkle in one corner of the language, only to find that we've pushed wrinkles into every other corner.

A private state model based on private symbols has the following advantages over private fields based on WeakMaps:

## A more general private state model

Unlike private fields, private symbols are not restricted to classes. In general, the language will be stronger if we do not create synthetic distinctions between objects created via class constructors and objects created any other way.

Can private fields be extended to object literals in the future? Given that fields are lexically scoped, it is difficult to see how objects created via literals can share access to private state without further complication of the private field model.

## Better support for cooperative objects (friends)

When using private state in JavaScript, friendship patterns within a single module are quite common. With private fields, the only way to support this use case is by introducing decorators. As such, decorators and private fields are tightly bound.

With private symbols, friendship is trivial: we simply use the same private symbol variable for any objects within the friendship relation.

## Better interaction with decorators

Decorators and private fields are tightly bound: the decorator proposal must reify the private field as a novel map-like object, and private fields need decorators in order to satisfy the core use case of "friendship". Furthermore, decorator functions must be prepared to accept a "key" parameter that is not actually a valid property key.

Private symbols, on the other hand, simply flow through decorators just like any other symbol key. There are no special rules that must be applied to support private state.

## A simpler private state object model

With private fields, users have to learn a new model of object state. They have to understand that for some kinds of member names prototype inheritance is applied, and for others it is not. They have to understand that for some kinds of names, proxies don't work, and for others they do. They have to understand that some names can throw a TypeError and others do not.

Private symbols do not require that the user learn anything new about the JavaScript object model. There are simply properties, and some of them can be hidden from reflection.

## A simpler model for private class methods

Private methods introduce an interesting question regarding the mental model of private state. Given that methods can be getters or setters, are private methods "properties" or are they "values"? Is private state more property-like or WeakMap-like? How is a user supposed to think about this?

Also, why is a method named with "#" installed on the instance, whereas a method named without "#" is installed on the prototype?

With private symbols there is nothing new to learn. Methods keyed with private symbols are regular properties installed on the prototype in the normal manner.

## Better interaction with static class fields

Private static fields introduce a well-known hazard: accessing a private static field through `this` will throw a `TypeError` if `this` is a subclass.

When accessing a property using private symbols the prototype chain is traversed and the hazard disappears.

## Better interaction with simple wrapping proxies

Users have developed patterns for proxy usage which do not require a full membrane. In these scenarios, proxies are used to wrap an application-domain object and intercede (by logging, for example) when code interacts with the object.

A simple wrapping proxy will fail when it attempts to wrap an object that has private fields. Because private field access is based on identity, a `TypeError` will be thrown when code attempts to access the private state of the proxy wrapper.

With private symbols, access is forwarded directly to the proxy target, allowing simple wrapping proxies to function as expected.

## A better platform for generalized symbol-name syntactic sugar

If we're going to have syntactic sugar for names, why not have sugar for regular symbols too?
