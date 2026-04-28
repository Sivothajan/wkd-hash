import test from 'node:test';
import assert from 'node:assert/strict';

import { wkdHash } from '../dist/index.js';
import fixtures from './vectors.json' with { type: 'json' };

for (const fixture of fixtures) {
  test(`wkdHash hashes ${JSON.stringify(fixture.input)}`, async () => {
    assert.equal(await wkdHash(fixture.input), fixture.expected);
  });
}

test('wkdHash normalizes case and surrounding whitespace', async () => {
  assert.equal(
    await wkdHash('  USER@Example.com  '),
    await wkdHash('user@example.com')
  );
});

test('wkdHash uses only the local-part for email addresses', async () => {
  assert.equal(
    await wkdHash('user@example.com'),
    await wkdHash('user@another.example')
  );
});

test('wkdHash supports unicode local-parts', async () => {
  assert.equal(await wkdHash('Müller@example.com'), await wkdHash('müller'));
});

test('wkdHash returns a 32-character z-base-32 hash', async () => {
  const hash = await wkdHash('user@example.com');

  assert.notEqual(hash, null);
  assert.equal(hash.length, 32);
  assert.match(hash, /^[ybndrfg8ejkmcpqxot1uwisza345h769]{32}$/);
});

test('wkdHash hashes empty normalized input consistently', async () => {
  assert.equal(await wkdHash(''), await wkdHash('   '));
});

test('wkdHash returns null for non-string input', async () => {
  assert.equal(await wkdHash(123), null);
});
