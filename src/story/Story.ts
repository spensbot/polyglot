import z from "zod";

const StoryIdSchema = z.number().brand("StoryId");
// Incrementing for easy comparison
export type StoryId = z.infer<typeof StoryIdSchema>;