import { randomUUID } from "node:crypto";

import request from "supertest";
import { afterAll, afterEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const createdTaskIds: string[] = [];

async function createTaskFixture() {
  const task = await prisma.task.create({
    data: {
      title: "Learn Docker",
      description: "Original Task description",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: new Date("2026-08-15T17:00:00.000Z"),
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

describe("PATCH /api/v1/tasks/:id", () => {
  it("updates one Task field", async () => {
    const task = await createTaskFixture();

    const response = await request(app).patch(`/api/v1/tasks/${task.id}`).send({
      status: "COMPLETED",
    });

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        task: {
          id: task.id,
          title: "Learn Docker",
          description: "Original Task description",
          status: "COMPLETED",
          priority: "MEDIUM",
        },
      },
    });

    const storedTask = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(storedTask).toMatchObject({
      id: task.id,
      title: "Learn Docker",
      status: "COMPLETED",
      priority: "MEDIUM",
    });
  });

  it("updates multiple Task fields", async () => {
    const task = await createTaskFixture();

    const response = await request(app).patch(`/api/v1/tasks/${task.id}`).send({
      title: "Learn Docker and Compose",
      priority: "HIGH",
      dueDate: "2026-08-25T17:00:00Z",
    });

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        task: {
          id: task.id,
          title: "Learn Docker and Compose",
          description: "Original Task description",
          status: "TODO",
          priority: "HIGH",
          dueDate: "2026-08-25T17:00:00.000Z",
        },
      },
    });

    const storedTask = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(storedTask).not.toBeNull();
    expect(storedTask?.title).toBe("Learn Docker and Compose");
    expect(storedTask?.priority).toBe("HIGH");
    expect(storedTask?.dueDate).toEqual(new Date("2026-08-25T17:00:00.000Z"));
  });

  it("sets nullable fields to null", async () => {
    const task = await createTaskFixture();

    const response = await request(app).patch(`/api/v1/tasks/${task.id}`).send({
      description: null,
      dueDate: null,
    });

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        task: {
          id: task.id,
          description: null,
          dueDate: null,
        },
      },
    });

    const storedTask = await prisma.task.findUnique({
      where: {
        id: task.id,
      },
    });

    expect(storedTask).not.toBeNull();
    expect(storedTask?.description).toBeNull();
    expect(storedTask?.dueDate).toBeNull();
  });

  const invalidBodies: Array<[string, Record<string, unknown>]> = [
    ["an empty request body", {}],
    [
      "an invalid status",
      {
        status: "FINISHED",
      },
    ],
    [
      "an empty title",
      {
        title: "",
      },
    ],
    [
      "an unexpected property",
      {
        isAdmin: true,
      },
    ],
    [
      "an invalid priority",
      {
        priority: "URGENT",
      },
    ],
    [
      "an invalid due date",
      {
        dueDate: "tomorrow",
      },
    ],
  ];

  it.each(invalidBodies)(
    "returns 400 for %s",
    async (_description, requestBody) => {
      const response = await request(app)
        .patch(`/api/v1/tasks/${randomUUID()}`)
        .send(requestBody);

      expect(response.status).toBe(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The submitted request is invalid.",
        },
      });

      expect(response.body.error.details).toEqual(expect.any(Array));
    },
  );

  it("returns 400 for an invalid UUID", async () => {
    const response = await request(app).patch("/api/v1/tasks/hello").send({
      status: "COMPLETED",
    });

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "The submitted request is invalid.",
      },
    });
  });

  it("returns 404 when the Task does not exist", async () => {
    const missingTaskId = randomUUID();

    const response = await request(app)
      .patch(`/api/v1/tasks/${missingTaskId}`)
      .send({
        status: "COMPLETED",
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: "TASK_NOT_FOUND",
        message: "Task was not found.",
      },
    });
  });
});
