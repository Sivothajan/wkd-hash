# wkd-hash

Generate WKD-style hashes for email addresses and usernames in Node.js,
browsers, and Bun.

- Dual-package output: ESM and CommonJS
- Node `>=18`
- Bun-compatible
- Zero runtime dependencies
- TypeScript types included

## Install

```sh
npm install wkd-hash
```

Also works for consumers using `pnpm`, `yarn`, or `bun`.

## What It Does

`wkdHash()` normalizes the input, keeps only the email local-part when an
address is passed, computes a SHA-1 digest, and encodes the result with the
z-base-32 alphabet used by WKD-style lookups.

## Usage

### Node.js ESM

```js
import { wkdHash } from 'wkd-hash';

const hash = await wkdHash('hi@example.com');
console.log(hash); // "aeii9rmagouy1owpp7e5ftpxjof7h41n"
```

### Node.js CommonJS

```js
const { wkdHash } = require('wkd-hash');

async function main() {
  const hash = await wkdHash('hi@example.com');
  console.log(hash); // "aeii9rmagouy1owpp7e5ftpxjof7h41n"
}

main();
```

### Browser

Use with a bundler, or import from an ESM-compatible CDN:

```html
<script type="module">
  import { wkdHash } from 'https://cdn.jsdelivr.net/npm/wkd-hash/+esm';

  const hash = await wkdHash('user@example.com');
  console.log(hash);
</script>
```

## API

```ts
declare function wkdHash(input: string): Promise<string | null>;
```

- Returns the WKD z-base-32 encoded SHA-1 hash of the lowercased local-part.
- If `input` contains `@`, only the part before `@` is used.
- If `input` does not contain `@`, the whole trimmed string is used.
- Returns `null` for non-string inputs as a defensive runtime fallback.

## Examples

```js
await wkdHash('hi@example.com');
// "aeii9rmagouy1owpp7e5ftpxjof7h41n"

await wkdHash('hi');
// "aeii9rmagouy1owpp7e5ftpxjof7h41n"

await wkdHash('  Hi@Example.com  ');
// "aeii9rmagouy1owpp7e5ftpxjof7h41n"
```

## Behavior Notes

- Input is trimmed before hashing.
- Input is lowercased before hashing.
- Only the local-part of an email address is hashed.
- Unicode input is supported.
- The output is always a 32-character z-base-32 string when hashing succeeds.

## Runtime Support

- Node.js: native `import` and CommonJS `require()`
- Browsers: modern browsers with Web Crypto
- Bun: supported

Web Crypto is used when available via `globalThis.crypto.subtle`, with a
fallback to Node's `crypto.webcrypto.subtle`.

## Development

This repository uses Bun as the primary local development tool, while Node
compatibility is verified in CI.

```sh
bun install
bun run lint
bun run typecheck
bun run typecheck:test
bun run test:bun
npm run test:node
npm run check:pack
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local workflow, quality checks, and
release expectations.

## License

[MIT](LICENSE) © [Sivothayan Sivasiva](https://sivothayan.com)
