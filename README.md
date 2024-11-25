# Arbitex

Token generator and authorization scopes manager.

## Usage

Arbitex uses a configuration object to define the scopes and keys used to sign the tokens. This represents the most current set of scopes and configuration:

```typescript
const config: ArbitexConfig = {
  scopes: {
    users: {
      read: { label: 'Read user accounts' },
      create: { label: 'Create user account' },
      delete: { label: 'Delete user account' },
    },
    projects: {
      read: { label: 'Read projects' },
      create: { label: 'Create new project' },
      delete: { label: 'Delete projects' },
    },
  },
  privateKey: 'example-key-secret',
  algorithm: 'HS512',
  issuer: 'api.example.com/auth',
  audience: 'api.example.com',
  expiresIn: '1h',
};
```

The objects at the individual scope level can be used to describe the scope in more detail, such as a label or description. This can be useful for generating documentation or user interfaces.

To support changes in the scopes over time, it can maintain a store, which is a versioned mapping of the scopes using bit positions:

```typescript
export const store = {
  1: { ... },
  2: { ... },
  3: {
    'user.read': 1,
    'user.write': 2,
    'user.delete': 3,
    'projects.read': 4,
    'projects.create': 5,
    'projects.delete': 6,
  },
}
```

The mapping is used to create a bitmask that ensures that the payload of the JWT remains small regardless of the amount of scopes granted. The store is used to align the token with the most current configuration.

### Initialize Arbitex

To initialize Arbitex, use the `Arbitex` class:

```typescript
const arbitex = new Arbitex(config, store, opts);
```

In the above the arbitex instance is initiated with the configuration object, the store, and an optional opts object.

- `config` is the configuration object that defines the scopes and keys used to sign the tokens. This is the most current set of permissions and keys that the application has available.
- `store` is a versioned mapping of the scopes using bit positions. This is used to align the token with the most current configuration. This can be saved and maintained in a file or database.

### Ensure Store

The store provides the ability to align the token with the most current configuration and support tokens issued with different versions of the configuration. The JWT payload contains a `ver` property which is used to determine the version of the configuration used to generate the token, allowing alignment with the scopes available when the token was issued.

To ensure alignment between the most current configuration and the store, Arbitex provides an `ensureStore` utility function. This function will call the provided callback with the updated store if the store is out of date. The callback should save the updated store to a file or database.

**Note:** The callback function will only run if the store is out of date. If the store is up to date, the callback will not be called.

```typescript
await arbitex.ensureStore(await updated => {
  // Save the updated store. Example, save to local file:
  // await fs.writeFile('./arbitex-store.json', JSON.stringify(updated));
});
```

### Options

The opts object can be used to configure the behavior scope alignment:

#### `opts.throwOnUknownScope`

If true, an error will be thrown if a token contains an unknown scope. Default is false. Uknown scopes are ignored.

#### `opts.latestMappingsOnly`

If true, only the latest mappings will be used instead of trying to align the token version with it's originating scope mapping. Default is false.

## Tokens

### Generate Token

To generate a token, use the `generateToken` method. The below example generates a token for a user with the user id as the `sub` and an `email` property:

```typescript
const token = arbitex.generateToken({
  sub: 'some-user-id',
  email: 'jsmith@email.com',
});
```

### Grant Scopes

To grant scopes to a token, use the `grant` method which will assign the scopes to the token object and create the bitmask to be sent in the JWT payload:

```typescript
token.grantScopes(['users.read', 'projects.create']);
```

### Sign Token

To sign a token, use the `sign` method which will sign the token using the properties defined in the configuration and the scopes granted:

```typescript
const signedToken = token.sign();
```

### Parse Token

To parse a token, use the `parseToken` method. This will return a token object or throw an error if the token is invalid, expired, etc:

```typescript
const token = arbitex.parseToken(signedToken);
```

### Read Scopes

The scopes are stored on the token object and can be accessed directly:

```typescript
token.scopes; // ['users.read', 'projects.create']
```
