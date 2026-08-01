import { z } from "zod";

export const createTaskBodySchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title cannot exceed 120 characters."),

  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters.")
    .nullable()
    .optional(),

  status: z
    .enum([
      "TODO",
      "IN_PROGRESS",
      "COMPLETED",
    ])
    .optional(),

  priority: z
    .enum([
      "LOW",
      "MEDIUM",
      "HIGH",
    ])
    .optional(),

  dueDate: z
    .iso
    .datetime({
      offset: true,
    })
    .nullable()
    .optional(),
});

export type CreateTaskInput = z.infer<
  typeof createTaskBodySchema
>;