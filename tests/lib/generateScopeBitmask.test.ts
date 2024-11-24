import assert from 'node:assert';
import { describe, it } from 'node:test';
import { generateScopeBitmask } from '../../src/lib/generateScopeBitmask';

describe('generateScopeBitmask', () => {
  it('should generate a bitmask from the scopes', () => {
    const scopes = ['user.read', 'user.write', 'admin.read'];
    const scopeBitPositions = {
      'user.read': 1,
      'user.write': 2,
      'admin.read': 3,
      'admin.write': 4,
      'admin.delete': 5,
    };

    const bitmask = generateScopeBitmask(scopes, scopeBitPositions);

    assert.strictEqual(bitmask, 14);
  });

  it('should skip unknown scopes', () => {
    const scopes = [
      'user.read',
      'user.write',
      'admin.read',
      'admin.delete',
      'doesnt.exist',
    ];
    const scopeBitPositions = {
      'user.read': 1,
      'user.write': 2,
      'admin.read': 3,
      'admin.write': 4,
      'admin.delete': 5,
    };

    const bitmask = generateScopeBitmask(scopes, scopeBitPositions);

    assert.strictEqual(bitmask, 46);
  });

  it('should throw on unknown scopes if flagged', () => {
    const scopes = [
      'user.read',
      'user.write',
      'admin.read',
      'admin.delete',
      'doesnt.exist',
    ];
    const scopeBitPositions = {
      'user.read': 1,
      'user.write': 2,
      'admin.read': 3,
      'admin.write': 4,
      'admin.delete': 5,
    };

    assert.throws(() => {
      generateScopeBitmask(scopes, scopeBitPositions, true);
    });
  });

  it('should not throw on unknown scopes if not flagged', () => {
    const scopes = [
      'user.read',
      'user.write',
      'admin.read',
      'admin.delete',
      'doesnt.exist',
    ];
    const scopeBitPositions = {
      'user.read': 1,
      'user.write': 2,
      'admin.read': 3,
      'admin.write': 4,
      'admin.delete': 5,
    };

    const bitmask = generateScopeBitmask(scopes, scopeBitPositions, false);
    assert.strictEqual(bitmask, 46);
  });
});
