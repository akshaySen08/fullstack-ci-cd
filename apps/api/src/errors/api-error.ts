export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly details?: unknown;

    public constructor(
        statusCode: number,
        message: string,
        errorCode = "API_ERROR",
        details?: unknown,
    ) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;

        Error.captureStackTrace(this, ApiError);
    }
}

// creating this cllass to create consistent errors
// thro new ApiError(404, "User not found", "USER_NOT_FOUND");
// Instead of randonmly returing different formats from different controllers

