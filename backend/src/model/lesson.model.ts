import mongoose, { Schema, Document, Model } from "mongoose";
import { LessonType } from "../utils/lesson-enum.utils.js";
import { Swimming } from "../utils/swimming-enum.utils.js";
import Student from "../dto/student/student.dto.js";
import StartAndEndTime from "../dto/instructor/start-and-end-time.dto.js";

// Define the Student Schema
const StudentSchema = new Schema<Student>({
  name: { type: String, required: true },
  preferences: {
    type: [String],
    enum: Object.values(Swimming),
    required: true,
  },
  lessonType: {
    type: String,
    enum: Object.values(LessonType),
    required: true,
  },
});

// Define the StartAndEndTime Schema
const StartAndEndTimeSchema = new Schema<StartAndEndTime>({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

// Interface for Mongoose Schema
export interface ILesson extends Document {
  _id: mongoose.Types.ObjectId;
  typeLesson: LessonType;
  specialties: Swimming[];
  instructorId: mongoose.Types.ObjectId; // ObjectId reference to Instructor
  startAndEndTime: StartAndEndTime;
  students: Student[];
}

// Define the Lesson Schema
const LessonSchema = new Schema<ILesson>(
  {
    typeLesson: {
      type: String,
      enum: Object.values(LessonType),
      required: true,
    },
    specialties: {
      type: [String],
      enum: Object.values(Swimming),
      required: true,
    },
    instructorId: {
      type: Schema.Types.ObjectId, // Reference to the Instructor model
      ref: "Instructor",
      required: true,
    },
    startAndEndTime: {
      type: StartAndEndTimeSchema,
      required: true,
    },
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
  { timestamps: true }
);

// Define the Lesson Mongoose Model
const LessonModel: Model<ILesson> = mongoose.model<ILesson>(
  "Lesson",
  LessonSchema
);

export default LessonModel;
