import { Request, Response } from "express";
import LessonService from "../service/lesson/lesson.service.js";
import LessonServiceInterface from "../service/lesson/ILesson.service.js";

export default class LessonController {
  private lessonService: LessonServiceInterface;

  constructor() {
    this.lessonService = new LessonService();
  }

  // 1. Create a new lesson
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

  // 2. Get a lesson by ID
  async getLessonById(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonId } = req.params;
      const lesson = await this.lessonService.getLessonById(lessonId);

      return res.status(200).json(lesson);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 3. Retrieve all lessons within a range
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

  // 4. Get lessons of an instructor by day
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

  // 5. Update a lesson by ID
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

  // 6. Delete a lesson by ID
  async deleteLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonId } = req.params;
      await this.lessonService.deleteLesson(lessonId);

      return res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 7. Delete all lessons
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
