# Private Symbols and Membranes

## Definitions

A **secure membrane** is a boundary between object graphs `A` and `B` such that:

- No objects in `A` hold a direct reference to an object in `B`
- No objects in `B` hold a direct reference to an object in `A`
- All data flow between `A` and `B` is mediated by code associated with the membrane

A **shadow target** is a proxy target, distinct from the wrapped object, used by a membrane-proxy to record object model stability claims for the purpose of invariant enforcement. The **shadow target** is only accessible from its associated proxy.

## Claims

### C1. All objects reachable from the global scope of both `A` and `B` are frozen.

Assume that an object reachable from the global scope of both graphs is not frozen. Then code in `A` can store a reference to an object in `A` by adding a property to an object reachable from the global scope. Code in `B` can then read that property and obtain a direct reference to an object in `A`.

### C2. No objects in `A` or `B` hold a direct reference to a membrane-proxy wrapping an object in its own graph.

Assume that an object in `A` has a reference to a membrane-proxy that wraps an object in `A`.

- Let `P_a1` be the membrane-proxy that wraps `a1`.
- Let `a2` be a different object in `A`.
- Code in `A` performs `P_a1.[[Set]](a2, "$")`.
- `P_a1` thinks that `a2` is an object in `B` and wraps it in a proxy `P_a2` before sending it to `a1`.
- Let `P_b1` be the membrane-proxy for an object `b1` in `B`.
- Responding to the set operation, `a1` performs `P_b1.[[Set]](P_a2, "$")`,
- The proxy `P_b1` unwraps `P_a2` and sends `a2` to `b1`.
- `b1` now has a direct reference to `a2`.

### C4. No object in `A` can read or write to a private-symbol-named property of a shadow target for an object in `A`

Since the shadow target is not accessible outside of its associated membrane-proxy, the only way to read or write private-symbol named properties on a shadow target is through a direct reference to the membrane-proxy. But by **C2** no object in `A` holds a direct reference to a membrane-proxy wrapping an object in `A`.

### C5. A secure membrane whose proxies use shadow targets remains secure when a private symbol is passed between `A` and `B`.

Assume that a private symbol `pSym` is passed from `A` to `B` and that an object in `B` has obtained a direct reference to an object in `A`. Then `pSym` must have been used to obtain the reference by application to one of the following:

1. A shared global reference
1. An object in `B`
1. A membrane-proxy for an object in `A`

If `pSym` was used against a shared global reference, then the global reference was not frozen prior to code from `A` executing. By **C1**, this not possible for a secure membrane.

If `pSym` was used against an object in `B`, then an object in `B` would have already had a direct reference to an object in `A`. But this is not possible since the membrane was secure.

If `pSym` was used against a membrane-proxy for an object in `A`, then the proxy's shadow target would have already had direct reference to an object in `A` stored in a private-symbol named property. Code in `A` must have placed it there. But by **C4**, this is not possible for a secure membrane.
