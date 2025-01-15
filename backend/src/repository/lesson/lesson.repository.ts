import Lesson from "../../dto/lesson/lesson.dto.js";
import NewLesson from "../../dto/lesson/new-lesson.dto.js";
import LessonModel, { ILesson } from "../../model/lesson.model.js";
import LessonRepositoryInterface from "./ILesson.repository.js";

export default class LessonRepository implements LessonRepositoryInterface {
  async createLesson(lessonData: NewLesson): Promise<Lesson> {
    const lesson = new LessonModel(lessonData);
    const savedLesson: ILesson = await lesson.save();
    return savedLesson.toObject();
  }

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    return LessonModel.findById(lessonId).lean().exec();
  }

  async getAllLessons(start: Date, end: Date): Promise<Lesson[]> {
    return LessonModel.find({ dateAndTime: { $gte: start, $lte: end } })
      .lean()
      .exec();
  }

  async updateLesson(
    lessonId: string,
    lessonData: Partial<Lesson>
  ): Promise<Lesson | null> {
    return LessonModel.findByIdAndUpdate(lessonId, lessonData, { new: true })
      .lean()
      .exec();
  }

  async deleteLesson(lessonId: string): Promise<boolean> {
    const result = await LessonModel.findByIdAndDelete(lessonId).exec();
    return result !== null;
  }

  async deleteAllLessons(): Promise<boolean> {
    const result = await LessonModel.deleteMany({}).exec();
    return result.acknowledged;
  }
}
