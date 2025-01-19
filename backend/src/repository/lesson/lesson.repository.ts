import Lesson from "../../dto/lesson/lesson.dto.js";
import NewLesson from "../../dto/lesson/new-lesson.dto.js";
import LessonModel, { ILesson } from "../../model/lesson.model.js";
import LessonRepositoryInterface from "./ILesson.repository.js";

/**
 * Repository for managing lesson data.
 * Implements the `LessonRepositoryInterface` to interact with the database.
 */
export default class LessonRepository implements LessonRepositoryInterface {
  /**
   * Creates a new lesson and saves it in the database.
   * @param lessonData - The data for the new lesson.
   * @returns A promise that resolves to the created lesson as a DTO.
   */
  async createLesson(lessonData: Lesson): Promise<Lesson> {
    const lessonModel = new LessonModel(Lesson.toModel(lessonData));
    const savedLesson: ILesson = await lessonModel.save();
    return Lesson.fromModel(savedLesson);
  }

  /**
   * Retrieves a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson.
   * @returns A promise that resolves to the lesson as a DTO if found, otherwise `null`.
   */
  async getLessonById(lessonId: string): Promise<Lesson | null> {
    const lessonDoc = await LessonModel.findOne({ _id: lessonId }).exec();
    return lessonDoc ? Lesson.fromModel(lessonDoc) : null;
  }

  /**
   * Retrieves all lessons within a specified date range.
   * @param start - The start date of the range.
   * @param end - The end date of the range.
   * @returns A promise that resolves to an array of lessons as DTOs.
   */
  async getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]> {
    const lessonDocs = await LessonModel.find({
      "startAndEndTime.startTime": { $gte: start, $lte: end },
    }).exec();
    return lessonDocs.map(Lesson.fromModel);
  }

  /**
   * Retrieves all lessons associated with a specific instructor.
   * @param instructorId - The unique identifier of the instructor.
   * @returns A promise that resolves to an array of lessons as DTOs.
   */
  async getInstructorLessons(instructorId: string): Promise<Lesson[]> {
    const lessonDocs = await LessonModel.find({ instructorId }).exec();
    return lessonDocs.map((doc) => Lesson.fromModel(doc));
  }

  /**
   * Updates a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson to update.
   * @param lessonData - The updated lesson data.
   * @returns A promise that resolves to the updated lesson as a DTO if successful, otherwise `null`.
   */
  async updateLesson(
    lessonId: string,
    lessonData: Lesson
  ): Promise<Lesson | null> {
    const updatedLesson = await LessonModel.findOneAndUpdate(
      { _id: lessonId },
      Lesson.toModel(lessonData),
      { new: true } // Ensures the updated document is returned
    ).exec();
    return updatedLesson ? Lesson.fromModel(updatedLesson) : null;
  }

  /**
   * Deletes a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson to delete.
   * @returns A promise that resolves to `true` if the lesson was successfully deleted, otherwise `false`.
   */
  async deleteLesson(lessonId: string): Promise<boolean> {
    const result = await LessonModel.findOneAndDelete({ _id: lessonId }).exec();
    return result !== null;
  }

  /**
   * Deletes all lessons from the database.
   * @returns A promise that resolves to `true` if at least one lesson was deleted, otherwise `false`.
   */
  async deleteAllLessons(): Promise<boolean> {
    const result = await LessonModel.deleteMany({}).exec();
    return result.deletedCount > 0;
  }
}
