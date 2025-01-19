import Instructor from "../../dto/instructor/instructor.dto.js";
import NewInstructor from "../../dto/instructor/new-instructor.dto.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";

/**
 * Interface for the Instructor Service.
 * Defines the contract for operations related to instructor management.
 */
export default interface InstructorServiceInterface {
  /**
   * Creates a new instructor.
   * @param instructorData - The data for the new instructor.
   * @returns A promise that resolves to the newly created instructor.
   */
  createInstructor(instructorData: NewInstructor): Promise<Instructor>;

  /**
   * Retrieves all instructors.
   * @returns A promise that resolves to an array of all instructors.
   */
  getAllInstructors(): Promise<Instructor[]>;

  /**
   * Retrieves instructors by their specialties.
   * @param specialties - An array of swimming specialties to filter instructors by.
   * @returns A promise that resolves to an array of instructors with the specified specialties.
   */
  getInstructorsBySpecialties(specialties: Swimming[]): Promise<Instructor[]>;

  /**
   * Retrieves instructors by their availability.
   * @param day - The day of the week (0 for Sunday, 1 for Monday, etc.).
   * @param startTime - The start time of the availability window.
   * @param endTime - The end time of the availability window.
   * @returns A promise that resolves to an array of instructors available at the specified time.
   */
  getInstructorsByAvailability(
    day: number,
    startTime: Date,
    endTime: Date
  ): Promise<Instructor[]>;

  /**
   * Retrieves an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor.
   * @returns A promise that resolves to the instructor with the specified ID.
   */
  getInstructorById(instructorId: string): Promise<Instructor>;

  /**
   * Updates an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor to update.
   * @param instructorData - The updated instructor data.
   * @returns A promise that resolves to the updated instructor or `null` if the instructor does not exist.
   */
  updateInstructor(
    instructorId: string,
    instructorData: Instructor
  ): Promise<Instructor | null>;

  /**
   * Deletes an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor to delete.
   * @returns A promise that resolves to `true` if the instructor was deleted, otherwise `false`.
   */
  deleteInstructor(instructorId: string): Promise<boolean>;

  /**
   * Deletes all instructors.
   * @returns A promise that resolves to `true` if all instructors were deleted successfully, otherwise `false`.
   */
  deleteAllInstructors(): Promise<boolean>;
}
