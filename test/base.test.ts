import { describe, it, expect } from 'vitest';
import { blake2b } from '@noble/hashes/blake2.js';
import { hexToBytes } from '@noble/hashes/utils.js';
import { bs58checkBase } from '../build/base.js';

function blake256x2(payload: Uint8Array): Uint8Array {
    const first = blake2b(payload, { dkLen: 32 });
    return blake2b(first, { dkLen: 32 });
}

const bs58check = bs58checkBase(blake256x2);

describe('bs58checkBase with custom checksum', () => {
    it('encodes and decodes with custom blake2b checksum', () => {
        const payload = hexToBytes('073f0415e993935a68154fda7018b887c4e3fe8b4e10');

        const encoded = bs58check.encode(payload);
        const decoded = bs58check.decode(encoded);
        expect(decoded).toEqual(payload);
    });

    it('decodeUnsafe returns result for valid input', () => {
        const payload = hexToBytes('073f0415e993935a68154fda7018b887c4e3fe8b4e10');
        const encoded = bs58check.encode(payload);
        const decoded = bs58check.decodeUnsafe(encoded);
        expect(decoded).toBeDefined();
        expect(decoded).toEqual(payload);
    });

    it('decodeUnsafe returns undefined for tampered input', () => {
        const payload = hexToBytes('073f0415e993935a68154fda7018b887c4e3fe8b4e10');
        const encoded = bs58check.encode(payload);
        const tampered = 'A' + encoded.slice(1);
        const decoded = bs58check.decodeUnsafe(tampered);
        expect(decoded).toBeUndefined();
    });
});
