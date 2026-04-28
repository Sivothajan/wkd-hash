#!/usr/bin/env node
import { spawnSync } from 'child_process';

/**
 * Check if a command exists by trying `<cmd> --version`
 */
const hasCmd = (cmd) => {
  try {
    const result = spawnSync(cmd, ['--version'], { stdio: 'ignore' });
    return result && result.status === 0;
  } catch {
    return false;
  }
};

/**
 * Safe error logger
 */
const logError = (...args) => {
  if (globalThis.console?.error) {
    globalThis.console.error(...args);
    return;
  }

  if (
    globalThis.process?.stderr &&
    typeof globalThis.process.stderr.write === 'function'
  ) {
    globalThis.process.stderr.write(args.join(' ') + '\n');
    return;
  }

  throw new Error(args.map(String).join(' '));
};

/**
 * Safe exit handler
 */
const exitFn =
  globalThis.process?.exit ??
  ((code) => {
    throw new Error(
      `process.exit is not available in this environment. exit code: ${code}`
    );
  });

/**
 * Main execution
 */
const run = () => {
  if (hasCmd('bun')) {
    const r = spawnSync('bun', ['format'], { stdio: 'inherit' });
    exitFn(r.status ?? 1);
    return;
  }

  if (hasCmd('npm')) {
    const r = spawnSync('npm', ['run', 'format'], { stdio: 'inherit' });
    exitFn(r.status ?? 1);
    return;
  }

  logError('No formatter available: neither `bun` nor `npm` found on PATH.');
  logError(
    'Install Bun or Node/npm, or update scripts to provide a `format` target.'
  );

  exitFn(1);
};

run();
