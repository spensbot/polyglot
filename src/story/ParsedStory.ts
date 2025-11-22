import z from "zod";
import { ParsedWordSchema, StorySchema } from "./Story";

export const ParsedStorySchema = z.object({
  story: StorySchema,
  parsedTitle: z.array(ParsedWordSchema),
  parsedContent: z.array(z.array(ParsedWordSchema)),
  parsedAll: z.array(ParsedWordSchema),
});
export type ParsedStory = z.infer<typeof ParsedStorySchema>;
