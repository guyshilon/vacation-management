import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

export const DEMO_USERS = [
  {
    name: "Alice Requester",
    email: "requester@vacation.local",
    password: "Password123",
    role: "Requester" as const,
  },
  {
    name: "Bob Validator",
    email: "validator@vacation.local",
    password: "Password123",
    role: "Validator" as const,
  },
];

export async function seedUsers(): Promise<void> {
  const userRepository = AppDataSource.getRepository(User);

  for (const demo of DEMO_USERS) {
    const existing = await userRepository.findOne({
      where: { email: demo.email },
    });

    if (existing) {
      continue;
    }

    const user = userRepository.create({
      name: demo.name,
      email: demo.email,
      password: await bcrypt.hash(demo.password, 10),
      role: demo.role,
    });

    await userRepository.save(user);
    console.log(`Seeded ${demo.role}: ${demo.email}`);
  }
}
