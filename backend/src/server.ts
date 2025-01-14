import path from "path";
import { createCustomLogger } from "./etc/logger.etc.js";
import { connectToDatabase } from "./etc/db-connection.etc.js";
import app from "./app.js";
import { PORT } from "./etc/env-load.etc.js";
import { instanceId } from "./utils/middleware/attach-instance-id.utils.js";

// Logger configuration for the app module
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info", // Default to "info" if not set
  logRotation: true,
});

// Connect to the MongoDB database
connectToDatabase()
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      // Log a message indicating server startup along with the instance ID
      logger.info(
        `Server is running on port ${PORT}. Instance ID: ${instanceId}`
      );
    });
  })
  .catch((error: Error) => {
    // Log an error if database connection fails
    logger.error(`MongoDB connection error: ${error}`);
    // Exit the process with failure status
    process.exit(1);
  });
