import axios from "axios";
import NewLesson from "../dto/lesson/new-lesson.dto";
import Lesson from "../dto/lesson/lesson.dto";
import getEnvVariables from "../etc/load-variables";

const { backendServerURL } = getEnvVariables();

const BASE_URL = `${backendServerURL}/lesson`;

/**
 * LessonService
 *
 * Provides static methods for managing lessons, including creating, updating, deleting, and fetching lesson data.
 * All methods interact with the backend server using Axios.
 *
 * @module LessonService
 */
export default class LessonService {
  /**
   * A wrapper method for handling Axios requests with error handling.
   *
   * @template T
   * @param {() => Promise<T>} request - The Axios request to wrap.
   * @returns {Promise<T>} The result of the Axios request.
   * @throws {Error} Throws an error if the request fails.
   */
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

  /**
   * Creates a new lesson.
   *
   * @param {NewLesson} newLesson - The data for the new lesson.
   * @param {number} day - The day of the week (0-Sunday, 6-Saturday).
   * @returns {Promise<Lesson>} The created lesson.
   */
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

  /**
   * Fetches a lesson by its ID.
   *
   * @param {string} lessonId - The ID of the lesson to fetch.
   * @returns {Promise<Lesson>} The requested lesson.
   */
  static async getLessonById(lessonId: string): Promise<Lesson> {
    return this.requestWrapper(() =>
      axios.get<Lesson>(`${BASE_URL}/${lessonId}`).then((res) => res.data)
    );
  }

  /**
   * Updates a lesson.
   *
   * @param {string} lessonId - The ID of the lesson to update.
   * @param {Lesson} updatedLesson - The updated lesson data.
   * @returns {Promise<Lesson>} The updated lesson.
   */
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

  /**
   * Deletes a lesson by its ID.
   *
   * @param {string} lessonId - The ID of the lesson to delete.
   * @returns {Promise<void>} Resolves when the lesson is deleted.
   */
  static async deleteLessonById(lessonId: string): Promise<void> {
    return this.requestWrapper(() =>
      axios.delete(`${BASE_URL}/${lessonId}`).then(() => undefined)
    );
  }

  /**
   * Fetches all lessons within a specific date range.
   *
   * @param {Date} start - The start date of the range.
   * @param {Date} end - The end date of the range.
   * @returns {Promise<Lesson[]>} A list of lessons within the date range.
   */
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

  /**
   * Fetches lessons of a specific instructor for a given day.
   *
   * @param {string} instructorId - The ID of the instructor.
   * @param {Date} day - The specific day to fetch lessons.
   * @returns {Promise<Lesson[]>} A list of lessons for the instructor on the given day.
   */
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
