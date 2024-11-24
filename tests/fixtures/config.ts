/* node:coverage disable */
export const config: ArbitexConfig = {
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
