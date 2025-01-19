import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";

/**
 * Class representing a student.
 * This class is used to define the details of a student, including their name, preferences, and lesson type.
 */
export default class Student {
  /**
   * Creates an instance of Student.
   * @param name - The name of the student.
   * @param preferences - An array of swimming preferences, represented by the `Swimming` enum
   *                      (e.g., [Swimming.FREESTYLE, Swimming.BACKSTROKE]).
   * @param lessonType - The type of lesson the student prefers, represented by the `LessonType` enum (e.g., LessonType.PUBLIC).
   */
  constructor(
    public name: string,
    public preferences: Swimming[], // e.g., [Swimming.FREESTYLE, Swimming.BACKSTROKE]
    public lessonType: LessonType // e.g., LessonType.PUBLIC
  ) {}
}
