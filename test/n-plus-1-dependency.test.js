import {verifyCredential} from "../src/n-plus-1-dependency";

describe('N+1 dependency', function () {
  it('should work', async function () {
    const output = await verifyCredential();
    // modify node_modules/@bloomprotocol/ecdsa-secp256k1-verification-key-2019/dist/ecdsa-secp256k1-verification-key-2019.cjs.development.js
    // line 187, in the catch, get the error variable and console log it in the block: 
    // ReferenceError: Cannot access 'alphabet' before initialization
    //           at Object.decode (/Users/julien/work/repro-base58-jest/node_modules/@bloomprotocol/ecdsa-secp256k1-verification-key-2019/node_modules/base58-universal/main.js:19:25)
    //           at Object.decode (/Users/julien/work/repro-base58-jest/node_modules/@bloomprotocol/ecdsa-secp256k1-verification-key-2019/src/verificationKey.ts:212:20)
    //           at EcdsaSecp256k1Signature2019.verify [as verifySignature] (/Users/julien/work/repro-base58-jest/node_modules/@bloomprotocol/ecdsa-secp256k1-signature-2019/src/index.ts:102:21)
    //           at EcdsaSecp256k1Signature2019.verifyProof (/Users/julien/work/repro-base58-jest/node_modules/jsonld-signatures/lib/suites/LinkedDataSignature.js:180:35)
    //           at processTicksAndRejections (node:internal/process/task_queues:96:5)
    //           at /Users/julien/work/repro-base58-jest/node_modules/jsonld-signatures/lib/ProofSet.js:236:53
    //           at async Promise.all (index 0)
    //           at _verify (/Users/julien/work/repro-base58-jest/node_modules/jsonld-signatures/lib/ProofSet.js:224:3)
    //           at ProofSet.verify (/Users/julien/work/repro-base58-jest/node_modules/jsonld-signatures/lib/ProofSet.js:152:23)
    //           at Object.verify (/Users/julien/work/repro-base58-jest/node_modules/jsonld-signatures/lib/jsonld-signatures.js:114:18)
    expect(output.verified).toBe(true);
  });
});
