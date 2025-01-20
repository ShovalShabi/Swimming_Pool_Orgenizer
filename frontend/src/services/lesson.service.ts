import axios from "axios";
import NewLesson from "../dto/lesson/new-lesson.dto";
import Lesson from "../dto/lesson/lesson.dto";
import getEnvVariables from "../etc/load-variables";

const { backendServerURL } = getEnvVariables();

const BASE_URL = `${backendServerURL}/lesson`;

export default class LessonService {
  // Helper to wrap requests with error handling
  static async requestWrapper<T>(request: () => Promise<T>): Promise<T> {
    try {
      return await request();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Re-throw the Axios error for the caller to handle
        throw error;
      }
      // If it's not an AxiosError, throw a generic error
      throw new Error("An unexpected error occurred");
    }
  }

  // Create New Lesson
  static async createLesson(
    newLesson: NewLesson,
    day: number
  ): Promise<Lesson> {
    return this.requestWrapper(() =>
      axios
        .post<Lesson>(BASE_URL, newLesson, { params: { day } })
        .then((res) => res.data)
    );
  }

  // Get Lesson by Lesson ID
  static async getLessonById(lessonId: string): Promise<Lesson> {
    return this.requestWrapper(() =>
      axios.get<Lesson>(`${BASE_URL}/${lessonId}`).then((res) => res.data)
    );
  }

  // Update Lesson
  static async updateLesson(
    lessonId: string,
    updatedLesson: Lesson
  ): Promise<Lesson> {
    return this.requestWrapper(() =>
      axios
        .put<Lesson>(`${BASE_URL}/${lessonId}`, updatedLesson)
        .then((res) => res.data)
    );
  }

  // Delete Lesson by ID
  static async deleteLessonById(lessonId: string): Promise<void> {
    return this.requestWrapper(() =>
      axios.delete(`${BASE_URL}/${lessonId}`).then(() => undefined)
    );
  }

  // Get All Lessons Between Date Range
  static async getLessonsWithinRange(
    start: Date,
    end: Date
  ): Promise<Lesson[]> {
    return this.requestWrapper(() =>
      axios
        .get<Lesson[]>(BASE_URL, { params: { start, end } })
        .then((res) => res.data)
    );
  }

  // Get Instructor's Lessons by Specific Date
  static async getLessonsOfInstructorByDay(
    instructorId: string,
    day: Date
  ): Promise<Lesson[]> {
    return this.requestWrapper(() =>
      axios
        .get<Lesson[]>(`${BASE_URL}/instructor/${instructorId}/day`, {
          params: { day },
        })
        .then((res) => res.data)
    );
  }
}
