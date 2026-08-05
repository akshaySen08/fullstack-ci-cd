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

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  dueDate: z.iso
    .datetime({
      offset: true,
    })
    .nullable()
    .optional(),
});

export const getTasksQuerySchema = z.strictObject({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export const getTaskByIdParamsSchema = z.strictObject({
  id: z.uuid("Invalid task ID format."),
});

export const patchTaskBodySchema = createTaskBodySchema
  .partial()
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one Task field must be provided.",
  });

export type CreateTaskInput = z.infer<typeof createTaskBodySchema>;

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

export type GetTaskByIdParams = z.infer<typeof getTaskByIdParamsSchema>;

export type PatchTaskInput = z.infer<typeof patchTaskBodySchema>;
