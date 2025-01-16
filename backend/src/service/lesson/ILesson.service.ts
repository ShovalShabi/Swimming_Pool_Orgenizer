import Lesson from "../../dto/lesson/lesson.dto.js";
import NewLesson from "../../dto/lesson/new-lesson.dto.js";

export default interface LessonServiceInterface {
  createLesson(lessonData: NewLesson, dayOfTheWeek: number): Promise<Lesson>;
  getLessonById(lessonId: string): Promise<Lesson>;
  getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]>;
  getLessonsOfInstrucorByDay(
    instructorId: string,
    day: Date
  ): Promise<Lesson[]>;
  updateLesson(lessonId: string, lessonData: Lesson): Promise<boolean>;
  deleteLesson(lessonId: string): Promise<boolean>;
  deleteAllLessons(): Promise<boolean>;
}
