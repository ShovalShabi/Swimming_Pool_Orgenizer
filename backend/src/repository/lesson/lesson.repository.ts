import Lesson from "../../dto/lesson/lesson.dto.js";
import NewLesson from "../../dto/lesson/new-lesson.dto.js";
import LessonModel, { ILesson } from "../../model/lesson.model.js";
import LessonRepositoryInterface from "./ILesson.repository.js";

export default class LessonRepository implements LessonRepositoryInterface {
  /**
   * Creates a new lesson and returns it as a Lesson DTO.
   * @param lessonData NewLesson DTO
   * @returns Created Lesson DTO
   */
  async createLesson(lessonData: NewLesson): Promise<Lesson> {
    const lessonModel = new LessonModel(lessonData);
    const savedLesson: ILesson = await lessonModel.save();
    return Lesson.fromModel(savedLesson);
  }

  /**
   * Retrieves a lesson by its ID.
   * @param lessonId Lesson ID (UUID)
   * @returns Lesson DTO if found, otherwise null
   */
  async getLessonById(lessonId: string): Promise<Lesson | null> {
    const lessonDoc = await LessonModel.findOne({ _id: lessonId }).exec();
    return lessonDoc ? Lesson.fromModel(lessonDoc) : null;
  }

  /**
   * Retrieves all lessons within a date range.
   * @param start Start Date
   * @param end End Date
   * @returns Array of Lesson DTOs
   */
  async getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]> {
    const lessonDocs = await LessonModel.find({
      startTime: { $gte: start, $lte: end },
    }).exec();
    return lessonDocs.map(Lesson.fromModel);
  }

  async getInstructorLessons(instructorId: string): Promise<Lesson[]> {
    const lessonDocs = await LessonModel.find({ instructorId });
    return lessonDocs.map((doc) => Lesson.fromModel(doc));
  }

  /**
   * Updates a lesson by its ID.
   * @param lessonId Lesson ID
   * @param lessonData Update of Lesson DTO
   * @returns True if update was successful, otherwise false
   */
  async updateLesson(
    lessonId: string,
    lessonData: Lesson
  ): Promise<Lesson | null> {
    const updatedLesson = await LessonModel.findOneAndUpdate(
      { _id: lessonId },
      Lesson.toModel(lessonData)
    ).exec();
    return updatedLesson ? Lesson.fromModel(updatedLesson) : null;
  }

  /**
   * Deletes a lesson by its ID.
   * @param lessonId Lesson ID
   * @returns True if deletion was successful, otherwise false
   */
  async deleteLesson(lessonId: string): Promise<boolean> {
    const result = await LessonModel.findOneAndDelete({ _id: lessonId }).exec();
    return result !== null;
  }

  /**
   * Deletes all lessons from the database.
   * @returns True if at least one lesson was deleted, otherwise false
   */
  async deleteAllLessons(): Promise<boolean> {
    const result = await LessonModel.deleteMany({}).exec();
    return result.deletedCount > 0;
  }
}
