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
  success: boolean;
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

  it("should return 404 for non-existent task", async () => {
    const nonExistentTaskId = "00000000-0000-0000-0000-000000000000"; // Use a valid UUID format that doesn't exist in the database

    const response = await request(app).get(
      `/api/v1/tasks/${nonExistentTaskId}`,
    );
    console.log(response.body);
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "TASK_NOT_FOUND",
        message: "Task was not found.",
      },
    });
  });

  it("should retrieve a task by ID", async () => {
    // Test implementation here
    const existingTaskId = "f8f14927-2289-4905-a31d-1d7a2c39b3f1"; // Use a valid UUID format that exists in the database

    const response = await request(app).get(`/api/v1/tasks/${existingTaskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        id: existingTaskId,
      },
    });
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
