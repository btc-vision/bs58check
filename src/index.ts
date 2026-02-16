import { sha256 } from '@noble/hashes/sha2.js';
import { bs58checkBase } from './base.js';

export type { ChecksumFn, Bs58CheckResult } from './base.js';
export { bs58checkBase } from './base.js';

function sha256x2(payload: Uint8Array): Uint8Array {
    return sha256(sha256(payload));
}

const { encode, decode, decodeUnsafe } = bs58checkBase(sha256x2);

export { encode, decode, decodeUnsafe };
export default { encode, decode, decodeUnsafe };
