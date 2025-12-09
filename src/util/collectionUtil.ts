export function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
  const existing = map.get(key)
  if (existing) return existing;
  const new_ = create()
  map.set(key, new_)
  return new_
}

function createRecord<K extends string, T>(
  keys: readonly K[],
  getT: (key: K) => T
): Record<K, T> {
  const partial: Partial<Record<K, T>> = {}

  for (const key of keys) {
    partial[key] = getT(key)
  }

  return partial as Record<K, T>
}

export function last<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[arr.length - 1];
}