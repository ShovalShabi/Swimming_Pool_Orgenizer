import axios from "axios";
import NewInstructor from "../dto/instructor/new-instructor.dto";
import Instructor from "../dto/instructor/instructor.dto";
import { Swimming } from "../utils/swimming-enum.utils";
import getEnvVariables from "../etc/load-variables";

const { backendServerURL } = getEnvVariables();

const BASE_URL = `${backendServerURL}/instructor`;

export default class InstructorService {
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

  // Create New Instructor
  static async createInstructor(
    newInstructor: NewInstructor
  ): Promise<Instructor> {
    return this.requestWrapper(() =>
      axios.post<Instructor>(BASE_URL, newInstructor).then((res) => res.data)
    );
  }

  // Get Single Instructor by ID
  static async getInstructorById(instructorId: string): Promise<Instructor> {
    return this.requestWrapper(() =>
      axios
        .get<Instructor>(`${BASE_URL}/single/${instructorId}`)
        .then((res) => res.data)
    );
  }

  // Update Instructor
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

  static async deleteInstructorById(instructorId: string): Promise<void> {
    return this.requestWrapper(() =>
      axios.delete(`${BASE_URL}/${instructorId}`).then(() => undefined)
    );
  }

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

  static async getAllInstructors(): Promise<Instructor[]> {
    return this.requestWrapper(() =>
      axios.get<Instructor[]>(BASE_URL).then((res) => res.data)
    );
  }
}
