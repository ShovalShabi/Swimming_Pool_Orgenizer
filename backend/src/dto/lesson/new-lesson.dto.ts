import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import StartAndEndTime from "../instructor/start-and-end-time.dto.js";
import Student from "../student/student.dto.js";

/**
 * Class representing a new lesson.
 * This class is used to create a new lesson without an existing unique identifier.
 */
export default class NewLesson {
  /**
   * Creates an instance of NewLesson.
   * @param typeLesson - The type of lesson, represented by the `LessonType` enum.
   * @param instructorId - The unique identifier of the instructor assigned to the lesson.
   * @param specialties - An array of specialties for the lesson, from the `Swimming` enum.
   * @param startAndEndTime - The start and end time of the lesson, represented by the `StartAndEndTime` class.
   * @param students - An array of students attending the lesson, represented by the `Student` class.
   */
  constructor(
    public typeLesson: LessonType,
    public instructorId: string,
    public specialties: Swimming[],
    public startAndEndTime: StartAndEndTime,
    public students: Student[]
  ) {}
}
