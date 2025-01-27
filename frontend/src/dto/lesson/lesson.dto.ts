import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import Student from "../student/student.dto.js";
import StartAndEndTime from "../instructor/start-and-end-time.dto.js";

/**
 * Lesson Class
 *
 * Represents a swimming lesson with various details such as type, specialties, instructor, schedule, and enrolled students.
 *
 * @param {string | null} lessonId - The unique identifier of the lesson. Can be `null` for new lessons.
 * @param {LessonType} typeLesson - The type of the lesson (e.g., private, public, mixed). Defined in `LessonType` enum.
 * @param {Swimming[]} specialties - The swimming specialties taught in this lesson. Defined in `Swimming` enum.
 * @param {string} instructorId - The unique identifier of the instructor conducting the lesson.
 * @param {StartAndEndTime} startAndEndTime - The scheduled start and end time for the lesson.
 * @param {Student[]} students - The list of students enrolled in the lesson.
 */
export default class Lesson {
  /**
   * Constructor for the Lesson class.
   *
   * @param {string | null} lessonId - The unique identifier of the lesson.
   * @param {LessonType} typeLesson - The type of the lesson.
   * @param {Swimming[]} specialties - The swimming specialties taught in this lesson.
   * @param {string} instructorId - The unique identifier of the instructor.
   * @param {StartAndEndTime} startAndEndTime - The scheduled start and end time for the lesson.
   * @param {Student[]} students - The list of students enrolled in the lesson.
   */
  constructor(
    public lessonId: string | null,
    public typeLesson: LessonType,
    public specialties: Swimming[],
    public instructorId: string,
    public startAndEndTime: StartAndEndTime,
    public students: Student[]
  ) {}
}
