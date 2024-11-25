import jwt from 'jsonwebtoken';
import { generateScopeBitmask } from './lib/generateScopeBitmask';
import { generateScopeMappings } from './lib/generateScopeMappings';
import { getScopesFromBitmask } from './lib/getScopesFromBitmask';

class ArbitexToken {
  private construct: Arbitex;
  public tokenProps: Record<string, any>;
  public bitmask: number = 0;
  public scopes: string[] = [];

  constructor(construct: Arbitex, tokenProps: Record<string, any>) {
    this.construct = construct;
    this.tokenProps = {
      ...tokenProps,
      ver: construct.opts.latestMappingsOnly
        ? construct.latestMappingsVersion
        : tokenProps.ver || construct.latestMappingsVersion,
    };
    if (tokenProps.bit) {
      this.bitmask = tokenProps.bit;
      this.scopes = getScopesFromBitmask(
        this.bitmask,
        this.construct.store[this.tokenProps.ver]
      );
    }
  }

  /**
   * Grants the specified scopes to the token
   * @param scopes {string[]} - The scopes to grant
   * @param ver {number} - The version of the scope mappings to use, default: latest
   */
  public grantScopes(scopes: string[], ver?: number): void {
    this.bitmask = generateScopeBitmask(
      scopes,
      this.construct.store[ver || this.construct.latestMappingsVersion],
      this.construct.opts.throwOnUnknownScope
    );
  }

  /**
   * Generates a JWT token with the current token properties
   * @returns {string} - The signed JWT token
   */
  public sign(): string {
    const { algorithm, privateKey, issuer, audience } = this.construct.config;
    return jwt.sign(
      { ...this.tokenProps, ...{ bit: this.bitmask } },
      privateKey,
      {
        algorithm: algorithm as jwt.Algorithm,
        issuer,
        audience,
      }
    );
  }

  public readScopes(): string[] {
    return Object.keys(this.tokenProps.scopes).filter(
      scope => this.tokenProps.scopes[scope] === 1
    );
  }
}

class Arbitex {
  public config: ArbitexConfig;
  public store: ArbitexStore;
  public opts: ArbitexOptions;

  constructor(
    config: ArbitexConfig,
    store: ArbitexStore = {},
    opts: ArbitexOptions = {}
  ) {
    this.config = config;
    this.store = store;
    this.opts = opts;
  }

  /**
   * @property {number} latestMappingsVersion - The latest version of the scope mappings
   */
  public get latestMappingsVersion(): number {
    return parseInt(Object.keys(this.store).sort().reverse()[0], 10);
  }

  /**
   * Utility to ensure local store is synced with the latest scope mappings
   * @param {UpdateFunction} update async function to update the local store with the new mappings
   */
  public async ensureStore(
    update: (store: ArbitexStore) => Promise<any>
  ): Promise<void> {
    const { version, scopeMappings } = generateScopeMappings(
      this.config,
      this.store
    );
    if (version !== this.latestMappingsVersion) {
      // Update store with new mappings
      this.store = scopeMappings;
      // Run the update function
      await update(this.store);
    }
  }

  /**
   * Generates a new token with the specified properties
   * @param tokenProps {Record<string, any>} - The token properties
   * @returns {ArbitexToken} - The token
   */
  public generateToken(tokenProps: Record<string, any>): ArbitexToken {
    return new ArbitexToken(this, tokenProps);
  }

  public parseToken(token: string): ArbitexToken {
    return new ArbitexToken(
      this,
      jwt.verify(token, this.config.privateKey, {
        algorithms: [this.config.algorithm as jwt.Algorithm],
        audience: this.config.audience,
        issuer: this.config.issuer,
      }) as Record<string, any>
    );
  }
}

export default Arbitex;
