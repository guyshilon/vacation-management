import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { getAuthUser, requireRole } from "../http/authFromEvent";
import { wrapHandler } from "../http/wrapHandler";
import { toPublicUser } from "../utils/userPublic";
import { HandlerFn } from "./types";

export const listUsers: HandlerFn = wrapHandler(async (_input, event) => {
  requireRole(getAuthUser(event), "Validator");

  const users = await AppDataSource.getRepository(User).find({
    order: { name: "ASC" },
  });

  return { users: users.map(toPublicUser) };
});
