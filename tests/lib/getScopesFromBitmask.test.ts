import assert from 'node:assert';
import { describe, it } from 'node:test';
import { getScopesFromBitmask } from '../../src/lib/getScopesFromBitmask';

describe('getScopesFromBitmask', () => {
  it('should return the permissions from the bitmask', () => {
    const bitmask = 14;
    const scopeBitPositions = {
      'user.read': 1,
      'user.write': 2,
      'admin.read': 3,
      'admin.write': 4,
      'admin.delete': 5,
    };

    const permissions = getScopesFromBitmask(bitmask, scopeBitPositions);

    assert.deepEqual(permissions, ['user.read', 'user.write', 'admin.read']);
  });
});
