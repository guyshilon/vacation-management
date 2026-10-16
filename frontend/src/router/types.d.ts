import type { UserRole } from "../types";

declare module "vue-router" {
  interface RouteMeta {
    public?: boolean;
    roles?: UserRole[];
  }
}

export {};
