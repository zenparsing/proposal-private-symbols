# ECMA262 Specification Changes

## Changes to the Symbol Type

### 6.1.5 The Symbol Type

Add the following item to the description of the Symbol type:

- Each Symbol value immutably holds a value called [[Private]] that is either **true** or **false**.

### 6.1.5.1 Well-Known Symbols

Add a clause specifying that well-known symbols have a [[Private]] value of **false**.

## Changes to OwnPropertyKeys

### 6.1.7.3 Invariants of the Essential Internal Methods

#### [[OwnPropertyKeys]] ( )

Add the following item to the list of invariants:

- The returned list must not contain any symbols whose [[Private]] value is **true**.

### 9.1.11.1 OrdinaryOwnPropertyKeys ( _O_ )

Modify step 4:

- For each own property key _P_ of _O_ that is a Symbol, in ascending chronological order of property creation, do
  - If _P_'s [[Private]] value is **false**, add _P_ as the last element of _keys_.

Update identical steps for exotic object [[OwnPropertyKeys]]:

- 9.4.3.3 (String)
- 9.4.5.6 (Integer-Indexed)

## Changes to Proxy Internal Methods

### 9.5.5 [[GetOwnProperty]] ( _P_ )

Add after step 5:

- If Type(_P_) is Symbol and  _P_'s [[Private]] value is **true**, then
  - Let _trap_ be **undefined**.
- Else,
  - Let _trap_ be ? GetMethod(_handler_, **"getOwnPropertyDescriptor"**).

Update similar steps for the following internal methods:

- 9.5.6 [[DefineOwnProperty]] ( P, Desc )
- 9.5.7 [[HasProperty]] ( P )
- 9.5.8 [[Get]] ( P, Receiver )
- 9.5.9 [[Set]] ( P, V, Receiver )
- 9.5.10 [[Delete]] ( P )

### 9.5.11 [[OwnPropertyKeys]] ( )

Add after step 9:

- If _trapResult_ contains any Symbol values whose [[Private]] value is **true**, throw a **TypeError** exception.

Add the following item to the note:

- The returned List contains no Symbol values whose [[Private]] value is **true**.

## Changes to the Symbol API

### 19.4.1.1 Symbol ( [ _description_ ] )

Modify step 4:

- Return a new unique Symbol value whose [[Description]] value is _descString_ and whose [[Private]] value is **false**.

### 19.4.2 Properties of the Symbol Constructor

#### Symbol.private ( _description_ )

- If NewTarget is not **undefined**, throw a **TypeError** exception.
- If _description_ is **undefined**, let _descString_ be **undefined**.
- Else, let _descString_ be ? ToString(_description_).
- Return a new unique Symbol value whose [[Description]] value is _descString_ and whose [[Private]] value is **true**.

### 19.4.3 Properties of the Symbol Prototype Object

#### get Symbol.prototype.private

- Let _sym_ be ? thisSymbolValue(**this** value).
- Let _isPrivate_ be _sym_'s [[Private]] value.
- Assert: Type(_isPrivate_) is Boolean.
- Return _isPrivate_.
