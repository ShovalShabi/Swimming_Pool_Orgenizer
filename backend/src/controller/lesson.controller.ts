import { Request, Response } from "express";
import LessonService from "../service/lesson.service.js";

export default class LessonController {
  private lessonService: LessonService;

  constructor() {
    this.lessonService = new LessonService();
  }

  // 1. Create a new lesson
  async createLesson(req: Request, res: Response): Promise<Response> {
    try {
      const lessonData = req.body;
      const newLesson = await this.lessonService.createLesson(lessonData);
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
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      return res.status(200).json(lesson);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 3. Retrieve all lessons
  async getAllLessons(req: Request, res: Response): Promise<Response> {
    try {
      const start: Date = new Date(req.params.start);
      const end: Date = new Date(req.params.end);
      const lessons = await this.lessonService.getAllLessons(start, end);
      return res.status(200).json(lessons);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 4. Update a lesson by ID
  async updateLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonId } = req.params;
      const lessonData = req.body;
      const updatedLesson = await this.lessonService.updateLesson(
        lessonId,
        lessonData
      );
      if (!updatedLesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      return res.status(200).json(updatedLesson);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 5. Delete a lesson by ID
  async deleteLesson(req: Request, res: Response): Promise<Response> {
    try {
      const { lessonId } = req.params;
      await this.lessonService.deleteLesson(lessonId);

      return res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 6. Delete all lessons
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
