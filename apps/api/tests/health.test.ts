import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../src/app.js";

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
  uptimeSeconds: number;
}

describe("Health API", () => {
  it("returns the liveness status", async () => {
    const response = await request(app).get("/api/health");

    const body = response.body as HealthResponse;

    expect(response.status).toBe(200);

    expect(body).toMatchObject({
      status: "ok",
      service: "taskflow-api",
    });

    expect(body.timestamp).toEqual(
      expect.any(String),
    );

    expect(body.uptimeSeconds).toEqual(
      expect.any(Number),
    );
  });

  it("returns the readiness status", async () => {
    const response = await request(app).get("/api/ready");

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      status: "ok",
      service: "taskflow-api",
      checks: {
        server: "available",
      },
    });
  });

  it("returns a standardized error for unknown routes", async () => {
    const response = await request(app).get(
      "/api/route-that-does-not-exist",
    );

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message:
          "Route GET /api/route-that-does-not-exist was not found.",
      },
    });
  });
});