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
}
