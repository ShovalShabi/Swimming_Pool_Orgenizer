import Lesson from "../../dto/lesson/lesson.dto.js";
import NewLesson from "../../dto/lesson/new-lesson.dto.js";

export default interface LessonRepositoryInterface {
  createLesson(lessonData: NewLesson): Promise<Lesson>;
  getLessonById(lessonId: string): Promise<Lesson | null>;
  getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]>;
  getInstructorLessons(instructorId: string): Promise<Lesson[]>;
  updateLesson(
    lessonId: string,
    lessonData: Partial<Lesson>
  ): Promise<Lesson | null>;
  deleteLesson(lessonId: string): Promise<boolean>;
  deleteAllLessons(): Promise<boolean>;
}
