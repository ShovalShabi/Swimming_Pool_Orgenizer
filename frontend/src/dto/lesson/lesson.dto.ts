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
}
