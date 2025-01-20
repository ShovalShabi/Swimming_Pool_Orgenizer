import Lesson from "../../dto/lesson/lesson.dto.js";

/**
 * Interface for the Lesson Repository.
 * Defines the contract for managing lesson data in the data source.
 */
export default interface LessonRepositoryInterface {
  /**
   * Creates a new lesson in the data source.
   * @param lessonData - The data for the new lesson.
   * @returns A promise that resolves to the newly created lesson.
   */
  createLesson(lessonData: Lesson): Promise<Lesson>;

  /**
   * Retrieves a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson.
   * @returns A promise that resolves to the lesson, or `null` if not found.
   */
  getLessonById(lessonId: string): Promise<Lesson | null>;

  /**
   * Retrieves all lessons within a specified date range.
   * @param start - The start date of the range.
   * @param end - The end date of the range.
   * @returns A promise that resolves to an array of lessons within the specified range.
   */
  getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]>;

  /**
   * Retrieves all lessons associated with a specific instructor.
   * @param instructorId - The unique identifier of the instructor.
   * @returns A promise that resolves to an array of lessons taught by the specified instructor.
   */
  getInstructorLessons(instructorId: string): Promise<Lesson[]>;

  /**
   * Updates an existing lesson in the data source.
   * @param lessonId - The unique identifier of the lesson to update.
   * @param lessonData - The updated lesson data. Partial updates are allowed.
   * @returns A promise that resolves to the updated lesson, or `null` if the lesson does not exist.
   */
  updateLesson(
    lessonId: string,
    lessonData: Partial<Lesson>
  ): Promise<Lesson | null>;

  /**
   * Deletes a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson to delete.
   * @returns A promise that resolves to `true` if the lesson was successfully deleted, or `false` otherwise.
   */
  deleteLesson(lessonId: string): Promise<boolean>;

  /**
   * Deletes all lessons for a specific instructor.
   * @param instructorId - The unique identifier of the instructor whose lessons should be deleted.
   * @returns A promise that resolves to the number of lessons deleted.
   */
  deleteLessonsByInstructorId(instructorId: string): Promise<number>;

  /**
   * Deletes all lessons from the data source.
   * @returns A promise that resolves to `true` if all lessons were successfully deleted, or `false` otherwise.
   */
  deleteAllLessons(): Promise<boolean>;
}
