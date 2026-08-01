import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const healthRouter = Router();

healthRouter.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "taskflow-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

healthRouter.get("/ready", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "taskflow-api",
    checks: {
      server: "available",
    },
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get("/check-database", async (_request, response) => {
  const isDatabaseHealthy = await checkDatabaseHealth();

  if (!isDatabaseHealthy) {
    return response.status(503).json({
      status: "not_ready",
      database: "down",
    });
  }

  return response.status(200).json({
    status: "ready",
    database: "up",
  });
});

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Readiness check - Database is queryable");
    return true;
  } catch {
    return false;
  }
}
