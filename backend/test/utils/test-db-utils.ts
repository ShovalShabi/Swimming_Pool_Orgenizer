import mongoose from "mongoose";
import { connectToDatabase } from "../../src/etc/db-connection.etc.js";

/**
 * Connect to the MongoDB test database using the existing connection logic.
 */
export async function connect(): Promise<void> {
  await connectToDatabase();
}

/**
 * Disconnect from the MongoDB test database and drop all data.
 */
export async function disconnect(): Promise<void> {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}
