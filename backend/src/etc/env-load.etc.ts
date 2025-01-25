import dotenv from "dotenv-flow"; // Import the dotenv-flow package for loading environment variables
import { createCustomLogger } from "./logger.etc.js"; // Import the logger module
import path from "path"; // Import the path module for logging purposes

// Load environment variables from .env files
dotenv.config();

// Create a tailored logger for environment variable setup
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

/**
 * Log a message indicating that environment variables are being loaded
 */
logger.info("Loading environment variables");

/**
 * Constant: PORT
 * Description: Represents the port number on which the server will listen.
 * Defaults to 6001 if not specified in the environment variables.
 */
export const PORT: number = parseInt(process.env.PORT || "6001", 10);

// Log the port number being used by the server
logger.info(`Server Port: ${PORT}`);

export const serverURL: string = `http://localhost:${PORT}`;

/**
 * Constant: HOST_TYPE
 * Description: Represents the type of the host (dockerized or localhost).
 * Defaults to localhost if not specified in the environment variables.
 */
const MONGO_HOST_TYPE: string = process.env.HOST_TYPE || "localhost";

/**
 * Constant: MONGO_PORT
 * Description: Represents the port of MongoDB.
 * Defaults to 27017 if not specified in the environment variables.
 */
const MONGO_PORT: number = parseInt(process.env.MONGO_PORT || "27017", 10);

/**
 * Constant: DB_NAME
 * Description: Represents the name of the database in MongoDB, depending on the NODE_ENV parameter.
 * Defaults to "test" if not specified in the environment variables.
 */
const DB_NAME: string = process.env.DB_NAME || "test";

/**
 * Constant: MONGO_URL
 * Description: Represents the MongoDB connection URL.
 * Constructs the URL using environment variables.
 */
export const MONGO_URL: string = `mongodb://${MONGO_HOST_TYPE}:${MONGO_PORT}/${DB_NAME}`;

// Log the MongoDB connection URL being used
logger.info(`MongoDB URL: ${MONGO_URL}`);
