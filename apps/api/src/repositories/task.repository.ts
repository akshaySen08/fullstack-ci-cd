import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

export async function createTask(data: Prisma.TaskCreateInput) {
  return prisma.task.create({
    data,
  });
}
