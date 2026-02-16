import { describe, it, expect } from 'vitest';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { encode, decode, decodeUnsafe } from '../build/index.js';
import fixtures from './fixtures.json';

const { valid, invalid } = fixtures;

describe('bs58check', () => {
    describe('decode', () => {
        for (const f of valid) {
            it(`decodes ${f.string}`, () => {
                const actual = bytesToHex(decode(f.string));
                expect(actual).toBe(f.payload);
            });
        }
    });

    describe('decodeUnsafe', () => {
        for (const f of valid) {
            it(`decodes ${f.string}`, () => {
                const result = decodeUnsafe(f.string);
                expect(result).toBeDefined();
                expect(bytesToHex(result!)).toBe(f.payload);
            });
        }
    });

    describe('decode invalid', () => {
        for (const f of invalid) {
            it(`throws on ${f.string}`, () => {
                expect(() => decode(f.string)).toThrow(new RegExp(f.exception));
            });

            it(`returns undefined for ${f.string}`, () => {
                expect(decodeUnsafe(f.string)).toBeUndefined();
            });
        }
    });

    describe('encode', () => {
        for (const f of valid) {
            it(`encodes ${f.string}`, () => {
                const u8 = hexToBytes(f.payload);
                const actual = encode(u8);
                expect(actual).toBe(f.string);
            });
        }
    });
});
