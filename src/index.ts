import type { webcrypto } from 'node:crypto';

const Z_BASE_32_ALPHABET = 'ybndrfg8ejkmcpqxot1uwisza345h769';
const EMAIL_LOCAL_PART_PATTERN = /^([^@]+)@/;

/**
 * Compute the WKD z-base-32 hash for an email or username.
 * If an email address is provided, only the local-part is hashed.
 */
export async function wkdHash(input: string): Promise<string | null> {
  if (typeof input !== 'string') {
    return null;
  }

  const normalizedInput = normalizeInput(input);
  const digest = await sha1Digest(await encodeUtf8(normalizedInput));

  return encodeZBase32(digest);
}

function normalizeInput(input: string): string {
  const trimmed = input.trim();
  const emailMatch = trimmed.match(EMAIL_LOCAL_PART_PATTERN);

  return (emailMatch?.[1] ?? trimmed).toLowerCase();
}

async function sha1Digest(data: Uint8Array): Promise<Uint8Array> {
  const subtle = await getSubtleCrypto();
  const buffer = new ArrayBuffer(data.byteLength);
  new Uint8Array(buffer).set(data);
  const digest = await subtle.digest('SHA-1', buffer);

  return new Uint8Array(digest);
}

function encodeZBase32(bytes: Uint8Array): string {
  let bits = '';
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0');
  }

  let output = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);
    if (chunk.length === 5) {
      output += Z_BASE_32_ALPHABET[parseInt(chunk, 2)];
    }
  }

  return output;
}

async function getSubtleCrypto(): Promise<
  SubtleCrypto | webcrypto.SubtleCrypto
> {
  if (globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }

  try {
    const mod = await import('node:crypto');
    if (mod.webcrypto?.subtle) {
      return mod.webcrypto.subtle;
    }
  } catch {
    // Fall through to the final error for a cleaner library surface.
  }

  throw new Error('Web Crypto subtle API not available in this environment');
}

async function encodeUtf8(text: string): Promise<Uint8Array> {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(text);
  }

  try {
    const util = await import('node:util');
    if (util.TextEncoder) {
      return new util.TextEncoder().encode(text);
    }
  } catch {
    // Fall through to the final error for a cleaner library surface.
  }

  throw new Error('TextEncoder not available in this environment');
}
