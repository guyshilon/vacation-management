import cors from "cors";
import express from "express";
import { dispatchCef } from "./http/dispatchCef";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    void dispatchCef(req, res).catch(next);
  });

  app.use(errorHandler);

  return app;
}
