import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { serverURL } from "./env-load.etc.js";
import { createCustomLogger } from "./logger.etc.js";
import path from "path";

// Create a tailored logger for swaagger-ui
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lesson Management API",
      version: "1.0.0",
      description: "API documentation for the lesson scheduling system",
    },
    servers: [
      {
        url: `${serverURL}/`, // Update with your actual base URL
        description: "Development Server",
      },
    ],
  },
  apis: ["./src/route/*.ts", "./dist/route/*.js"], // Look for both TS and compiled JS files
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  logger.info(`Swagger UI is running at: ${serverURL}/api-docs`);
}
