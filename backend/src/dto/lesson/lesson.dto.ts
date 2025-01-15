import LessonModel, { ILesson } from "../../model/lesson.model.js";
import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import Student from "../student/student.dto.js";

// Lesson Class
export default class Lesson {
  constructor(
    public lessonId: string,
    public typeLesson: LessonType,
    public specialties: Swimming[],
    public instructorId: string,
    public dateAndTime: Date,
    public duration: number,
    public students: Student[]
  ) {}

  /**
   * Convert Mongoose Model (ILesson) to Lesson DTO
   * @param lessonDoc - Mongoose document (ILesson)
   * @returns Instance of Lesson DTO
   */
  static fromModel(lessonDoc: ILesson): Lesson {
    return new Lesson(
      lessonDoc.lessonId,
      lessonDoc.typeLesson,
      lessonDoc.specialties,
      lessonDoc.instructorId,
      lessonDoc.dateAndTime,
      lessonDoc.duration,
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
  toModel(): ILesson {
    return new LessonModel({
      lessonId: this.lessonId,
      typeLesson: this.typeLesson,
      specialties: this.specialties,
      instructorId: this.instructorId,
      dateAndTime: this.dateAndTime,
      duration: this.duration,
      students: this.students.map((student) => ({
        name: student.name,
        preferences: student.preferences,
        lessonType: student.lessonType,
      })),
    });
  }
}
