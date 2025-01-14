/**
 * Module: database.ts
 * Description: Handles database connection using Mongoose and logs connection status.
 * Author: Shoval Shabi
 */

// Import required modules
import mongoose from "mongoose";
import { createCustomLogger } from "./logger.etc.js"; // Import the configured logger
import { MONGO_URL } from "./env-load.etc.js"; // Import MongoDB URL from environment configuration
import path from "path"; // Import the path identification for logging purposes

// Create a tailored logger for database connectivity
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info", // Default to "info" if not set
  logRotation: true,
});

/**
 * Function: connectToDatabase
 * Description: Establishes connection to MongoDB using Mongoose.
 * Logs connection status using the configured logger.
 * Exits the process with error code 1 if connection fails.
 * @async
 * @function
 * @returns {Promise<void>} Returns nothing upon successful connection.
 * @throws {Error} Throws an error if the connection process encounters any issues.
 */
export const connectToDatabase = async (): Promise<void> => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(MONGO_URL);

    // Log successful connection
    logger.info("Connected to MongoDB");
  } catch (error) {
    // Log connection error and exit process with error code
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
