import { Router } from "express";
import { createTaskController } from "../controllers/task.controllers.js";

export const taskRouter = Router();

taskRouter.post("/", createTaskController);
