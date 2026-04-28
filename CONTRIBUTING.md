# Contributing

Thanks for contributing to `wkd-hash`.

## Development Setup

This repository uses Bun as the primary local development tool.

```sh
bun install
```

## Quality Checks

Run these before opening a pull request:

```sh
bun run lint
bun run typecheck
bun run typecheck:test
bun run test:bun
npm run test:node
npm run check:pack
```

## Project Expectations

- Keep the public API small and predictable.
- Preserve compatibility with Bun, Node, and browser ESM environments.
- Add or update tests for any behavior change, especially hashing edge cases.
- Avoid adding runtime dependencies unless there is a strong reason.

## Releases

- Versioning is managed with Changesets.
- CI validates Bun-based development checks and Node runtime compatibility.
- Publishing uses GitHub Actions with npm trusted publishing.
