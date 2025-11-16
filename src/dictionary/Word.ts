import z from "zod";

export const WordSchema = z.string().brand("Word");
export type Word = z.infer<typeof WordSchema>;

export const CharSchema = z.string().brand("Char");
export type Char = z.infer<typeof CharSchema>;