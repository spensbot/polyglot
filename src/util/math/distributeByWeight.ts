/**
 * Kinda like how flexbox distributes space among children based on weight. Created by ChatGPT
 * 
 * - Given several buckets { items: T[]; weight: number }, return a single array.
 * - Items should be pulled from each bucket in proportion to their weight.
 * - Within each bucket, items are yielded in order.
 * - If a bucket runs out of items early, it should just stop contributing.
 */
export function distributeByWeight<T>(buckets: { items: T[]; weight: number }[]): T[] {
  const result: T[] = [];
  const remaining = buckets.map(b => [...b.items]); // copy so we can mutate
  const totalItems = buckets.reduce((sum, b) => sum + b.items.length, 0);

  let totalWeight = buckets.reduce((sum, b) => sum + b.weight, 0);
  const weights = buckets.map(b => b.weight);

  // Keep a "progress cursor" for each bucket
  const progress = buckets.map(() => 0);

  for (let i = 0; i < totalItems; i++) {
    // Pick the bucket whose (progress / weight) is currently smallest
    // This approximates weighted round-robin.
    let bestIndex = -1;
    let bestScore = Infinity;

    for (let b = 0; b < buckets.length; b++) {
      if (remaining[b].length === 0) continue;

      const score = progress[b] / weights[b];
      if (score < bestScore) {
        bestScore = score;
        bestIndex = b;
      }
    }

    if (bestIndex === -1) break;

    result.push(remaining[bestIndex].shift()!);
    progress[bestIndex] += 1;
  }

  return result;
}