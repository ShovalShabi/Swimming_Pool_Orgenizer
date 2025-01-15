import InstructorRepositoryInterface from "../repository/instructor/IInstructor.repository.js";
import InstructorRepository from "../repository/instructor/instructor.repository.js";
import { Swimming } from "../utils/swimming-enum.utils.js";

export default class InstructorService {
  private instructorRepository: InstructorRepositoryInterface;

  constructor() {
    this.instructorRepository = new InstructorRepository();
  }

  async createInstructor(instructorData: any) {
    return this.instructorRepository.create(instructorData);
  }

  async getAllInstructors() {
    return this.instructorRepository.findAll();
  }

  /**
   * Get instructors by specialties
   */
  async getInstructorsBySpecialties(specialties: Swimming[]) {
    return this.instructorRepository.findBySpecialties(specialties);
  }

  async getInstructorById(instructorId: string) {
    return this.instructorRepository.findById(instructorId);
  }

  async updateInstructor(instructorId: string, instructorData: any) {
    return this.instructorRepository.update(instructorId, instructorData);
  }

  async deleteInstructor(instructorId: string) {
    return this.instructorRepository.delete(instructorId);
  }

  async deleteAllInstructors() {
    return this.instructorRepository.deleteAll();
  }
}
