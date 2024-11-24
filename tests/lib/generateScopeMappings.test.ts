import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateScopeMappings } from '../../src/lib/generateScopeMappings';

import { config } from '../fixtures/config';
import { store } from '../fixtures/store';

describe('generateScopeMappings', () => {
  it('should generate scope mappings from the config', () => {
    const { version, scopeMappings } = generateScopeMappings(config, store);

    assert.strictEqual(version, 1);
    assert.deepEqual(scopeMappings[1], store[1]);
  });
  it('should return the existing version if the scope mappings are the same', () => {
    const { version, scopeMappings } = generateScopeMappings(config, store);

    assert.strictEqual(version, 1);
    assert.deepEqual(scopeMappings[1], store[1]);
  });
  it('should create a new version if the scopes have changed', () => {
    // add new organizations.read scope
    const newConfig = {
      ...config,
      ...{
        scopes: {
          ...config.scopes,
          ...{ organizations: { read: { label: 'Read organizations' } } },
        },
      },
    };

    const { version, scopeMappings } = generateScopeMappings(newConfig, store);

    assert.strictEqual(version, 2);
    assert.deepEqual(scopeMappings[version], {
      ...store[1],
      ...{ 'organizations.read': 7 },
    });
  });
});
