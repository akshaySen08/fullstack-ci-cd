import {
  createTaskBodySchema,
  getTaskByIdParamsSchema,
  getTasksQuerySchema,
  patchTaskBodySchema,
} from "../schemas/task.schema.js";
import type { Request, Response } from "express";
import {
  createTaskService,
  getTaskByIdService,
  getTasksService,
  patchTaskService,
  deleteTaskService,
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

  return res.status(200).json({
    success: true,
    data: task,
  });
};

const patchTaskController = async (req: Request, res: Response) => {
  const params = getTaskByIdParamsSchema.parse(req.params);
  const input = patchTaskBodySchema.parse(req.body);

  const task = await patchTaskService(params.id, input);
  return res.status(200).json({
    success: true,
    data: { task },
  });
};

const deleteTaskController = async (req: Request, res: Response) => {
  const { id } = getTaskByIdParamsSchema.parse(req.params);

  await deleteTaskService({ id });

  return res.status(204).send();
};

export {
  createTaskController,
  getTasksController,
  getTaskByIdController,
  patchTaskController,
  deleteTaskController,
};
