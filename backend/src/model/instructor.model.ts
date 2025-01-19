import mongoose, { Schema, Document, Model } from "mongoose";
import { Swimming } from "../utils/swimming-enum.utils.js";
import { Availability } from "../dto/instructor/start-and-end-time.dto.js";

/**
 * Interface representing an Instructor document in MongoDB.
 * Extends the Mongoose `Document` interface to include instructor-specific fields.
 */
export interface IInstructor extends Document {
  /** The unique identifier of the instructor. */
  _id: mongoose.Types.ObjectId;
  /** The name of the instructor. */
  name: string;
  /** An array of swimming specialties taught by the instructor. */
  specialties: Swimming[];
  /**
   * Weekly availability of the instructor.
   * - Must have exactly 7 entries (one for each day of the week).
   * - Each entry can either be `-1` (unavailable) or an object with `startTime` and `endTime`.
   */
  availabilities: Availability[];
}

/**
 * Mongoose schema for the Instructor model.
 * Defines the structure, validation rules, and constraints for the `Instructor` collection.
 */
const InstructorSchema = new Schema<IInstructor>(
  {
    /** The name of the instructor. */
    name: { type: String, required: true },

    /** An array of specialties taught by the instructor. */
    specialties: {
      type: [String],
      enum: Object.values(Swimming), // Ensures valid specialties from the Swimming enum.
      required: true,
    },

    /**
     * Weekly availability of the instructor.
     * - Must have exactly 7 entries (0-Sunday, 1-Monday, ..., 6-Saturday).
     * - Each entry can be:
     *   - `-1` to indicate unavailability.
     *   - An object with `startTime` and `endTime` (both Date objects).
     */
    availabilities: {
      type: [
        {
          type: Schema.Types.Mixed, // Allows `-1` or an object.
          validate: {
            validator: function (value: any): boolean {
              if (value === -1) return true; // Valid if `-1`.
              if (
                typeof value === "object" &&
                value.startTime instanceof Date &&
                value.endTime instanceof Date
              ) {
                return (
                  value.startTime <= value.endTime // Ensure `startTime` is before or equal to `endTime`.
                );
              }
              return false;
            },
            message:
              "Availability must be either -1 (unavailable) or an object with valid startTime and endTime.",
          },
        },
      ],
      validate: {
        validator: (arr: any[]): boolean => arr.length === 7, // Ensure exactly 7 entries.
        message:
          "Availabilities must have exactly 7 entries (one for each day of the week).",
      },
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields.
);

/**
 * Mongoose model for the Instructor collection.
 * Provides an interface to interact with the `Instructor` collection in MongoDB.
 */
const InstructorModel: Model<IInstructor> = mongoose.model<IInstructor>(
  "Instructor",
  InstructorSchema
);

export default InstructorModel;
