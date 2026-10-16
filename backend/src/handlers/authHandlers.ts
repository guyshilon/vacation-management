import bcrypt from "bcryptjs";
import { Response } from "commoneventframework";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";
import { getAuthUser } from "../http/authFromEvent";
import { asString, parseJsonBody } from "../http/parseBody";
import { wrapHandler } from "../http/wrapHandler";
import { signToken } from "../utils/jwt";
import { toPublicUser } from "../utils/userPublic";
import { HandlerFn } from "./types";

export const login: HandlerFn = wrapHandler(async (_input, event) => {
  const body = parseJsonBody(event);
  const email = asString(body.email).trim();
  const password = asString(body.password);

  if (!email || !password) {
    throw new AppError(400, "Email and password are required.");
  }

  const user = await AppDataSource.getRepository(User)
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(401, "Invalid email or password.");
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user: toPublicUser(user) };
});

export const me: HandlerFn = wrapHandler(async (_input, event) => {
  const authUser = getAuthUser(event);
  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: authUser.userId },
  });

  if (!user) {
    throw new AppError(401, "User no longer exists.");
  }

  return new Response(200, { user: toPublicUser(user) });
});
