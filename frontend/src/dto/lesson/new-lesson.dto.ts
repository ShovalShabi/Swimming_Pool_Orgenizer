import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import StartAndEndTime from "../instructor/start-and-end-time.dto.js";
import Student from "../student/student.dto.js";

/**
 * NewLesson Class
 *
 * Represents the structure for creating a new swimming lesson, including details such as type, specialties, instructor, schedule, and enrolled students.
 *
 * @param {LessonType} typeLesson - The type of the lesson (e.g., private, public, mixed). Defined in `LessonType` enum.
 * @param {string} instructorId - The unique identifier of the instructor conducting the lesson.
 * @param {Swimming[]} specialties - The swimming specialties taught in this lesson. Defined in `Swimming` enum.
 * @param {StartAndEndTime} startAndEndTime - The scheduled start and end time for the lesson.
 * @param {Student[]} students - The list of students to be enrolled in the lesson.
 */
export default class NewLesson {
  /**
   * Constructor for the NewLesson class.
   *
   * @param {LessonType} typeLesson - The type of the lesson.
   * @param {string} instructorId - The unique identifier of the instructor.
   * @param {Swimming[]} specialties - The swimming specialties taught in this lesson.
   * @param {StartAndEndTime} startAndEndTime - The scheduled start and end time for the lesson.
   * @param {Student[]} students - The list of students to be enrolled in the lesson.
   */
  constructor(
    public typeLesson: LessonType,
    public instructorId: string,
    public specialties: Swimming[],
    public startAndEndTime: StartAndEndTime,
    public students: Student[]
  ) {}
}
