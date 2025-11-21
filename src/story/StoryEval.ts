import { GradeSchema } from "@/grade/Grade";
import z from "zod";
import { StoryIdSchema } from "./Story";
import { AsyncStateSchema } from "@/util/AsyncState";

export const StoryEvalSchema = z.object({
  storyId: StoryIdSchema,
  summary: z.string(),
  grade: AsyncStateSchema(GradeSchema).optional(),
})
export type StoryEval = z.infer<typeof StoryEvalSchema>;