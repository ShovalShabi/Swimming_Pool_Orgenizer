import mongoose from "mongoose";
import { ILesson } from "../../model/lesson.model.js";
import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import Student from "../student/student.dto.js";
import StartAndEndTime from "../instructor/start-and-end-time.dto.js";

// Lesson Class
export default class Lesson {
  constructor(
    public lessonId: string | null,
    public typeLesson: LessonType,
    public specialties: Swimming[],
    public instructorId: string,
    public startAndEndTime: StartAndEndTime,
    public students: Student[]
  ) {}

  /**
   * Convert Mongoose Model (ILesson) to Lesson DTO
   * @param lessonDoc - Mongoose document (ILesson)
   * @returns Instance of Lesson DTO
   */
  static fromModel(lessonDoc: ILesson): Lesson {
    return new Lesson(
      lessonDoc._id?.toString() || null, // Convert `_id` to string or keep it null
      lessonDoc.typeLesson,
      lessonDoc.specialties,
      lessonDoc.instructorId.toString(),
      lessonDoc.startAndEndTime,
      lessonDoc.students.map(
        (student) =>
          new Student(student.name, student.preferences, student.lessonType)
      )
    );
  }

  /**
   * Convert Lesson DTO to Mongoose Model (LessonModel)
   * @returns Mongoose Model Instance (Document)
   */
  static toModel(lesson: Lesson): Partial<ILesson> {
    const modelData: Partial<ILesson> = {
      typeLesson: lesson.typeLesson,
      specialties: lesson.specialties,
      instructorId: new mongoose.Types.ObjectId(lesson.instructorId),
      startAndEndTime: {
        startTime: lesson.startAndEndTime.startTime,
        endTime: lesson.startAndEndTime.endTime,
      },
      students: lesson.students.map((student) => ({
        name: student.name,
        preferences: student.preferences,
        lessonType: student.lessonType,
      })),
    };

    // If instructorId exists, set it as `_id` to ensure updates don't create new documents
    if (lesson.lessonId) {
      modelData._id = new mongoose.Types.ObjectId(lesson.lessonId);
    }

    return modelData;
  }
}
