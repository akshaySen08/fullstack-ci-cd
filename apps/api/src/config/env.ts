import { config } from "dotenv";
import { z } from "zod";

config();

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  HOST: z.string().min(1).default("0.0.0.0"),

  PORT: z.coerce.number().int().min(1).max(65535).default(4000),

  CORS_ORIGIN: z.url().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required."),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  console.error(
    "Invalid environment variables:",
    z.treeifyError(parsedEnvironment.error),
  );

  throw new Error("Environment variable validation failed.");
}

export const env = parsedEnvironment.data;
