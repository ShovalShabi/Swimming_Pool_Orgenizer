import Instructor from "../../dto/instructor/instructor.dto.js";
import NewInstructor from "../../dto/instructor/new-instructor.dto.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";

export default interface InstructorServiceInterface {
  createInstructor(instructorData: NewInstructor): Promise<Instructor>;
  getAllInstructors(): Promise<Instructor[]>;
  getInstructorsBySpecialties(specialties: Swimming[]): Promise<Instructor[]>;
  getInstructorsByAvailability(
    day: number,
    startTimeUTC: number,
    endTimeUTC: number
  ): Promise<Instructor[]>;
  getInstructorById(instructorId: string): Promise<Instructor>;
  updateInstructor(
    instructorId: string,
    instructorData: Instructor
  ): Promise<Instructor | null>;
  deleteInstructor(instructorId: string): Promise<boolean>;
  deleteAllInstructors(): Promise<boolean>;
}
