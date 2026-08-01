import type { Prisma } from "../generated/prisma/client.js";
import type { CreateTaskInput } from "../schemas/task.schema.js";
import { createTask as createTaskRepository } from "../repositories/task.repository.js";

export function createTaskService(input: CreateTaskInput) {
  const data: Prisma.TaskCreateInput = {
    title: input.title,
  };

  if (input.description !== undefined) {
    data.description = input.description;
  }

  if (input.status !== undefined) {
    data.status = input.status;
  }

  if (input.priority !== undefined) {
    data.priority = input.priority;
  }

  if (input.dueDate !== undefined) {
    data.dueDate = input.dueDate !== null ? new Date(input.dueDate) : null;
  }

  return createTaskRepository(data);
}
