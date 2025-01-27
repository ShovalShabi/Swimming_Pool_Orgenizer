/**
 * InstructorService
 *
 * Provides static methods for managing instructors, including creating, updating, deleting, and fetching instructor data.
 * All methods interact with the backend server through Axios.
 *
 * @module InstructorService
 */

import axios from "axios";
import NewInstructor from "../dto/instructor/new-instructor.dto";
import Instructor from "../dto/instructor/instructor.dto";
import { Swimming } from "../utils/swimming-enum.utils";
import getEnvVariables from "../etc/load-variables";

const { backendServerURL } = getEnvVariables();

const BASE_URL = `${backendServerURL}/instructor`;

export default class InstructorService {
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
   * Creates a new instructor.
   *
   * @param {NewInstructor} newInstructor - The data for the new instructor.
   * @returns {Promise<Instructor>} The created instructor.
   */
  static async createInstructor(
    newInstructor: NewInstructor
  ): Promise<Instructor> {
    return this.requestWrapper(() =>
      axios.post<Instructor>(BASE_URL, newInstructor).then((res) => res.data)
    );
  }

  /**
   * Fetches a single instructor by their ID.
   *
   * @param {string} instructorId - The ID of the instructor to fetch.
   * @returns {Promise<Instructor>} The requested instructor.
   */
  static async getInstructorById(instructorId: string): Promise<Instructor> {
    return this.requestWrapper(() =>
      axios
        .get<Instructor>(`${BASE_URL}/single/${instructorId}`)
        .then((res) => res.data)
    );
  }

  /**
   * Updates an instructor's information.
   *
   * @param {string} instructorId - The ID of the instructor to update.
   * @param {Instructor} updatedInstructor - The updated instructor data.
   * @returns {Promise<Instructor>} The updated instructor.
   */
  static async updateInstructor(
    instructorId: string,
    updatedInstructor: Instructor
  ): Promise<Instructor> {
    return this.requestWrapper(() =>
      axios
        .put<Instructor>(`${BASE_URL}/${instructorId}`, updatedInstructor)
        .then((res) => res.data)
    );
  }

  /**
   * Deletes an instructor by their ID.
   *
   * @param {string} instructorId - The ID of the instructor to delete.
   * @returns {Promise<void>} Resolves when the instructor is deleted.
   */
  static async deleteInstructorById(instructorId: string): Promise<void> {
    return this.requestWrapper(() =>
      axios.delete(`${BASE_URL}/${instructorId}`).then(() => undefined)
    );
  }

  /**
   * Fetches instructors filtered by their specialties.
   *
   * @param {Swimming[]} specialties - An array of specialties to filter by.
   * @returns {Promise<Instructor[]>} A list of instructors matching the specialties.
   */
  static async getInstructorsBySpecialties(
    specialties: Swimming[]
  ): Promise<Instructor[]> {
    return this.requestWrapper(() =>
      axios
        .get<Instructor[]>(`${BASE_URL}/specialties`, {
          params: { specialties },
        })
        .then((res) => res.data)
    );
  }

  /**
   * Fetches instructors available on a specific day and time range.
   *
   * @param {number} day - The day of the week (0-Sunday, 6-Saturday).
   * @param {Date} startTime - The start time for availability.
   * @param {Date} endTime - The end time for availability.
   * @returns {Promise<Instructor[]>} A list of available instructors.
   */
  static async getInstructorsByAvailability(
    day: number,
    startTime: Date,
    endTime: Date
  ): Promise<Instructor[]> {
    return this.requestWrapper(() =>
      axios
        .get<Instructor[]>(`${BASE_URL}/availability`, {
          params: { day, startTime, endTime },
        })
        .then((res) => res.data)
    );
  }

  /**
   * Fetches all instructors.
   *
   * @returns {Promise<Instructor[]>} A list of all instructors.
   */
  static async getAllInstructors(): Promise<Instructor[]> {
    return this.requestWrapper(() =>
      axios.get<Instructor[]>(BASE_URL).then((res) => res.data)
    );
  }
}
