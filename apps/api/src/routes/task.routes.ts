import { Router } from "express";
import { createTaskController, getTasksController } from "../controllers/task.controllers.js";

export const taskRouter = Router();

taskRouter.post("/", createTaskController);
taskRouter.get("/", getTasksController);
