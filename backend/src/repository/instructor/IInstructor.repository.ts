import { Swimming } from "../../utils/swimming-enum.utils.js";
import Instructor from "../../dto/instructor/instructor.dto.js";

export default interface InstructorRepositoryInterface {
  create(instructorData: Instructor): Promise<Instructor>;
  findAll(): Promise<Instructor[]>;
  findById(instructorId: string): Promise<Instructor | null>;
  findBySpecialties(specialties: Swimming[]): Promise<Instructor[]>;
  findAvailableInstructors(
    day: number,
    startTimeUTC: number,
    endTimeUTC: number
  ): Promise<Instructor[]>;
  update(
    instructorId: string,
    instructorData: Instructor
  ): Promise<Instructor | null>;
  delete(instructorId: string): Promise<boolean>;
  deleteAll(): Promise<boolean>;
}
