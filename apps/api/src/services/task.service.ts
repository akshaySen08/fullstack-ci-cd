import type { Prisma } from "../generated/prisma/client.js";
import type {
  CreateTaskInput,
  GetTaskByIdParams,
  GetTasksQuery,
  PatchTaskInput,
} from "../schemas/task.schema.js";
import {
  countTasks,
  createTask as createTaskRepository,
  getTasks as getTasksRepository,
  getTaskById as getTaskByIdRepository,
  patchTaskById as patchTaskByIdRepository,
  deleteTaskById as deleteTaskByIdRepository,
} from "../repositories/task.repository.js";
import { ApiError } from "../errors/api-error.js";

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

export async function getTaskByIdService(params: GetTaskByIdParams) {
  const task = await getTaskByIdRepository(params.id);

  if (!task) {
    throw new ApiError(404, "Task was not found.", "TASK_NOT_FOUND");
  }

  return task;
}

export async function patchTaskService(id: string, input: PatchTaskInput) {
  const data: Prisma.TaskUpdateManyMutationInput = {};

  if (input.title !== undefined) {
    data.title = input.title;
  }

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

  const updatedTask = await patchTaskByIdRepository(id, data);

  if (!updatedTask) {
    throw new ApiError(404, "Task was not found.", "TASK_NOT_FOUND");
  }

  return updatedTask;
}

export async function deleteTaskService(params: GetTaskByIdParams) {
  // const existingTask = await getTaskByIdRepository(params.id);
  const result = await deleteTaskByIdRepository(params.id);

  if (!result) {
    throw new ApiError(404, "Task was not found.", "TASK_NOT_FOUND");
  }
}
