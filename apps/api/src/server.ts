import { createServer } from "node:http";

import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./lib/database.js";
import { env } from "./config/env.js";

async function startServer(): Promise<void> {
  try {
    await connectDatabase(); // first we are check the database connection

    const httpServer = createServer(app);

    httpServer.listen(env.PORT, env.HOST, () => {
      console.log(`🚀 TaskFlow API running at http://${env.HOST}:${env.PORT}`);
    });

    let shutdownStarted = false;

    const shutdown = (signal: NodeJS.Signals): void => {
      if (shutdownStarted) {
        return;
      }

      shutdownStarted = true;

      console.log(`${signal} received. Starting graceful shutdown.`);

      const forceShutdownTimer = setTimeout(() => {
        console.error("Graceful shutdown timed out. Forcing exit.");
        process.exit(1);
      }, 10_000);

      forceShutdownTimer.unref();

      httpServer.close((error) => {
        clearTimeout(forceShutdownTimer);

        if (error) {
          console.error("Failed to close the HTTP server:", error);
          process.exitCode = 1;
          return;
        }

        console.log("HTTP server closed successfully.");
        process.exitCode = 0;
      });
    };

    process.on("SIGTERM", () => {
      shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      shutdown("SIGINT");
    });
  } catch (error) {
    console.error("❌ Failed to start API:", error);

    await disconnectDatabase();

    process.exit(1);
  }
}

void startServer();
