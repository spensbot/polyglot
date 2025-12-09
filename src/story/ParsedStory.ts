import z from "zod";
import { ParsedWordSchema, StorySchema } from "./Story";
import { TranslatedSectionSchema } from "@/dictionary/translation/TranslatedSection";
import { AsyncStateSchema } from "@/util/AsyncState";

export const ParsedStorySchema = z.object({
  story: StorySchema,
  parsedTitle: z.array(ParsedWordSchema),
  parsedContent: z.array(z.array(ParsedWordSchema)),
  parsedAll: z.array(ParsedWordSchema),
  translationBySentenceIdx: z.record(z.number(), AsyncStateSchema(TranslatedSectionSchema)).catch({}),
});
export type ParsedStory = z.infer<typeof ParsedStorySchema>;
