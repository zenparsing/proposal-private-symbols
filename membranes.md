# Private Symbols and Membranes

## Definitions

A **secure membrane** is a boundary between object graphs `A` and `B` such that:

- No objects in `A` hold a direct reference to an object in `B`
- No objects in `B` hold a direct reference to an object in `A`
- All data flow between `A` and `B` is mediated by code associated with the membrane

A **shadow target** is a proxy target, distinct from the wrapped object, used by a membrane-proxy to record object model stability claims for the purpose of invariant enforcement.

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
