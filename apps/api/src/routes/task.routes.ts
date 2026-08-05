import { Router } from "express";
import {
  createTaskController,
  getTaskByIdController,
  getTasksController,
  patchTaskController,
  deleteTaskController,
} from "../controllers/task.controllers.js";

export const taskRouter = Router();

taskRouter.post("/", createTaskController);
taskRouter.get("/", getTasksController);
taskRouter.get("/:id", getTaskByIdController);
taskRouter.patch("/:id", patchTaskController);
taskRouter.delete("/:id", deleteTaskController);
