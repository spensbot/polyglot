import { CedictDb, type CedictEntry } from "./chinese/cedict";
import { loadJunda, type JundaEntry } from "./chinese/junda";
import { Word } from "./Word";

export class Dictionary {
  private junda = loadJunda();
  private constructor(private cedictDb: CedictDb) { }

  static async create(): Promise<Dictionary> {
    const cedictDb = await CedictDb.create();
    return new Dictionary(cedictDb);
  }

  async definitionLookup(word: Word): Promise<CedictEntry | undefined> {
    return this.cedictDb.get(word);
  }

  segment(text: string): Word[] {
    const segmenterZh = new Intl.Segmenter("zh-CN", { granularity: "word" });

    const segments = segmenterZh.segment(text)
    return Array.from(segments).map(segment => segment.segment as Word);
  }

  getFrequency(char: string): JundaEntry | undefined {
    return this.junda.get(char);
  }
}

export const dict = await Dictionary.create();
