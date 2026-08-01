import { createTaskBodySchema } from "../schemas/task.schema.js";
import type { Request, Response } from "express";
import { createTaskService } from "../services/task.service.js";

const createTaskController = async (req: Request, res: Response) => {

    const input = createTaskBodySchema.parse(
      req.body,
    );

    const task = await createTaskService(input);

    res.status(201).json({
      success: true,
      data: {
        task,
      },
    });
};

export { createTaskController };