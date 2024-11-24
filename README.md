# Arbitex

Token generator and authorization scopes manager.

## Usage

Arbitex uses a configuration object to define the scopes and keys used to sign the tokens. This represents the most current set of permissions and keys that the application has available.

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
{
  1: {
    'user.read': 1,
    'user.write': 2,
    'user.delete': 3,
    'projects.read': 4,
    'projects.create': 5,
    'projects.delete': 6,
  },
  2: { ... },
  3: { ... },
}
```

The mapping is used to create a bitmask that ensures that the payload of the JWT remains small regardless of the amount of scopes granted. The store is used to align the token with the most current configuration.

To ensure alignment between the most current configuration and the store, Arbitex provides an `ensureStore` utility function:

```typescript
const arbitex = new Arbitex(config, currentStore, opts);
await arbitex.ensureStore(await updated => {
  if (updated) {
    // Save the updated store. Example, save to local file:
    // await fs.writeFile('./arbitex-store.json', JSON.stringify(updated));
  }
});
```

The opts object can be used to configure the behavior scope alignment:

### `opts.throwOnUknownScope`

If true, an error will be thrown if a token contains an unknown scope. Default is false. Uknown scopes are ignored.

### `opts.latestMappingsOnly`

If true, only the latest mappings will be used instead of trying to align the token version with it's originating scope mapping. Default is false.

## Tokens

### Generate Token

To generate a token, use the `generateToken` method:

```typescript
const token = arbitex.generateToken({
  sub: 'some-user-id',
  email: 'jsmith@email.com',
});
```

## Grant Scopes

To grant scopes to a token, use the `grant` method:

```typescript
token.grantScopes(['users.read', 'projects.create']);
```

## Sign Token

To sign a token, use the `sign` method:

```typescript
const signedToken = token.sign();
```

### Parse Token

To parse a token, use the `parseToken` method:

```typescript
const token = arbitex.parseToken(token);
```

## Read Scopes

The scopes are stored on the token object:

```typescript
token.scopes; // ['users.read', 'projects.create']
```
