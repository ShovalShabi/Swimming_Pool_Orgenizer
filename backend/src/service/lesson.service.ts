import Lesson from "../dto/lesson/lesson.dto.js";
import NewLesson from "../dto/lesson/new-lesson.dto.js";
import LessonRepositoryInterface from "../repository/lesson/ILesson.repository.js";
import LessonRepository from "../repository/lesson/lesson.repository.js";

export default class LessonService {
  private lessonRepository: LessonRepositoryInterface;

  constructor() {
    this.lessonRepository = new LessonRepository();
  }

  async createLesson(lessonData: NewLesson): Promise<Lesson> {
    return this.lessonRepository.createLesson(lessonData);
  }

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    return this.lessonRepository.getLessonById(lessonId);
  }

  async getAllLessons(start: Date, end: Date): Promise<Lesson[]> {
    return this.lessonRepository.getAllLessons(start, end);
  }

  async updateLesson(
    lessonId: string,
    lessonData: Partial<Lesson>
  ): Promise<Lesson | null> {
    return this.lessonRepository.updateLesson(lessonId, lessonData);
  }

  async deleteLesson(lessonId: string): Promise<boolean> {
    return this.lessonRepository.deleteLesson(lessonId);
  }

  async deleteAllLessons(): Promise<boolean> {
    return this.lessonRepository.deleteAllLessons();
  }
}
