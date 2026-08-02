import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

type TasksListItem = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
};

interface TaskListResponse {
    success: string;
  data: TasksListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

describe("Task API", () => {
  it("should create a new task", async () => {
    // Test implementation here
  });
  it("should retrieve a task by ID", async () => {
    // Test implementation here
  });
  it("should update a task", async () => {
    // Test implementation here
  });
  it("should delete a task", async () => {
    // Test implementation here
  });
  it("should list tasks with pagination and sorting", async () => {
    const response = await request(app).get("/api/v1/tasks");

    const body = response.body as TaskListResponse;

    expect(response.status).toBe(200);

    expect(body).toMatchObject({
      success: true,
    });

    expect(body.data).toEqual(expect.any(Array));

    expect(body.pagination.total).toEqual(expect.any(Number));
    expect(body.pagination.page).toEqual(expect.any(Number));
    expect(body.pagination.limit).toEqual(expect.any(Number));
  });
});
