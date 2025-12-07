import { describe, it, expect } from "vitest";
import { expandDictionaryCode } from "./WiktionaryDb";

describe("expandDictionaryCode", () => {
  it("expands conj.", () => {
    expect(expandDictionaryCode("conj.: and yet"))
      .toBe("and yet (conjunction: connects clauses or sentences)");
  });

  it("handles measure words", () => {
    expect(expandDictionaryCode("m.[general]"))
      .toBe("general measure word (classifier used with nouns)");
  })

  it("expands det.", () => {
    expect(expandDictionaryCode("det.: that"))
      .toBe("that (determiner: specifies which person/thing)");
  });

  it("returns original if no code found", () => {
    expect(expandDictionaryCode("hello world"))
      .toBe("hello world");
  });

  it("returns original if code is unknown", () => {
    expect(expandDictionaryCode("adv.: quickly"))
      .toBe("adv.: quickly");
  });
});