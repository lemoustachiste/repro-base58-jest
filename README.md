Reproduction of the error

```
ReferenceError: Cannot access 'alphabet' before initialization
```

From base58-universal in a jest environment

## Run

```
    npm run test
```

The error is not visible as such, you need to edit `node_modules/@bloomprotocol/ecdsa-secp256k1-verification-key-2019/dist/ecdsa-secp256k1-verification-key-2019.cjs.development.js#187`, and log the error that's caught.

More details are available in the test `n-plus-1-dependency.test.js` (the one highlighting failure).
