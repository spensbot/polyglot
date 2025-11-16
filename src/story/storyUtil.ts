import { Word } from "@/wordData/Word";
import { Story, StoryId } from "./Story";
import { Hanzi } from "@/wordData/Hanzi";
import { stories } from "./stories";
import z from "zod";

function parseLine(line: string): Word[] {
  return Hanzi.segment(line);
}

function parseContent(content: string): Word[][] {
  const rawLines = content
    .split("\n")
    .filter((line) => line.trim().length > 0);
  return rawLines.map(line => parseLine(line));
}

export const ParsedIdSchema = z.number().brand("parsedId");
export type ParsedId = z.infer<typeof ParsedIdSchema>;

export const ParsedWordSchema = z.object({
  parsedId: ParsedIdSchema,
  word: z.string().brand("Word"),
});
export type ParsedWord = z.infer<typeof ParsedWordSchema>;

export interface ParsedStory {
  story: Story;
  parsedTitle: ParsedWord[];
  parsedContent: ParsedWord[][];
  parsedAll: ParsedWord[];
}

export function parseStory(story: Story): ParsedStory {
  let iWord = 0;

  const parsedTitle: ParsedWord[] = parseLine(story.title).map((word) => {
    iWord += 1;
    return {
      parsedId: iWord as ParsedId,
      word,
    };
  });

  const parsedContent: ParsedWord[][] = parseContent(story.content).map((line =>
    line.map((word) => {
      iWord += 1;
      return {
        parsedId: iWord as ParsedId,
        word,
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
    ]
  };
}