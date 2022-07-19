const jsigs = require('jsonld-signatures');
const {purposes: {AssertionProofPurpose}} = jsigs;
const { EcdsaSecp256k1VerificationKey2019 } = require('@bloomprotocol/ecdsa-secp256k1-verification-key-2019');
const { EcdsaSecp256k1Signature2019 } = require('@bloomprotocol/ecdsa-secp256k1-signature-2019');
import { securityLoader } from '@digitalbazaar/security-document-loader';
import bs58 from 'bs58';
import keyto from '@trust/keyto';
import secp256k1 from 'secp256k1';
import { Buffer as BufferPolyfill } from 'buffer';
const buffer = typeof Buffer === 'undefined' ? BufferPolyfill : Buffer;

import credential from './data/cert-secp256k1.json';
import didDocument from './data/did-secp256k1.json';
import blockcertsContextV3 from './data/contexts/blockcerts-v3.json';
import blockcertsContextV31 from './data/contexts/blockcerts-v3.1.json';
import merkleProof2019Context from './data/contexts/merkle-proof-2019.json';
import chainedProof2021Context from './data/contexts/chained-proof-2021.json';

function currentTime () {
  return new Date(Date.now()).toISOString();
}

function generateDocumentLoader (documentsToPreload = []) {
  const documentLoader = securityLoader();
  documentsToPreload.forEach(document => {
    const key = Object.keys(document)[0];
    documentLoader.addStatic(key, document[key]);
  });
  documentLoader.addStatic('https://w3id.org/blockcerts/v3', blockcertsContextV3);
  documentLoader.addStatic('https://w3id.org/security/suites/merkle-2019/v1', merkleProof2019Context);
  documentLoader.addStatic('https://w3id.org/security/suites/chained-2021/v1', chainedProof2021Context);
  documentLoader.addStatic('https://w3id.org/blockcerts/v3.1', blockcertsContextV31);
  return documentLoader.build();
}

const publicKeyHexFromJwk = (jwk) => {
  const uncompressedPublicKey = keyto
    .from(
      {
        ...jwk,
        crv: 'K-256'
      },
      'jwk'
    )
    .toString('blk', 'public');

  const compressed = secp256k1.publicKeyConvert(
    buffer.from(uncompressedPublicKey, 'hex'),
    true
  );
  return buffer.from(compressed).toString('hex');
};

export const publicKeyBase58FromPublicKeyHex = (publicKeyHex) => {
  return bs58.encode(buffer.from(publicKeyHex, 'hex'));
};

export async function verifyCredential () {
  const verificationMethod = didDocument.verificationMethod
    .find(verificationMethod => verificationMethod.id === credential.proof.verificationMethod);

  console.log('verification method', verificationMethod);

  if (!verificationMethod) {
    throw new Error('The verification method of the document does not match the provided issuer.');
  }

  if (verificationMethod.publicKeyJwk && !verificationMethod.publicKeyBase58) {
    const hexKey = publicKeyHexFromJwk(verificationMethod.publicKeyJwk);
    verificationMethod.publicKeyBase58 = publicKeyBase58FromPublicKeyHex(hexKey);
  }

  const verificationKey = await EcdsaSecp256k1VerificationKey2019.from({
    ...verificationMethod
  });

  if (verificationKey.revoked) {
    throw new Error('The verification key has been revoked');
  }

  const suite = new EcdsaSecp256k1Signature2019({ key: verificationKey });
  suite.date = currentTime();

  const verificationStatus = await jsigs.verify(credential, {
    suite,
    purpose: new AssertionProofPurpose(),
    documentLoader: generateDocumentLoader([{
      [verificationMethod.controller]: didDocument
    }])
  });

  if (!verificationStatus.verified) {
    console.log(JSON.stringify(verificationStatus, null, 2));
    throw new Error('Error validating the revocation list credential proof');
  } else {
    console.log('Credential successfully verified');
    return verificationStatus;
  }
}
