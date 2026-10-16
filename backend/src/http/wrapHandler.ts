import { Response } from "commoneventframework";
import { AppError } from "../errors/AppError";
import { HandlerFn } from "../handlers/types";

export function wrapHandler(handler: HandlerFn): HandlerFn {
  return async (input, event) => {
    try {
      return await handler(input, event);
    } catch (error) {
      if (error instanceof AppError) {
        return new Response(error.statusCode, { error: error.message });
      }

      console.error(error);
      return new Response(500, { error: "Internal server error." });
    }
  };
}
