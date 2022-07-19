import * as base58 from 'base58-universal';

function stringToUint8Array (data) {
  if (typeof data === 'string') {
    // convert data to Uint8Array
    return new TextEncoder().encode(data);
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError('"data" be a string or Uint8Array.');
  }
  return data;
}

export function exampleDecode () {
  return base58
    .decode(new TextDecoder('utf-8')
      .decode(stringToUint8Array('zQmR7NGj4Lvqz18qubNdcFxDAG3thfKEHMGNu77FMHUHfuT').slice(1))
    );
}
