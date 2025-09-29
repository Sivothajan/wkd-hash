/**
 * Compute WKD-style hash for an email or username
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

  // SHA-1 of the UTF-8 local part
  const encoder = new TextEncoder();
  const data = encoder.encode(localPart);
  const sha1buf = await crypto.subtle.digest("SHA-1", data);
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

// Example usage:
wkdHash("hi@sivothajan.me").then((hash) => {
  console.log("For email (hi@sivothajan.me):", hash);
});
// → e.g. 'aeii9rmagouy1owpp7e5ftpxjof7h41n'
wkdHash("hi").then((hash) => {
  console.log("For username (hi):", hash);
});
// → e.g. 'aeii9rmagouy1owpp7e5ftpxjof7h41n'
