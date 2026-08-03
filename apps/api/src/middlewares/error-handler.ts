import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";
import { env } from "../config/env.js";

export const errorhandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  void _next;

  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "The submitted request is invalid.",
        details: error.issues,
      },
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }
  console.log("Unhandled application error: ", error);

  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      ...(env.NODE_ENV === "development" && error instanceof Error
        ? { stack: error.stack }
        : {}),
    },
  });
};
