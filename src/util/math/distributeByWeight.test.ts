import { describe, it, expect } from "vitest";
import { distributeByWeight } from "./distributeByWeight";

describe("distributeByWeight", () => {
  it("distributes items in proportion to weight", () => {
    const buckets = [
      { items: ["A1", "A2", "A3", "A4"], weight: 2 },
      { items: ["B1", "B2"], weight: 1 },
    ];

    const result = distributeByWeight(buckets);

    expect(result).toEqual(["A1", "B1", "A2", "A3", "B2", "A4"]);
  });

  it("preserves order within each bucket", () => {
    const buckets = [
      { items: ["A1", "A2", "A3"], weight: 5 },
      { items: ["B1", "B2"], weight: 5 },
    ];

    const result = distributeByWeight(buckets);

    // A1 should appear before A2, A2 before A3
    expect(result.indexOf("A1")).toBeLessThan(result.indexOf("A2"));
    expect(result.indexOf("A2")).toBeLessThan(result.indexOf("A3"));

    // And same for B
    expect(result.indexOf("B1")).toBeLessThan(result.indexOf("B2"));
  });

  it("handles buckets that run out of items early", () => {
    const buckets = [
      { items: ["A1", "A2"], weight: 10 },
      { items: ["B1", "B2", "B3", "B4", "B5"], weight: 1 },
    ];

    const result = distributeByWeight(buckets);

    // All items must still be output
    expect(result).toHaveLength(7);

    // And must contain correct content
    expect(result).toEqual(["A1", "B1", "A2", "B2", "B3", "B4", "B5"]);
  });

  it("works with a single bucket", () => {
    const buckets = [{ items: ["A1", "A2"], weight: 3 }];

    expect(distributeByWeight(buckets)).toEqual(["A1", "A2"]);
  });

  it("handles empty buckets gracefully", () => {
    const buckets = [
      { items: [], weight: 5 },
      { items: ["B1"], weight: 1 },
    ];

    expect(distributeByWeight(buckets)).toEqual(["B1"]);
  });

  it("correctly distributes many items amongst multiple buckets", () => {
    const distributed = distributeByWeight<string>([
      { items: repeat("A", 100), weight: 1 },
      { items: repeat("B", 100), weight: 2 },
      { items: repeat("C", 100), weight: 3 },
    ]);

    expect(distributed).toHaveLength(300);

    const first100 = distributed.slice(0, 100);
    expect(count(first100, "A")).toBeCloseTo(17, 1);
    expect(count(first100, "B")).toBeCloseTo(33, 1);
    expect(count(first100, "C")).toBeCloseTo(50, 1);

    const next100 = distributed.slice(100, 200);
    expect(count(next100, "A")).toBeCloseTo(17, 1);
    expect(count(next100, "B")).toBeCloseTo(34, 1);
    expect(count(next100, "C")).toBeCloseTo(49, 1);

    const last100 = distributed.slice(200, 300);
    expect(count(last100, "A")).toBeCloseTo(66, 1);
    expect(count(last100, "B")).toBeCloseTo(33, 1);
    expect(count(last100, "C")).toBeCloseTo(1, 1);
  })
});

function repeat<T>(item: T, n: number): T[] {
  return Array.from({ length: n }, () => item);
}

function count<T>(arr: T[], item: T): number {
  return arr.filter(x => x === item).length;
}