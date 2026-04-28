import { describe, expect, test } from 'bun:test';

import { wkdHash } from '../src/index';
import fixtures from './vectors.json';

describe('wkdHash', () => {
  for (const fixture of fixtures) {
    test(`hashes ${fixture.input}`, async () => {
      await expect(wkdHash(fixture.input)).resolves.toBe(fixture.expected);
    });
  }

  test('normalizes case and surrounding whitespace', async () => {
    await expect(wkdHash('  USER@Example.com  ')).resolves.toBe(
      await wkdHash('user@example.com')
    );
  });

  test('uses only the local-part for email addresses', async () => {
    await expect(wkdHash('user@example.com')).resolves.toBe(
      await wkdHash('user@another.example')
    );
  });

  test('supports unicode local-parts', async () => {
    await expect(wkdHash('Müller@example.com')).resolves.toBe(
      await wkdHash('müller')
    );
  });

  test('returns a 32-character z-base-32 hash', async () => {
    const hash = await wkdHash('user@example.com');

    expect(hash).not.toBeNull();
    expect(hash).toHaveLength(32);
    expect(hash).toMatch(/^[ybndrfg8ejkmcpqxot1uwisza345h769]{32}$/);
  });

  test('hashes empty normalized input consistently', async () => {
    await expect(wkdHash('')).resolves.toBe(await wkdHash('   '));
  });

  test('returns null for non-string input', async () => {
    await expect(wkdHash(123 as never)).resolves.toBeNull();
  });
});
