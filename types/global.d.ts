// global.d.ts
interface ArbitexConfig {
  scopes: {
    [key: string]: {
      [key: string]: {
        label: string;
      };
    };
  };
  privateKey: string;
  algorithm: string;
  issuer: string;
  audience: string;
  expiresIn: string | number;
}

/**
 * Mapping of scopes by version { v: { 'scope.key': n } }
 */
interface ArbitexStore {
  [version: number]: ScopesBitPositions;
}

interface ArbitexOptions {
  // Throw if unknown scopes encountered during bitmask generation, default: false
  throwOnUnknownScope?: boolean;
  // Only support the latest version of the scope mappings, default: false
  latestMappingsOnly?: boolean;
}

/**
 * Scope object { 'scope.key': n }
 */
interface ScopesBitPositions {
  [key: string]: number;
}
