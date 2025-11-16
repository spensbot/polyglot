import z from "zod";
import { ParsedWordSchema } from "./ParsedStory";

export const StoryIdSchema = z.number().brand("StoryId");
export type StoryId = z.infer<typeof StoryIdSchema>;

export const StoryResponseSchema = z.object({
  title: z.string(),
  content: z.string(),
})
export type StoryResponse = z.infer<typeof StoryResponseSchema>;

export const StorySchema = StoryResponseSchema.extend({
  id: StoryIdSchema,
})
export type Story = z.infer<typeof StorySchema>;

export const HintSchema = z.object({
  word: ParsedWordSchema,
  level: z.number()
})
export type Hint = z.infer<typeof HintSchema>;
