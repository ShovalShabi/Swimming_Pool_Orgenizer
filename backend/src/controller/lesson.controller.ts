import { Request, Response } from "express";
import LessonService from "../service/lesson/lesson.service.js";
import LessonServiceInterface from "../service/lesson/ILesson.service.js";

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
    try {
      const dayOfTheWeek: number = parseInt(req.query.day as string);
      const lessonData = req.body;

      const newLesson = await this.lessonService.createLesson(
        lessonData,
        dayOfTheWeek
      );
      return res.status(201).json(newLesson);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieves a lesson by its ID.
   * @param req - The Express request object. Expects `lessonId` as a route parameter.
   * @param res - The Express response object.
   * @returns The lesson with the specified ID.
   */
  async getLessonById(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonId } = req.params;
      const lesson = await this.lessonService.getLessonById(lessonId);

      return res.status(200).json(lesson);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
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
    try {
      const start = new Date(req.query.start as string);
      const end = new Date(req.query.end as string);

      const lessons = await this.lessonService.getAllLessonsWithinRange(
        start,
        end
      );
      return res.status(200).json(lessons);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
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
    try {
      const { instructorId } = req.params;
      const day = new Date(req.query.day as string);

      const lessons = await this.lessonService.getLessonsOfInstrucorByDay(
        instructorId,
        day
      );

      return res.status(200).json(lessons);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Updates a lesson by its ID.
   * @param req - The Express request object. Expects `lessonId` as a route parameter and updated lesson data in the body.
   * @param res - The Express response object.
   * @returns The updated lesson.
   */
  async updateLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonId } = req.params;
      const lessonData = req.body;

      const updatedLesson = await this.lessonService.updateLesson(
        lessonId,
        lessonData
      );

      return res.status(200).json(updatedLesson);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Deletes a lesson by its ID.
   * @param req - The Express request object. Expects `lessonId` as a route parameter.
   * @param res - The Express response object.
   * @returns A success message confirming the deletion.
   */
  async deleteLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonId } = req.params;
      await this.lessonService.deleteLesson(lessonId);

      return res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Deletes all lessons.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A success message confirming the deletion of all lessons.
   */
  async deleteAllLessons(req: Request, res: Response): Promise<Response> {
    try {
      await this.lessonService.deleteAllLessons();
      return res
        .status(200)
        .json({ message: "All lessons deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
