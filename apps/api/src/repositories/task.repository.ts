import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

export async function createTask(data: Prisma.TaskCreateInput) {
  return prisma.task.create({
    data,
  });
}

export interface GetTasksParams {
  where: Prisma.TaskWhereInput;
  skip: number;
  take: number;
}

export async function getTasks(params: GetTasksParams) {
  const { where, skip, take } = params;
  const tasks = await prisma.task.findMany({
    where,
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
}

export async function countTasks(where: Prisma.TaskWhereInput) {
  return prisma.task.count({
    where,
  });
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function patchTaskById(
  id: string,
  data: Prisma.TaskUpdateManyMutationInput,
) {
  const tasks = await prisma.task.updateManyAndReturn({
    where: {
      id,
    },
    data,
  });

  return tasks[0] ?? null;
}
