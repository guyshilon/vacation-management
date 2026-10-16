import {
  buildCommonEvent,
  getRouteConfig,
  resolveHandlerRef,
  Response,
} from "commoneventframework";
import { CommonEvent } from "commoneventframework/dist/types/commonEvent";
import { Request, Response as ExpressResponse } from "express";
import { HandlerFn, InputParserFn } from "../handlers/types";

function toQuery(
  query: Request["query"]
): { [name: string]: string | undefined } {
  const result: { [name: string]: string | undefined } = {};
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      result[key] = value[0];
    } else if (typeof value === "string") {
      result[key] = value;
    }
  }
  return result;
}

function toHeaders(
  headers: Request["headers"]
): { [name: string]: string | undefined } {
  const result: { [name: string]: string | undefined } = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      result[key] = value[0];
    } else if (typeof value === "string") {
      result[key] = value;
    }
  }
  return result;
}

export async function dispatchCef(
  req: Request,
  res: ExpressResponse
): Promise<void> {
  const incoming: CommonEvent = {
    path: req.path,
    method: req.method,
    body: JSON.stringify(req.body ?? null),
    pathParameters: {},
    queryStringParameters: toQuery(req.query),
    headers: toHeaders(req.headers),
    version: "commonEvent",
  };

  const commonEvent = buildCommonEvent(incoming);
  const routeConfig = getRouteConfig(commonEvent);

  if (!routeConfig || !routeConfig.handler) {
    const notFound = new Response(404, { error: "Route not found" });
    sendCefResponse(res, notFound);
    return;
  }

  const handlerFn = resolveHandlerRef(routeConfig.handler) as
    | HandlerFn
    | undefined;
  const parserFn = routeConfig.inputParser
    ? (resolveHandlerRef(routeConfig.inputParser) as InputParserFn | undefined)
    : undefined;

  if (!handlerFn) {
    const missing = new Response(500, {
      error: `Handler "${routeConfig.handler}" not found`,
    });
    sendCefResponse(res, missing);
    return;
  }

  const input = parserFn ? parserFn(commonEvent) : {};
  if (input && typeof input === "object" && "statusCode" in input) {
    sendCefResponse(res, input as { statusCode: number; body: string; headers?: Record<string, unknown> });
    return;
  }

  const result = await handlerFn(input, commonEvent);

  if (result && typeof result === "object" && "statusCode" in result) {
    sendCefResponse(
      res,
      result as { statusCode: number; body: string; headers?: Record<string, unknown> }
    );
    return;
  }

  sendCefResponse(res, new Response(200, result as object));
}

function sendCefResponse(
  res: ExpressResponse,
  result: { statusCode?: number; body?: string; headers?: Record<string, unknown> }
): void {
  if (result.headers) {
    for (const [key, value] of Object.entries(result.headers)) {
      if (value !== undefined) {
        res.setHeader(key, String(value));
      }
    }
  }

  res.status(result.statusCode || 200).send(result.body ?? "");
}
