import path from "path";
import { Request, Response } from "express";
import LessonService from "../service/lesson/lesson.service.js";
import LessonServiceInterface from "../service/lesson/ILesson.service.js";
import { createCustomLogger } from "../etc/logger.etc.js";

// Initialize logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

/**
 * Controller for handling lesson-related operations.
 */
export default class LessonController {
  private lessonService: LessonServiceInterface;

  constructor() {
    this.lessonService = new LessonService();
  }

  /**
   * Creates a new lesson.
   * @param req - The Express request object. Expects lesson data in the body and `day` as a query parameter.
   * @param res - The Express response object.
   * @returns The newly created lesson.
   */
  async createLesson(req: Request, res: Response): Promise<Response> {
    logger.info("Received request to create a new lesson.");
    try {
      const dayOfTheWeek: number = parseInt(req.query.day as string);
      const lessonData = req.body;

      logger.info(
        `Creating lesson for day ${dayOfTheWeek} with data: ${JSON.stringify(
          lessonData
        )}`
      );
      const newLesson = await this.lessonService.createLesson(
        lessonData,
        dayOfTheWeek
      );
      logger.info(`Lesson created successfully with ID: ${newLesson.lessonId}`);
      return res.status(201).json(newLesson);
    } catch (error: any) {
      logger.error("Error creating lesson:", error);
      const errorMessage =
        process.env.NODE_ENV !== "prod"
          ? error.message
          : "An error occurred during lesson creation.";
      return res.status(error.status || 500).json({ error: errorMessage });
    }
  }

  /**
   * Retrieves a lesson by its ID.
   * @param req - The Express request object. Expects `lessonId` as a route parameter.
   * @param res - The Express response object.
   * @returns The lesson with the specified ID.
   */
  async getLessonById(req: Request, res: Response): Promise<Response> {
    const { lessonId } = req.params;
    logger.info(`Received request to fetch lesson with ID: ${lessonId}`);
    try {
      const lesson = await this.lessonService.getLessonById(lessonId);
      logger.info(`Lesson with ID ${lessonId} retrieved successfully.`);
      return res.status(200).json(lesson);
    } catch (error: any) {
      logger.error(`Error fetching lesson with ID ${lessonId}:`, error);
      const errorMessage =
        process.env.NODE_ENV !== "prod"
          ? error.message
          : `An error occurred while retriving a lesson with ID ${lessonId}.`;
      return res.status(error.status || 500).json({ error: errorMessage });
    }
  }

  /**
   * Retrieves all lessons within a specified date range.
   * @param req - The Express request object. Expects `start` and `end` as query parameters.
   * @param res - The Express response object.
   * @returns A list of lessons within the specified range.
   */
  async getAllLessonsWithinRange(
    req: Request,
    res: Response
  ): Promise<Response> {
    const start = new Date(req.query.start as string);
    const end = new Date(req.query.end as string);
    logger.info(
      `Received request to fetch lessons within range: ${start} to ${end}`
    );
    try {
      const lessons = await this.lessonService.getAllLessonsWithinRange(
        start,
        end
      );
      logger.info(
        `Retrieved ${lessons.length} lessons within the specified range.`
      );
      return res.status(200).json(lessons);
    } catch (error: any) {
      logger.error("Error fetching lessons within the specified range:", error);
      const errorMessage =
        process.env.NODE_ENV !== "prod"
          ? error.message
          : `An error occurred during lessons retrieval in range ${start.toLocaleDateString()} - ${end.toLocaleDateString()}.`;
      return res.status(error.status || 500).json({ error: errorMessage });
    }
  }

  /**
   * Retrieves lessons of a specific instructor for a specific day.
   * @param req - The Express request object. Expects `instructorId` as a route parameter and `day` as a query parameter.
   * @param res - The Express response object.
   * @returns A list of lessons for the specified instructor on the specified day.
   */
  async getLessonsOfInstructorByDay(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { instructorId } = req.params;
    const day = new Date(req.query.day as string);
    logger.info(
      `Received request to fetch lessons for instructor ${instructorId} on day ${day}`
    );
    try {
      const lessons = await this.lessonService.getLessonsOfInstrucorByDay(
        instructorId,
        day
      );
      logger.info(
        `Retrieved ${lessons.length} lessons for instructor ${instructorId} on day ${day}.`
      );
      return res.status(200).json(lessons);
    } catch (error: any) {
      logger.error(
        `Error fetching lessons for instructor ${instructorId} on day ${day}:`,
        error
      );
      const errorMessage =
        process.env.NODE_ENV !== "prod"
          ? error.message
          : `An error occurred while retriving instructor ${instructorId} by day ${day}.`;
      return res.status(error.status || 500).json({ error: errorMessage });
    }
  }

  /**
   * Updates a lesson by its ID.
   * @param req - The Express request object. Expects `lessonId` as a route parameter and updated lesson data in the body.
   * @param res - The Express response object.
   * @returns The updated lesson.
   */
  async updateLesson(req: Request, res: Response): Promise<Response> {
    const { lessonId } = req.params;
    const lessonData = req.body;
    logger.info(`Received request to update lesson with ID: ${lessonId}`);
    try {
      logger.info(`Updating lesson with data: ${JSON.stringify(lessonData)}`);
      const updatedLesson = await this.lessonService.updateLesson(
        lessonId,
        lessonData
      );
      logger.info(`Lesson with ID ${lessonId} updated successfully.`);
      return res.status(200).json(updatedLesson);
    } catch (error: any) {
      logger.error(`Error updating lesson with ID ${lessonId}:`, error);
      const errorMessage =
        process.env.NODE_ENV !== "prod"
          ? error.message
          : `An error occurred while updating a lesson with ID ${lessonId}.`;
      return res.status(error.status || 500).json({ error: errorMessage });
    }
  }

  /**
   * Deletes a lesson by its ID.
   * @param req - The Express request object. Expects `lessonId` as a route parameter.
   * @param res - The Express response object.
   * @returns A success message confirming the deletion.
   */
  async deleteLesson(req: Request, res: Response): Promise<Response> {
    const { lessonId } = req.params;
    logger.info(`Received request to delete lesson with ID: ${lessonId}`);
    try {
      await this.lessonService.deleteLesson(lessonId);
      logger.info(`Lesson with ID ${lessonId} deleted successfully.`);
      return res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error: any) {
      logger.error(`Error deleting lesson with ID ${lessonId}:`, error);
      const errorMessage =
        process.env.NODE_ENV !== "prod"
          ? error.message
          : `An error occurred while deleting a lesson with ID ${lessonId}.`;
      return res.status(error.status || 500).json({ error: errorMessage });
    }
  }

  /**
   * Deletes all lessons.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A success message confirming the deletion of all lessons.
   */
  async deleteAllLessons(req: Request, res: Response): Promise<Response> {
    logger.info("Received request to delete all lessons.");
    try {
      await this.lessonService.deleteAllLessons();
      logger.info("All lessons deleted successfully.");
      return res
        .status(200)
        .json({ message: "All lessons deleted successfully" });
    } catch (error: any) {
      logger.error("Error deleting all lessons:", error);
      const errorMessage =
        process.env.NODE_ENV !== "prod"
          ? error.message
          : `An error occurred while deleting all lessons.`;
      return res.status(error.status || 500).json({ error: errorMessage });
    }
  }
}
