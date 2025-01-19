import mongoose from "mongoose";
import { ILesson } from "../../model/lesson.model.js";
import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import Student from "../student/student.dto.js";
import StartAndEndTime from "../instructor/start-and-end-time.dto.js";

/**
 * Class representing a Lesson.
 * A Lesson is associated with an instructor, students, a schedule, and specific lesson details.
 */
export default class Lesson {
  /**
   * Creates an instance of Lesson.
   * @param lessonId - The unique identifier for the lesson (can be null for new lessons).
   * @param typeLesson - The type of lesson, represented by the `LessonType` enum.
   * @param specialties - An array of specialties for the lesson, from the `Swimming` enum.
   * @param instructorId - The unique identifier of the instructor assigned to the lesson.
   * @param startAndEndTime - The start and end time of the lesson, represented by the `StartAndEndTime` class.
   * @param students - An array of students attending the lesson.
   */
  constructor(
    public lessonId: string | null,
    public typeLesson: LessonType,
    public specialties: Swimming[],
    public instructorId: string,
    public startAndEndTime: StartAndEndTime,
    public students: Student[]
  ) {}

  /**
   * Converts a Mongoose Model (ILesson) to a Lesson DTO.
   * @param lessonDoc - The Mongoose document conforming to the `ILesson` interface.
   * @returns An instance of the Lesson class representing the DTO.
   */
  static fromModel(lessonDoc: ILesson): Lesson {
    return new Lesson(
      lessonDoc._id?.toString() || null, // Convert `_id` to string or keep it null.
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
   * Converts a Lesson DTO to a plain object compatible with the Mongoose Model.
   * @param lesson - An instance of the Lesson DTO.
   * @returns A plain object conforming to the `ILesson` interface, suitable for database operations.
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

    // If lessonId exists, set it as `_id` to ensure updates don't create new documents.
    if (lesson.lessonId) {
      modelData._id = new mongoose.Types.ObjectId(lesson.lessonId);
    }

    return modelData;
  }
}
