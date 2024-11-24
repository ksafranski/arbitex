export function getScopesFromBitmask(
  bitmask: number,
  scopeBitPositions: ScopesBitPositions
): string[] {
  const permissions: string[] = [];
  const bitPositionToScope: string[] = [];

  for (const [scopeName, bitPosition] of Object.entries(scopeBitPositions)) {
    bitPositionToScope[bitPosition] = scopeName;
  }

  const maxBitPosition = bitPositionToScope.length - 1;

  for (let bitPosition = 0; bitPosition <= maxBitPosition; bitPosition++) {
    if ((bitmask & (1 << bitPosition)) !== 0) {
      const scopeName = bitPositionToScope[bitPosition];
      if (scopeName) {
        permissions.push(scopeName);
      }
    }
  }

  return permissions;
}
