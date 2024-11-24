export function generateScopeMappings(
  config: ArbitexConfig,
  existingScopeMappings: ArbitexStore = {}
): { version: number; scopeMappings: ArbitexStore } {
  // Generate new scope mapping from the config
  const newMapping: ScopesBitPositions = {};
  let id = 1;

  for (const category in config.scopes) {
    if (Object.prototype.hasOwnProperty.call(config.scopes, category)) {
      const categoryScopes = config.scopes[category];
      for (const scopeName in categoryScopes) {
        if (Object.prototype.hasOwnProperty.call(categoryScopes, scopeName)) {
          const fullScopeName = `${category}.${scopeName}`;
          newMapping[fullScopeName] = id;
          id++;
        }
      }
    }
  }

  // Check if the new mapping already exists in existingScopeMappings
  for (const [versionStr, existingMapping] of Object.entries(
    existingScopeMappings
  )) {
    const version = Number(versionStr);
    if (areMappingsEqual(newMapping, existingMapping)) {
      // Mapping already exists
      return { version, scopeMappings: existingScopeMappings };
    }
  }

  // New mapping doesn't exist, append it with a new version number
  const newVersion = getNextVersion(existingScopeMappings);
  const updatedScopeMappings = { ...existingScopeMappings };
  updatedScopeMappings[newVersion] = newMapping;

  return { version: newVersion, scopeMappings: updatedScopeMappings };
}

// Helper function to compare two scope mappings
function areMappingsEqual(
  mappingA: ScopesBitPositions,
  mappingB: ScopesBitPositions
): boolean {
  const keysA = Object.keys(mappingA);
  const keysB = Object.keys(mappingB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (mappingA[key] !== mappingB[key]) return false;
  }

  return true;
}

// Helper function to get the next version number
function getNextVersion(scopeMappings: ArbitexStore): number {
  const versions = Object.keys(scopeMappings).map(Number);
  return versions.length > 0 ? Math.max(...versions) + 1 : 1;
}
