import { WordSchema } from "@/wordData/Word";
import z from "zod";
import { ParsedWordSchema } from "./storyUtil";

export const StoryIdSchema = z.number().brand("StoryId");
export type StoryId = z.infer<typeof StoryIdSchema>;

export const StoryLineSchema = z.array(WordSchema);

export const StorySchema = z.object({
  id: StoryIdSchema,
  title: z.string(),
  content: z.string(),
})
export type Story = z.infer<typeof StorySchema>;

export const HintSchema = z.object({
  word: ParsedWordSchema,
  level: z.number()
})
export type Hint = z.infer<typeof HintSchema>;
