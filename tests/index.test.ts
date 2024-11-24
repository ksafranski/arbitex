/* node:coverage disable */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import Arbitex from '../src';

import { config } from './fixtures/config';
import { store } from './fixtures/store';

describe('Arbitex', () => {
  describe('arbitex.constructor', () => {
    it('should create an instance of Arbitex', () => {
      const arbitex = new Arbitex(config, store);
      assert.strictEqual(arbitex.config, config);
      assert.strictEqual(arbitex.store, store);
    });
  });
  describe('arbitex.ensureStore', () => {
    it('should update the store if the current scopes are not present', async () => {
      let updateCalled = false;
      const arbitex = new Arbitex(
        {
          ...config,
          ...{
            scopes: {
              ...config.scopes,
              ...{
                users: {
                  ...config.scopes.users,
                  ...{
                    newScope: { label: 'test' },
                  },
                },
              },
            },
          },
        },
        store
      );
      const update = async (store: any) => {
        updateCalled = true;
      };
      await arbitex.ensureStore(update);
      assert.strictEqual(updateCalled, true);
      assert.strictEqual(
        Object.keys(arbitex.store[2]).includes('users.newScope'),
        true
      );
    });
    it('should not update the store if the mappings have not changed', async () => {
      let updateCalled = false;
      const arbitex = new Arbitex(config, store);
      const update = async (store: any) => {
        updateCalled = true;
      };
      await arbitex.ensureStore(update);
      assert.strictEqual(arbitex.store, store);
      assert.strictEqual(updateCalled, false);
    });
  });
  describe('arbitex.generateToken', () => {
    it('should generate a new token', () => {
      const arbitex = new Arbitex(config, store);
      const token = arbitex.generateToken({ sub: 'some-user-id' });
      assert.strictEqual(token.tokenProps.sub, 'some-user-id');
    });
  });
  describe('token.grantScopes', () => {
    it('should grant scopes to a token', async () => {
      const arbitex = new Arbitex(config, store);
      const token = arbitex.generateToken({ sub: 'some-user-id' });
      token.grantScopes(['users.read', 'projects.create']);
      assert.strictEqual(token.bitmask, 34);
    });
  });
  describe('token.sign', () => {
    it('should sign a token', async () => {
      const arbitex = new Arbitex(config, store);
      const token = arbitex.generateToken({ sub: 'some-user-id' });
      token.grantScopes(['users.read', 'projects.create']);
      const signedToken = token.sign();
      assert.strictEqual(signedToken.split('.').length, 3);
      assert.strictEqual(typeof signedToken, 'string');
    });
  });
  describe('arbitext.parseToken', () => {
    it('should parse a token', async () => {
      const arbitex = new Arbitex(config, store);
      const token = arbitex.generateToken({ sub: 'some-user-id' });
      token.grantScopes(['users.read', 'projects.create']);
      const signedToken = token.sign();
      const parsedToken = arbitex.parseToken(signedToken);
      assert.strictEqual(parsedToken.tokenProps.sub, 'some-user-id');
    });
  });
});
