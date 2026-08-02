import {
  createTaskBodySchema,
  getTasksQuerySchema,
} from "../schemas/task.schema.js";
import type { Request, Response } from "express";
import {
  createTaskService,
  getTasksService,
} from "../services/task.service.js";

const createTaskController = async (req: Request, res: Response) => {
  const input = createTaskBodySchema.parse(req.body);

  const task = await createTaskService(input);

  res.status(201).json({
    success: true,
    data: {
      task,
    },
  });
};

const getTasksController = async (req: Request, res: Response) => {
  const query =  getTasksQuerySchema.parse(req.query);

  const result = await getTasksService(query);

  return res.status(200).json({
    success: true,
    data: result.tasks,
    pagination: result.pagination,
  });
};

export { createTaskController, getTasksController };
