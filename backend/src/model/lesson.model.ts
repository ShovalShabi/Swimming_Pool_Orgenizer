import mongoose, { Schema, Document, Model } from "mongoose";
import { LessonType } from "../utils/lesson-enum.utils.js";
import { Swimming } from "../utils/swimming-enum.utils.js";
import Student from "../dto/student/student.dto.js";
import StartAndEndTime from "../dto/instructor/start-and-end-time.dto.js";

/**
 * Interface representing a Lesson document in MongoDB.
 * Extends the Mongoose `Document` interface to include lesson-specific fields.
 */
export interface ILesson extends Document {
  /** The unique identifier of the lesson. */
  _id: mongoose.Types.ObjectId;
  /** The type of the lesson (e.g., PUBLIC, PRIVATE, MIXED). */
  typeLesson: LessonType;
  /** An array of swimming specialties included in the lesson. */
  specialties: Swimming[];
  /** The ID of the instructor assigned to the lesson. */
  instructorId: mongoose.Types.ObjectId;
  /** The start and end time of the lesson. */
  startAndEndTime: StartAndEndTime;
  /** An array of students attending the lesson. */
  students: Student[];
}

/**
 * Schema for the `Student` subdocument.
 * Defines the structure and validation rules for student details.
 */
const StudentSchema = new Schema<Student>({
  /** The name of the student. */
  name: { type: String, required: true },
  /** The swimming preferences of the student. */
  preferences: {
    type: [String],
    enum: Object.values(Swimming),
    required: true,
  },
  /** The phone number that the student has been registered with. */
  phoneNumber: {
    type: String,
    required: true,
  },
});

/**
 * Schema for the `StartAndEndTime` subdocument.
 * Defines the structure and validation rules for start and end times.
 */
const StartAndEndTimeSchema = new Schema<StartAndEndTime>({
  /** The start time of the lesson. */
  startTime: { type: Date, required: true },
  /** The end time of the lesson. */
  endTime: { type: Date, required: true },
});

/**
 * Schema for the `Lesson` collection.
 * Defines the structure, validation rules, and constraints for lesson documents.
 */
const LessonSchema = new Schema<ILesson>(
  {
    /** The type of the lesson (e.g., PUBLIC, PRIVATE, MIXED). */
    typeLesson: {
      type: String,
      enum: Object.values(LessonType),
      required: true,
    },
    /** An array of swimming specialties included in the lesson. */
    specialties: {
      type: [String],
      enum: Object.values(Swimming),
      required: true,
    },
    /** Reference to the instructor assigned to the lesson. */
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    /** The start and end time of the lesson. */
    startAndEndTime: {
      type: StartAndEndTimeSchema,
      required: true,
    },
    /** An array of students attending the lesson. */
    students: {
      type: [StudentSchema],
      validate: {
        validator: (students: Student[]) =>
          Array.isArray(students) &&
          students.length > 0 &&
          students.length <= 30,
        message:
          "Students must be a non-empty array and must not exceed 30 in size.",
      },
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields.
);

/**
 * Mongoose model for the `Lesson` collection.
 * Provides an interface to interact with lesson documents in MongoDB.
 */
const LessonModel: Model<ILesson> = mongoose.model<ILesson>(
  "Lesson",
  LessonSchema
);

export default LessonModel;
