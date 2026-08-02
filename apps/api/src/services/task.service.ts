import type { Prisma } from "../generated/prisma/client.js";
import type { CreateTaskInput, GetTasksQuery } from "../schemas/task.schema.js";
import {
  countTasks,
  createTask as createTaskRepository,
  getTasks as getTasksRepository,
} from "../repositories/task.repository.js";

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

export async function getTasksService(params: GetTasksQuery) {
  const where: Prisma.TaskWhereInput = {};

  if (params.status !== undefined) {
    where.status = params.status;
  }

  if (params.priority !== undefined) {
    where.priority = params.priority;
  }

  const skip = (params.page - 1) * params.limit;
  const take = params.limit;

  const [tasks, total] = await Promise.all([
    getTasksRepository({ where, skip, take }),
    countTasks(where),
  ]);

  return {
    tasks,

    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}
