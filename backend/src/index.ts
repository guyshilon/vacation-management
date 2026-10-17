import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

import "./generated/HandlerRegistry";
import { createApp } from "./app";
import { AppDataSource } from "./config/database";
import { registerEventHandlers } from "./events/registerEventHandlers";
import { seedSampleRequests } from "./seed/seedSampleRequests";
import { seedUsers } from "./seed/seedUsers";

const port = Number(process.env.PORT) || 3000;

async function start() {
  try {
    await AppDataSource.initialize();
    console.log("Connected to PostgreSQL");

    registerEventHandlers();
    await seedUsers();
    await seedSampleRequests();

    const app = createApp();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
