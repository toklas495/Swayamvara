import type { ERROR_CODE_SCHEMA } from "../types/Error";


type AppErrorOptions={
    message:string,
    status:number,
    code:ERROR_CODE_SCHEMA,
    details?:Record<string,unknown>|undefined,
    cause?:any
}

export class AppError extends Error {
  public readonly status: number;
  public readonly code:ERROR_CODE_SCHEMA;
  public readonly details?: Record<string, unknown>|undefined;

  constructor(options: AppErrorOptions) {
    super(options.message);

    this.name = "AppError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;

    if (options.cause) {
      (this as any).cause = options.cause;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}


export const createError = () => {
  const notFound = (message?: string) => new AppError({ message: message ?? "Not Found!", status: 404, code: "NOT_FOUND" });
  const unAuth = (message?: string) => new AppError({ message: message ?? "unauthorized request!", status: 401, code: "UN_AUTH" });
  const badRequest = (message?: string) => new AppError({ message: message ?? "Bad request!", status: 400, code: "BAD_REQ" });

  return {
    notFound,
    unAuth,
    badRequest
  };
};


export type ErrorSchema = ReturnType<typeof createError>;
