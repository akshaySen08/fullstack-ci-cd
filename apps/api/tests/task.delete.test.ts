import { randomUUID } from "node:crypto";

import request from "supertest";
import { afterAll, afterEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const createdTaskIds: string[] = [];

async function createTaskFixture() {
  const task = await prisma.task.create({
    data: {
      title: "Temporary Task",
      description: "Created for DELETE integration testing",
      status: "TODO",
      priority: "MEDIUM",
    },
  });

  createdTaskIds.push(task.id);

  return task;
}

afterEach(async () => {
  if (createdTaskIds.length === 0) {
    return;
  }

  await prisma.task.deleteMany({
    where: {
      id: {
        in: [...createdTaskIds],
      },
    },
  });

  createdTaskIds.length = 0;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("DELETE /api/v1/tasks/:id", () => {
  it("deletes an existing Task", async () => {
    const task = await createTaskFixture();

    const response = await request(app).delete(`/api/v1/tasks/${task.id}`);

    expect(response.status).toBe(204);
    expect(response.text).toBe("");

    const storedTask = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(storedTask).toBeNull();
  });

  it("returns 404 when retrieving a deleted Task", async () => {
    const task = await createTaskFixture();

    const deleteResponse = await request(app).delete(
      `/api/v1/tasks/${task.id}`,
    );

    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/api/v1/tasks/${task.id}`);

    expect(getResponse.status).toBe(404);

    expect(getResponse.body).toEqual({
      success: false,
      error: {
        code: "TASK_NOT_FOUND",
        message: "Task was not found.",
      },
    });
  });

  it("returns 400 for an invalid UUID", async () => {
    const response = await request(app).delete("/api/v1/tasks/hello");

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "The submitted request is invalid.",
      },
    });

    expect(response.body.error.details).toEqual(expect.any(Array));
  });

  it("returns 404 when the Task does not exist", async () => {
    const missingTaskId = randomUUID();

    const response = await request(app).delete(
      `/api/v1/tasks/${missingTaskId}`,
    );

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: "TASK_NOT_FOUND",
        message: "Task was not found.",
      },
    });
  });

  it("returns 404 when deleting the same Task twice", async () => {
    const task = await createTaskFixture();

    const firstResponse = await request(app).delete(`/api/v1/tasks/${task.id}`);

    expect(firstResponse.status).toBe(204);

    const secondResponse = await request(app).delete(
      `/api/v1/tasks/${task.id}`,
    );

    expect(secondResponse.status).toBe(404);

    expect(secondResponse.body).toEqual({
      success: false,
      error: {
        code: "TASK_NOT_FOUND",
        message: "Task was not found.",
      },
    });
  });
});
