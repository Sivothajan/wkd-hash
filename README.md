# wkd-hash

Generate WKD-style hashes for email addresses and usernames. Works in browsers and Node.js.

- ESM-only package
- Node >= 16 (uses Web Crypto or Node's `webcrypto`)
- Zero deps, ships TypeScript types

## Install

```sh
npm install wkd-hash
```

## Usage

### Node.js (ESM)

```js
import { wkdHash } from 'wkd-hash';

const hash = await wkdHash('hi@example.com');
console.log(hash); // "aeii9rmagouy1owpp7e5ftpxjof7h41n"
```

### Node.js (CommonJS via dynamic import)

This package is ESM-only. From CommonJS, use a dynamic import:

```js
(async () => {
  const { wkdHash } = await import('wkd-hash');
  const hash = await wkdHash('hi');
  console.log(hash); // "aeii9rmagouy1owpp7e5ftpxjof7h41n"
})();
```

### Browser

Use via a bundler, or import directly from a CDN that supports ESM:

```html
<script type="module">
  import { wkdHash } from 'https://cdn.jsdelivr.net/npm/wkd-hash/+esm';
  const hash = await wkdHash('user@example.com');
  console.log(hash);
</script>
```

## API

- `async function wkdHash(input: string): Promise<string | null>`
  - Returns the WKD z-base-32 encoded SHA-1 hash of the lowercased local-part.
  - If `input` contains `@`, only the part before `@` is used; otherwise the whole string is used.
  - Returns `null` if `input` is not a string.

TypeScript types are included:

```ts
export declare function wkdHash(input: string): Promise<string | null>;
```

## Examples

- `wkdHash('hi@example.com')` → `aeii9rmagouy1owpp7e5ftpxjof7h41n`
- `wkdHash('hi')` → `aeii9rmagouy1owpp7e5ftpxjof7h41n` (same as above, only local-part is hashed)

## How it works

- Trim and lowercase the input
- Extract the local part (before `@`) if the input looks like an email
- Compute `SHA-1` over the UTF-8 bytes of the local-part
- Encode the resulting 20-byte digest using z-base-32 with alphabet:
  `ybndrfg8ejkmcpqxot1uwisza345h769`

Web Crypto is used when available (`globalThis.crypto.subtle`), falling back to Node's `crypto.webcrypto.subtle` when running in Node.

## Notes

- ESM-only: if you need CommonJS, use dynamic `import()` as shown above or set up a small wrapper.
- Environment requirements: modern browsers or Node >= 16. For best results and native `globalThis.crypto`, use Node 20+.

---

## License

[MIT](LICENSE) © [Sivothayan Sivasiva](https://sivothayan.com)
