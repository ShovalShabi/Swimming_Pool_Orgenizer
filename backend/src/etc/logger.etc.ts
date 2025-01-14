/**
 * Module: logger.etc.ts
 * Description: Configures a logger using the Winston library for logging.
 * Author: Shoval Shabi
 */

import {
  createLogger,
  format,
  transports,
  Logger,
  LoggerOptions,
} from "winston";
import strftime from "strftime"; // Import strftime for custom date formatting
import DailyRotateFile from "winston-daily-rotate-file"; // Import DailyRotateFile for log rotation

const { combine, timestamp, printf } = format;

/**
 * Function: logFormat
 * Description: Define the log format.
 */
const logFormat = printf(({ level, message, timestamp, moduleFilename }) => {
  // Ensure timestamp is a valid string or number
  const parsedTimestamp =
    typeof timestamp === "string" || typeof timestamp === "number"
      ? new Date(timestamp)
      : new Date();

  const formattedTimestamp = strftime("%d/%b/%Y:%H:%M:%S %z", parsedTimestamp);

  return `[${moduleFilename}] [${formattedTimestamp}] ${level.toUpperCase()}: ${message}`;
});

interface CreateLoggerOptions {
  moduleFilename: string;
  logToFile?: boolean;
  logLevel?: string;
  logRotation?: boolean;
}

/**
 * Function: createCustomLogger
 * Description: Create a custom logger.
 * @param options - Options for configuring the logger.
 * @returns The configured logger instance.
 */ // Logger options interface
export const createCustomLogger = (options: CreateLoggerOptions): Logger => {
  const {
    moduleFilename,
    logToFile = false,
    logLevel = "info",
    logRotation = false,
  } = options;

  // Define an array for logger transports
  const transportsArray: (
    | transports.ConsoleTransportInstance
    | DailyRotateFile
  )[] = [
    new transports.Console({
      level: logLevel,
    }),
  ];

  // Add file transport if logToFile is enabled
  if (logToFile) {
    const baseLogsPath = "./logs";
    const fileTransportOptions: DailyRotateFile.DailyRotateFileTransportOptions =
      {
        dirname: `${baseLogsPath}/${
          process.env.NODE_ENV || "development"
        }/${moduleFilename}`,
        filename: `${moduleFilename}-%DATE%.log`,
        datePattern: "DD-MMM-YYYY",
        maxSize: "20m",
        level: "warn",
      };

    if (logRotation) {
      fileTransportOptions.maxFiles = "14d";
      fileTransportOptions.auditFile = `${baseLogsPath}/${
        process.env.NODE_ENV || "development"
      }/${moduleFilename}/audit.json`;
    }

    // Add the DailyRotateFile transport
    transportsArray.push(new DailyRotateFile(fileTransportOptions));
  }

  // Return the configured logger
  return createLogger({
    level: logLevel,
    format: combine(
      timestamp(),
      printf(({ level, message, timestamp, moduleFilename }) => {
        return `[${moduleFilename}] [${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    ),
    transports: transportsArray,
  });
};
