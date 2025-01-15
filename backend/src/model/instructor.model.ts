import mongoose, { Schema, Document, Model } from "mongoose";
import { Swimming } from "../utils/swimming-enum.utils.js";
import StartAndEndTime from "../dto/instructor/start-and-end-time.dto.js";

// Interface for Mongoose Schema
export interface IInstructor extends Document {
  instructorId: string;
  name: string;
  specialties: Swimming[];
  availabilities: StartAndEndTime[];
}

// Define the Instructor Schema
const InstructorSchema = new Schema<IInstructor>(
  {
    instructorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    specialties: {
      type: [String],
      enum: Object.values(Swimming),
      required: true,
    },
    availabilities: [
      {
        startTimeUTC: { type: Number, required: true },
        endTimeUTC: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Define the Mongoose Model
const InstructorModel: Model<IInstructor> = mongoose.model<IInstructor>(
  "Instructor",
  InstructorSchema
);

export default InstructorModel;
