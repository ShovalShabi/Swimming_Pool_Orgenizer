import path from "path";
import Lesson from "../../dto/lesson/lesson.dto.js";
import LessonModel, { ILesson } from "../../model/lesson.model.js";
import LessonRepositoryInterface from "./ILesson.repository.js";
import { createCustomLogger } from "../../etc/logger.etc.js";

// Initialize logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

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
    logger.info("Creating a new lesson in the database.");
    try {
      const lessonModel = new LessonModel(Lesson.toModel(lessonData));
      const savedLesson: ILesson = await lessonModel.save();
      logger.info(`Lesson created successfully with ID: ${savedLesson._id}`);
      return Lesson.fromModel(savedLesson);
    } catch (error: any) {
      logger.error(`Failed to create lesson: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieves a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson.
   * @returns A promise that resolves to the lesson as a DTO if found, otherwise `null`.
   */
  async getLessonById(lessonId: string): Promise<Lesson | null> {
    logger.info(`Fetching lesson with ID: ${lessonId}`);
    try {
      const lessonDoc = await LessonModel.findOne({ _id: lessonId }).exec();
      if (lessonDoc) {
        logger.info(`Lesson with ID ${lessonId} retrieved successfully.`);
        return Lesson.fromModel(lessonDoc);
      }
      logger.warn(`Lesson with ID ${lessonId} not found.`);
      return null;
    } catch (error: any) {
      logger.error(
        `Failed to fetch lesson with ID ${lessonId}: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Retrieves all lessons within a specified date range.
   * @param start - The start date of the range.
   * @param end - The end date of the range.
   * @returns A promise that resolves to an array of lessons as DTOs.
   */
  async getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]> {
    logger.info(`Fetching lessons within the range: ${start} to ${end}`);
    try {
      const lessonDocs = await LessonModel.find({
        "startAndEndTime.startTime": { $gte: start, $lte: end },
      }).exec();
      logger.info(
        `Retrieved ${lessonDocs.length} lessons within the specified range.`
      );
      return lessonDocs.map(Lesson.fromModel);
    } catch (error: any) {
      logger.error(`Failed to fetch lessons within range: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieves all lessons associated with a specific instructor.
   * @param instructorId - The unique identifier of the instructor.
   * @returns A promise that resolves to an array of lessons as DTOs.
   */
  async getInstructorLessons(instructorId: string): Promise<Lesson[]> {
    logger.info(`Fetching lessons for instructor with ID: ${instructorId}`);
    try {
      const lessonDocs = await LessonModel.find({ instructorId }).exec();
      logger.info(
        `Retrieved ${lessonDocs.length} lessons for instructor with ID: ${instructorId}`
      );
      return lessonDocs.map((doc) => Lesson.fromModel(doc));
    } catch (error: any) {
      logger.error(
        `Failed to fetch lessons for instructor with ID ${instructorId}: ${error.message}`
      );
      throw error;
    }
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
    logger.info(`Updating lesson with ID: ${lessonId}`);
    try {
      const updatedLesson = await LessonModel.findOneAndUpdate(
        { _id: lessonId },
        Lesson.toModel(lessonData),
        { new: true } // Ensures the updated document is returned
      ).exec();
      if (updatedLesson) {
        logger.info(`Lesson with ID ${lessonId} updated successfully.`);
        return Lesson.fromModel(updatedLesson);
      }
      logger.warn(`Lesson with ID ${lessonId} not found for update.`);
      return null;
    } catch (error: any) {
      logger.error(
        `Failed to update lesson with ID ${lessonId}: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Deletes a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson to delete.
   * @returns A promise that resolves to `true` if the lesson was successfully deleted, otherwise `false`.
   */
  async deleteLesson(lessonId: string): Promise<boolean> {
    logger.info(`Deleting lesson with ID: ${lessonId}`);
    try {
      const result = await LessonModel.findOneAndDelete({
        _id: lessonId,
      }).exec();
      logger.info(`Lesson with ID ${lessonId} deleted successfully.`);
      return result !== null;
    } catch (error: any) {
      logger.error(
        `Failed to delete lesson with ID ${lessonId}: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Deletes all lessons for a specific instructor.
   * @param instructorId - The unique identifier of the instructor whose lessons should be deleted.
   * @returns A promise that resolves to the number of lessons deleted.
   */
  async deleteLessonsByInstructorId(instructorId: string): Promise<number> {
    logger.info(`Deleting all lessons for instructor with ID: ${instructorId}`);
    try {
      const result = await LessonModel.deleteMany({ instructorId }).exec();
      logger.info(
        `Deleted ${result.deletedCount} lessons for instructor with ID: ${instructorId}`
      );
      return result.deletedCount || 0;
    } catch (error: any) {
      logger.error(
        `Failed to delete lessons for instructor with ID ${instructorId}: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Deletes all lessons from the database.
   * @returns A promise that resolves to `true` if at least one lesson was deleted, otherwise `false`.
   */
  async deleteAllLessons(): Promise<boolean> {
    logger.info("Deleting all lessons from the database.");
    try {
      const result = await LessonModel.deleteMany({}).exec();
      logger.info("All lessons deleted successfully.");
      return result.deletedCount > 0;
    } catch (error: any) {
      logger.error(`Failed to delete all lessons: ${error.message}`);
      throw error;
    }
  }
}
