import { Swimming } from "../../utils/swimming-enum.utils.js";
import Instructor from "../../dto/instructor/instructor.dto.js";

/**
 * Interface for the Instructor Repository.
 * Defines the contract for interacting with the instructor data source.
 */
export default interface InstructorRepositoryInterface {
  /**
   * Creates a new instructor.
   * @param instructorData - The data for the new instructor.
   * @returns A promise that resolves to the newly created instructor.
   */
  create(instructorData: Instructor): Promise<Instructor>;

  /**
   * Retrieves all instructors from the data source.
   * @returns A promise that resolves to an array of all instructors.
   */
  findAll(): Promise<Instructor[]>;

  /**
   * Retrieves an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor.
   * @returns A promise that resolves to the instructor, or `null` if not found.
   */
  findById(instructorId: string): Promise<Instructor | null>;

  /**
   * Retrieves instructors by their specialties.
   * @param specialties - An array of swimming specialties to filter by.
   * @returns A promise that resolves to an array of instructors with the specified specialties.
   */
  findBySpecialties(specialties: Swimming[]): Promise<Instructor[]>;

  /**
   * Retrieves instructors who are available on a specific day and time range.
   * @param day - The day of the week (0 for Sunday, 1 for Monday, etc.).
   * @param startTime - The start time of the availability window.
   * @param endTime - The end time of the availability window.
   * @returns A promise that resolves to an array of available instructors.
   */
  findAvailableInstructors(
    day: number,
    startTime: Date,
    endTime: Date
  ): Promise<Instructor[]>;

  /**
   * Updates an instructor's information.
   * @param instructorId - The unique identifier of the instructor to update.
   * @param instructorData - The updated instructor data.
   * @returns A promise that resolves to the updated instructor, or `null` if the instructor does not exist.
   */
  update(
    instructorId: string,
    instructorData: Instructor
  ): Promise<Instructor | null>;

  /**
   * Deletes an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor to delete.
   * @returns A promise that resolves to `true` if the instructor was successfully deleted, or `false` otherwise.
   */
  delete(instructorId: string): Promise<boolean>;

  /**
   * Deletes all instructors from the data source.
   * @returns A promise that resolves to `true` if all instructors were successfully deleted, or `false` otherwise.
   */
  deleteAll(): Promise<boolean>;
}
