import mongoose, { Schema, Document, Model } from "mongoose";
import { Swimming } from "../utils/swimming-enum.utils.js";
import { Availability } from "../dto/instructor/start-and-end-time.dto.js";

// Interface for Mongoose Schema
export interface IInstructor extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  specialties: Swimming[];
  availabilities: Availability[];
}

// Define the Instructor Schema
const InstructorSchema = new Schema<IInstructor>(
  {
    name: { type: String, required: true },
    specialties: {
      type: [String],
      enum: Object.values(Swimming),
      required: true,
    },
    availabilities: {
      type: [
        {
          type: Schema.Types.Mixed, // Allows `-1` or an object
          validate: {
            validator: function (value: any): boolean {
              if (value === -1) return true; // `-1` is valid
              if (
                typeof value === "object" &&
                value.startTime instanceof Date &&
                value.endTime instanceof Date
              ) {
                return (
                  value.startTime <= value.endTime // Ensure startTime is before or equal to endTime
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
        validator: (arr: any[]): boolean => arr.length === 7,
        message:
          "Availabilities must have exactly 7 entries (one for each day of the week).",
      },
      required: true,
    },
  },
  { timestamps: true }
);

// Define the Mongoose Model
const InstructorModel: Model<IInstructor> = mongoose.model<IInstructor>(
  "Instructor",
  InstructorSchema
);

export default InstructorModel;
