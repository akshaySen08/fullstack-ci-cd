import {
  createTaskBodySchema,
  getTaskByIdParamsSchema,
  getTasksQuerySchema,
} from "../schemas/task.schema.js";
import type { Request, Response } from "express";
import {
  createTaskService,
  getTaskByIdService,
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
  const query = getTasksQuerySchema.parse(req.query);

  const result = await getTasksService(query);

  return res.status(200).json({
    success: true,
    data: result.tasks,
    pagination: result.pagination,
  });
};

const getTaskByIdController = async (req: Request, res: Response) => {
  const { id } = getTaskByIdParamsSchema.parse(req.params);

  const task = await getTaskByIdService({ id });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: task,
  });
};

export { createTaskController, getTasksController, getTaskByIdController };
