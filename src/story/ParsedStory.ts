import z from "zod";
import { Story } from "./Story";

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
