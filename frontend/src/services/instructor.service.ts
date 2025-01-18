import axios from "axios";
import NewInstructor from "../dto/instructor/new-instructor.dto";
import Instructor from "../dto/instructor/instructor.dto";
import { Swimming } from "../utils/swimming-enum.utils";
import getEnvVariables from "../etc/load-variables";

const { backendServerURL } = getEnvVariables();

const BASE_URL = `${backendServerURL}/instructor`;

export default class InstructorService {
  // Create New Instructor
  static async createInstructor(
    newInstructor: NewInstructor
  ): Promise<Instructor> {
    const response = await axios.post<Instructor>(BASE_URL, newInstructor);
    return response.data;
  }

  // Get Single Instructor by ID
  static async getInstructorById(instructorId: string): Promise<Instructor> {
    const response = await axios.get<Instructor>(
      `${BASE_URL}/single/${instructorId}`
    );
    return response.data;
  }

  // Update Instructor
  static async updateInstructor(
    instructorId: string,
    updatedInstructor: Instructor
  ): Promise<Instructor> {
    const response = await axios.put<Instructor>(
      `${BASE_URL}/${instructorId}`,
      updatedInstructor
    );
    return response.data;
  }

  // Delete Instructor by ID
  static async deleteInstructorById(instructorId: string): Promise<void> {
    await axios.delete(`${BASE_URL}/${instructorId}`);
  }

  // Get Instructors by Specialties
  static async getInstructorsBySpecialties(
    specialties: Swimming[]
  ): Promise<Instructor[]> {
    const response = await axios.get<Instructor[]>(`${BASE_URL}/specialties`, {
      params: { specialties },
    });
    return response.data;
  }

  // Get Instructors by Availability
  static async getInstructorsByAvailability(
    day: number,
    startTime: string,
    endTime: string
  ): Promise<Instructor[]> {
    const response = await axios.get<Instructor[]>(`${BASE_URL}/availability`, {
      params: { day, startTime, endTime },
    });
    return response.data;
  }
}
