const test = require('node:test');
const assert = require('node:assert/strict');

const { wkdHash } = require('../dist/index.cjs');
const fixtures = require('./vectors.json');

for (const fixture of fixtures) {
  test(`wkdHash require() hashes ${JSON.stringify(fixture.input)}`, async () => {
    assert.equal(await wkdHash(fixture.input), fixture.expected);
  });
}

test('wkdHash require() normalizes case and surrounding whitespace', async () => {
  assert.equal(
    await wkdHash('  USER@Example.com  '),
    await wkdHash('user@example.com')
  );
});

test('wkdHash require() uses only the local-part for email addresses', async () => {
  assert.equal(
    await wkdHash('user@example.com'),
    await wkdHash('user@another.example')
  );
});

test('wkdHash require() supports unicode local-parts', async () => {
  assert.equal(await wkdHash('Müller@example.com'), await wkdHash('müller'));
});

test('wkdHash require() returns a 32-character z-base-32 hash', async () => {
  const hash = await wkdHash('user@example.com');

  assert.notEqual(hash, null);
  assert.equal(hash.length, 32);
  assert.match(hash, /^[ybndrfg8ejkmcpqxot1uwisza345h769]{32}$/);
});

test('wkdHash require() hashes empty normalized input consistently', async () => {
  assert.equal(await wkdHash(''), await wkdHash('   '));
});

test('wkdHash require() returns null for non-string input', async () => {
  assert.equal(await wkdHash(123), null);
});
