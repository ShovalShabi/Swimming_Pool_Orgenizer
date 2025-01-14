/**
 * Module: app.ts
 * Description: Configures and initializes the Express application.
 * Author: Shoval Shabi
 */

// Import required modules
import express, { Express } from "express";
import { createCustomLogger } from "./etc/logger.etc.js"; // Import the configured logger
import path from "path"; // Import the path identification for logging purposes
import { setupMiddleware } from "./etc/dependencies.etc.js"; // Import middleware setup functions

// Create an instance of Express application
const app: Express = express();

// Logger configuration for the app module
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info", // Default to "info" if not set
  logRotation: true,
});

// Configure middleware - standard and custom-made
setupMiddleware(app);

// Mount routes
// mountRoutes(app);

logger.info(
  "Application has been injected with middleware and routes and ready to listen to its port"
);

// Export the Express application
export default app;
