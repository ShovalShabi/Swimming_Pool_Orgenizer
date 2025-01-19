import Lesson from "../../dto/lesson/lesson.dto.js";
import NewLesson from "../../dto/lesson/new-lesson.dto.js";

/**
 * Interface for the Lesson Service.
 * Defines the contract for operations related to lesson management.
 */
export default interface LessonServiceInterface {
  /**
   * Creates a new lesson.
   * @param lessonData - The data for the new lesson.
   * @param dayOfTheWeek - The day of the week for the lesson (0 for Sunday, 1 for Monday, etc.).
   * @returns A promise that resolves to the newly created lesson.
   */
  createLesson(lessonData: NewLesson, dayOfTheWeek: number): Promise<Lesson>;

  /**
   * Retrieves a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson.
   * @returns A promise that resolves to the lesson with the specified ID.
   */
  getLessonById(lessonId: string): Promise<Lesson>;

  /**
   * Retrieves all lessons within a specified date range.
   * @param start - The start date of the range.
   * @param end - The end date of the range.
   * @returns A promise that resolves to an array of lessons within the specified range.
   */
  getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]>;

  /**
   * Retrieves all lessons for a specific instructor on a specific day.
   * @param instructorId - The unique identifier of the instructor.
   * @param day - The specific day to retrieve lessons for.
   * @returns A promise that resolves to an array of lessons for the instructor on the specified day.
   */
  getLessonsOfInstrucorByDay(
    instructorId: string,
    day: Date
  ): Promise<Lesson[]>;

  /**
   * Updates a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson to update.
   * @param lessonData - The updated lesson data.
   * @returns A promise that resolves to the updated lesson or `null` if not found.
   */
  updateLesson(lessonId: string, lessonData: Lesson): Promise<Lesson | null>;

  /**
   * Deletes a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson to delete.
   * @returns A promise that resolves to `true` if the lesson was successfully deleted, otherwise `false`.
   */
  deleteLesson(lessonId: string): Promise<boolean>;

  /**
   * Deletes all lessons.
   * @returns A promise that resolves to `true` if all lessons were successfully deleted, otherwise `false`.
   */
  deleteAllLessons(): Promise<boolean>;
}
