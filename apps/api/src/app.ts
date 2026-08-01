import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.routes.js";
import { notFoundHandler } from "./middlewares/not-found.js";
import { errorhandler } from "./middlewares/error-handler.js";
import { taskRouter } from "./routes/task.routes.js";

export const app = express();

// Disable the "X-Powered-By" header for security reasons
app.disable("x-powered-by");

// Use Helmet to set various HTTP headers for security
app.use(helmet());

// Enable CORS with the specified origin and credentials
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

// Parse incoming JSON requests with a limit of 1MB
app.use(
  express.json({
    limit: "1mb",
  }),
);

// Parse incoming URL-encoded requests with a limit of 1MB
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

// Register the health check routes under the "/api" path
app.use("/api", healthRouter);
app.use("/api/v1/tasks", taskRouter);
app.use(notFoundHandler);
app.use(errorhandler);
