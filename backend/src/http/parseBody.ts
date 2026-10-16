import { CommonEvent } from "commoneventframework/dist/types/commonEvent";

export function parseJsonBody(event: CommonEvent): Record<string, unknown> {
  if (!event.body) {
    return {};
  }

  if (typeof event.body === "object") {
    return event.body as Record<string, unknown>;
  }

  try {
    const parsed = JSON.parse(event.body);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}
