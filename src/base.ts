import base58 from 'bs58';

export type ChecksumFn = (payload: Uint8Array) => Uint8Array;

export interface Bs58CheckResult {
    encode: (payload: Uint8Array) => string;
    decode: (str: string) => Uint8Array;
    decodeUnsafe: (str: string) => Uint8Array | undefined;
}

export function bs58checkBase(checksumFn: ChecksumFn): Bs58CheckResult {
    function encode(payload: Uint8Array): string {
        const checksum = checksumFn(payload);
        const length = payload.length + 4;
        const both = new Uint8Array(length);
        both.set(payload, 0);
        both.set(checksum.subarray(0, 4), payload.length);
        return base58.encode(both);
    }

    function decodeRaw(buffer: Uint8Array): Uint8Array | undefined {
        const payload = buffer.slice(0, -4);
        const checksum = buffer.slice(-4);
        const newChecksum = checksumFn(payload);

        if (
            (checksum[0] ^ newChecksum[0]) |
            (checksum[1] ^ newChecksum[1]) |
            (checksum[2] ^ newChecksum[2]) |
            (checksum[3] ^ newChecksum[3])
        ) {
            return undefined;
        }

        return payload;
    }

    function decodeUnsafe(str: string): Uint8Array | undefined {
        const buffer = base58.decodeUnsafe(str);
        if (buffer === undefined) return undefined;

        return decodeRaw(buffer);
    }

    function decode(str: string): Uint8Array {
        const buffer = base58.decode(str);
        const payload = decodeRaw(buffer);
        if (payload === undefined) throw new Error('Invalid checksum');
        return payload;
    }

    return {
        encode,
        decode,
        decodeUnsafe,
    };
}
