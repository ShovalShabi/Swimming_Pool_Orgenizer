import axios from "axios";
import NewLesson from "../dto/lesson/new-lesson.dto";
import Lesson from "../dto/lesson/lesson.dto";
import getEnvVariables from "../etc/load-variables";

const { backendServerURL } = getEnvVariables();

const BASE_URL = `${backendServerURL}/lesson`;

export default class LessonService {
  // Create New Lesson
  static async createLesson(
    newLesson: NewLesson,
    day: number
  ): Promise<Lesson> {
    const response = await axios.post<Lesson>(BASE_URL, newLesson, {
      params: { day },
    });
    return response.data;
  }

  // Get Lesson by Lesson ID
  static async getLessonById(lessonId: string): Promise<Lesson> {
    const response = await axios.get<Lesson>(`${BASE_URL}/${lessonId}`);
    return response.data;
  }

  // Update Lesson
  static async updateLesson(
    lessonId: string,
    updatedLesson: Lesson
  ): Promise<Lesson> {
    const response = await axios.put<Lesson>(
      `${BASE_URL}/${lessonId}`,
      updatedLesson
    );
    return response.data;
  }

  // Delete Lesson by ID
  static async deleteLessonById(lessonId: string): Promise<void> {
    await axios.delete(`${BASE_URL}/${lessonId}`);
  }

  // Get All Lessons Between Date Range
  static async getLessonsWithinRange(
    start: string,
    end: string
  ): Promise<Lesson[]> {
    const response = await axios.get<Lesson[]>(BASE_URL, {
      params: { start, end },
    });
    return response.data;
  }

  // Get Instructor's Lessons by Specific Date
  static async getLessonsOfInstructorByDay(
    instructorId: string,
    day: string
  ): Promise<Lesson[]> {
    const response = await axios.get<Lesson[]>(
      `${BASE_URL}/instructor/${instructorId}/day`,
      { params: { day } }
    );
    return response.data;
  }
}
