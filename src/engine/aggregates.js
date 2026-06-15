export function createAggregateRegistry(definitions) {
  const map = new Map(definitions.map((definition) => [definition.id, definition]));
  return {
    has(id) {
      return map.has(id);
    },
    includes(id, value) {
      return map.get(id)?.values.includes(value) ?? false;
    },
    get(id) {
      return map.get(id);
    },
  };
}
