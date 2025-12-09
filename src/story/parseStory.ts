import { Word } from "@/dictionary/Word";
import { ParsedId, ParsedWord, Story } from "./Story";
import { dict } from "@/dictionary/Dictionary";
import { ParsedStory } from "./ParsedStory";
import { last } from "@/util/collectionUtil";

const SENTENCE_DELIMITERS = [".", "。", "！", "!", "？", "?"] as const;
const SENTENCE_DELIMITER_REGEX = new RegExp(`(?<=["${SENTENCE_DELIMITERS.join("")}"])`)
const SENTENCE_DELIMITER_SET = new Set<string>(SENTENCE_DELIMITERS);

interface Intermediate {
  word: Word;
  sentenceIdx: number;
}

function parseLine(line: string, sentenceIdx: number): Intermediate[] {
  return dict.segment(line.trim()).map(word => {
    if (SENTENCE_DELIMITER_SET.has(word)) {
      sentenceIdx += 1;
    }
    return {
      word,
      sentenceIdx
    }
  })
}

function parseContent(content: string, sentenceIdx: number): Intermediate[][] {
  const rawLines = content
    .split("\n")
    .filter((line) => line.trim().length > 0);

  return rawLines.map(line => {
    const parsedLine = parseLine(line, sentenceIdx)
    sentenceIdx = last(parsedLine)?.sentenceIdx ?? sentenceIdx
    return parsedLine;
  });
}

export async function parseStory(story: Story): Promise<ParsedStory> {
  let iWord = 0;
  let runningSentenceIdx = 0;

  const parsedTitle: ParsedWord[] = parseLine(story.title, runningSentenceIdx).map(({ word, sentenceIdx }) => {
    iWord += 1;
    runningSentenceIdx = sentenceIdx;
    return {
      parsedId: iWord as ParsedId,
      word,
      loc: {
        sentenceIdx
      }
    };
  });

  runningSentenceIdx += 1; // Title always ends a sentence

  const parsedContent: ParsedWord[][] = parseContent(story.content, runningSentenceIdx).map((line =>
    line.map(({ word, sentenceIdx }) => {
      iWord += 1;
      return {
        parsedId: iWord as ParsedId,
        word,
        loc: {
          sentenceIdx
        }
      };
    })
  ));

  return {
    story,
    parsedTitle,
    parsedContent,
    parsedAll: [
      ...parsedTitle,
      ...parsedContent.flat()
    ],
    translationBySentenceIdx: {}
  };
}

export function getSentenceByIdx(story: Story, sentenceIdx: number): string | undefined {
  const allText = story.title + SENTENCE_DELIMITERS[0] + story.content;
  const sentences = allText.split(SENTENCE_DELIMITER_REGEX);
  return sentences[sentenceIdx];
}