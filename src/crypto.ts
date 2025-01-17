import { encode, toHEX } from 'worktop/utils';
import type { Algorithms } from 'worktop/crypto';

export function digest(algo: Algorithms.Digest, message: string): Promise<string> {
	return crypto.subtle.digest(algo, encode(message)).then(toHEX);
}

export const SHA1   = /*#__PURE__*/ digest.bind(0, 'SHA-1');
export const SHA256 = /*#__PURE__*/ digest.bind(0, 'SHA-256');
export const SHA384 = /*#__PURE__*/ digest.bind(0, 'SHA-384');
export const SHA512 = /*#__PURE__*/ digest.bind(0, 'SHA-512');

export function keyload(algo: Algorithms.Keying, secret: string, scopes: KeyUsage[]): Promise<CryptoKey> {
	return crypto.subtle.importKey('raw', encode(secret), algo, false, scopes);
}

export function keygen(algo: Algorithms.Keying, scopes: KeyUsage[], extractable = false): Promise<CryptoKey|CryptoKeyPair> {
	return crypto.subtle.generateKey(algo, extractable, scopes);
}

export function sign(algo: Algorithms.Signing, key: CryptoKey, payload: string): Promise<ArrayBuffer> {
	return crypto.subtle.sign(algo, key, encode(payload));
}

export function verify(algo: Algorithms.Signing, key: CryptoKey, payload: string, signature: ArrayBuffer): Promise<boolean> {
	return crypto.subtle.verify(algo, key, signature, encode(payload));
}

export async function PBKDF2(digest: Algorithms.Digest, password: string, salt: string, iters: number, length: number): Promise<ArrayBuffer> {
	const key = await keyload('PBKDF2', password, ['deriveBits']);

	const algo: Pbkdf2Params = {
		name: 'PBKDF2',
		salt: encode(salt),
		iterations: iters,
		hash: digest,
	};

	return crypto.subtle.deriveBits(algo, key, length << 3);
}
