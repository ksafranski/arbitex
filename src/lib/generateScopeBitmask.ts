export function generateScopeBitmask(
  permissions: string[],
  scopeBitPositions: ScopesBitPositions,
  throwOnUnknownPermission = false
): number {
  let bitmask = 0;
  for (const permission of permissions) {
    const bitPosition = scopeBitPositions[permission];
    if (bitPosition !== undefined) {
      bitmask |= 1 << bitPosition;
    } else {
      if (throwOnUnknownPermission) {
        throw new Error(`Unknown permission: ${permission}`);
      }
    }
  }
  return bitmask;
}
