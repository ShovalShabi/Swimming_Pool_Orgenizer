import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import corsOptions from "./cors.etc.js";
import { attachInstanceId } from "../utils/middleware/attach-instance-id.utils.js";

/**
 * Configures standard middleware for the Express application.
 * @param app - Express application instance.
 */
export function setupMiddleware(app: Application): void {
  app.use(express.json());
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(morgan("common"));
  app.use(
    bodyParser.json({
      limit: "30mb",
    })
  );
  app.use(
    bodyParser.urlencoded({
      limit: "30mb",
      extended: true, // extended is valid for urlencoded only
    })
  );
  app.use(cors(corsOptions));
  app.use(attachInstanceId);
}
