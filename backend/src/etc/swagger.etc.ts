import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { serverURL } from "./env-load.etc.js";
import { createCustomLogger } from "./logger.etc.js";
import path from "path";

// Create a tailored logger for Swagger-UI
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI Specification version
    info: {
      title: "Lesson Management API", // API title
      version: "1.0.0", // API version
      description: "API documentation for the lesson scheduling system", // Brief description of the API
    },
    servers: [
      {
        url: `${serverURL}/`, // Base URL of the API
        description: "Development Server", // Description of the server
      },
    ],
  },
  apis: ["./src/route/*.ts", "./dist/route/*.js"], // Paths to API files for documentation
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

/**
 * Sets up Swagger UI for API documentation.
 * This function configures the `/api-docs` route in the application to serve
 * the Swagger UI, allowing developers to view and interact with the API documentation.
 *
 * @param app - The Express application instance to which Swagger UI is added.
 */
export function setupSwagger(app: Express): void {
  /**
   * Serve the Swagger UI at `/api-docs`.
   */
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  /**
   * Log the URL where Swagger UI is running.
   */
  logger.info(`Swagger UI is running at: ${serverURL}/api-docs`);
}
