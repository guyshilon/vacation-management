import { wrapHandler } from "../http/wrapHandler";
import { HandlerFn } from "./types";

export const getHealth: HandlerFn = wrapHandler(async () => {
  return { status: "ok" };
});
