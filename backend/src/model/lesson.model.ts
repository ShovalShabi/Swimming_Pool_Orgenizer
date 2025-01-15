import mongoose, { Schema, Document, Model } from "mongoose";
import { LessonType } from "../utils/lesson-enum.utils.js";
import { Swimming } from "../utils/swimming-enum.utils.js";
import Student from "../dto/student/student.dto.js";

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

// Define an interface for Lesson documents
export interface ILesson extends Document {
  lessonId: string;
  typeLesson: LessonType;
  specialties: Swimming[];
  instructorId: string;
  dateAndTime: Date;
  duration: number;
  students: Student[];
}

// Define the Lesson Schema
const LessonSchema = new Schema(
  {
    lessonId: {
      type: String,
      required: true,
      unique: true,
    },
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
      type: String,
      required: true,
    },
    dateAndTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    students: {
      type: [StudentSchema],
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
