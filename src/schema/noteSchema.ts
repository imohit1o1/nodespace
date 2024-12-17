import { z } from "zod";

export const noteSchema = z.object({
    title: z.string().optional().default(""),
    content: z.string().optional().default(""),
    isPinned: z.boolean().default(false),
    isFavorite: z.boolean().default(false),
    backgroundColor: z.string().optional().default("bg-muted/30"),
    textColor: z.string().optional().default("text-foreground"),
}).refine((data) => data.title || data.content, {
    message: "Either title or content must be provided.",
    path: ["title"],
});