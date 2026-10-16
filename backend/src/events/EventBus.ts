type EventHandler = (event: unknown) => void | Promise<void>;

class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  on(eventName: string, handler: EventHandler): void {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  async emit(eventName: string, event: unknown): Promise<void> {
    const handlers = this.handlers.get(eventName) ?? [];
    for (const handler of handlers) {
      await handler(event);
    }
  }
}

export const eventBus = new EventBus();
