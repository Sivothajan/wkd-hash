/**
 * Compute WKD-style hash for an email or username.
 * - Accepts an email (only the local part is used) or a username
 * - Lowercases input, hashes with SHA-1, encodes with z-base-32
 * - Works in browsers and Node.js (with webcrypto fallback)
 */
export async function wkdHash(input) {
  if (typeof input !== "string") return null;

  const trimmed = input.trim();
  let localPart;

  // If input looks like an email, use the local part
  const emailMatch = trimmed.match(/^([^@]+)@/);
  if (emailMatch) {
    localPart = emailMatch[1].toLowerCase();
  } else {
    // Otherwise, treat whole input as the local part
    localPart = trimmed.toLowerCase();
  }

  const subtle = await getSubtleCrypto();
  const data = await encodeUtf8(localPart);
  const sha1buf = await subtle.digest("SHA-1", data);
  const bytes = new Uint8Array(sha1buf);

  // z-base-32 encode
  const alphabet = "ybndrfg8ejkmcpqxot1uwisza345h769";
  let bits = "";
  bytes.forEach((b) => (bits += b.toString(2).padStart(8, "0")));

  let out = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);
    if (chunk.length === 5) {
      out += alphabet[parseInt(chunk, 2)];
    }
  }

  return out;
}

async function getSubtleCrypto() {
  // Prefer global crypto (browser, Node 20+)
  if (globalThis.crypto && globalThis.crypto.subtle)
    return globalThis.crypto.subtle;
  // Node fallback
  try {
    const mod = await import("node:crypto");
    if (mod?.webcrypto?.subtle) return mod.webcrypto.subtle;
  } catch (e) {
    // ignore
  }
  throw new Error("Web Crypto subtle API not available in this environment");
}

async function encodeUtf8(text) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(text);
  }
  try {
    const util = await import("node:util");
    const Encoder = util?.TextEncoder;
    if (Encoder) return new Encoder().encode(text);
  } catch (e) {
    // ignore
  }
  throw new Error("TextEncoder not available in this environment");
}
