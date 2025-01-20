import createHttpError from "http-errors";
import path from "path";
import Instructor from "../../dto/instructor/instructor.dto.js";
import NewInstructor from "../../dto/instructor/new-instructor.dto.js";
import InstructorRepositoryInterface from "../../repository/instructor/IInstructor.repository.js";
import InstructorRepository from "../../repository/instructor/instructor.repository.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import InstructorServiceInterface from "./IInstructor.service.js";
import { createCustomLogger } from "../../etc/logger.etc.js";
import LessonRepositoryInterface from "../../repository/lesson/ILesson.repository.js";
import LessonRepository from "../../repository/lesson/lesson.repository.js";

// Initialize the logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

/**
 * Service for managing instructors.
 * Implements the `InstructorServiceInterface` and provides methods for CRUD operations,
 * validation, and business logic.
 */
export default class InstructorService implements InstructorServiceInterface {
  private instructorRepository: InstructorRepositoryInterface;
  private lessonRepository: LessonRepositoryInterface;

  constructor() {
    this.instructorRepository = new InstructorRepository();
    this.lessonRepository = new LessonRepository();
  }

  /**
   * Creates a new instructor.
   * @param instructorData - Data for the new instructor.
   * @returns A promise that resolves to the newly created instructor.
   * @throws {BadRequest} If the data is invalid.
   */
  async createInstructor(instructorData: NewInstructor): Promise<Instructor> {
    logger.info("Validating instructor data...");
    this.validateInstructorData(instructorData);

    const instructor: Instructor = new Instructor(
      null, // `instructorId` will be assigned by the database
      instructorData.name,
      instructorData.specialties,
      instructorData.availabilities
    );

    try {
      logger.info("Creating a new instructor...");
      const createdInstructor = await this.instructorRepository.create(
        instructor
      );
      logger.info(
        `Instructor created successfully with ID: ${createdInstructor.instructorId}`
      );
      return createdInstructor;
    } catch (error) {
      logger.error("Error occurred while creating instructor:", error);
      throw error;
    }
  }

  /**
   * Retrieves all instructors.
   * @returns A promise that resolves to a list of all instructors.
   */
  async getAllInstructors(): Promise<Instructor[]> {
    try {
      logger.info("Fetching all instructors...");
      const instructors = await this.instructorRepository.findAll();
      logger.info(`Found ${instructors.length} instructors.`);
      return instructors;
    } catch (error) {
      logger.error("Error occurred while fetching all instructors:", error);
      throw error;
    }
  }

  /**
   * Retrieves instructors by their specialties.
   * @param specialties - Array of specialties to filter by.
   * @returns A promise that resolves to a list of instructors with the specified specialties.
   * @throws {BadRequest} If any specialty is invalid.
   */
  async getInstructorsBySpecialties(
    specialties: Swimming[]
  ): Promise<Instructor[]> {
    logger.info("Validating specialties...");
    for (const specialty of specialties) {
      if (!Object.values(Swimming).includes(specialty)) {
        logger.warn(`Invalid specialty detected: ${specialty}`);
        throw new createHttpError.BadRequest(
          `Invalid specialty: ${specialty}. Must be one of: ${Object.values(
            Swimming
          ).join(", ")}`
        );
      }
    }

    try {
      logger.info("Fetching instructors by specialties...");
      const instructors = await this.instructorRepository.findBySpecialties(
        specialties
      );
      logger.info(
        `Found ${instructors.length} instructors matching specialties.`
      );
      return instructors;
    } catch (error) {
      logger.error(
        "Error occurred while fetching instructors by specialties:",
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves instructors by their availability.
   * @param day - The day of the week (0 for Sunday, 1 for Monday, etc.).
   * @param startTime - The start time of the availability window.
   * @param endTime - The end time of the availability window.
   * @returns A promise that resolves to a list of available instructors.
   * @throws {BadRequest} If the day or time range is invalid.
   */
  async getInstructorsByAvailability(
    day: number,
    startTime: Date,
    endTime: Date
  ): Promise<Instructor[]> {
    logger.info("Validating availability parameters...");
    if (isNaN(day) || day < 0 || day > 6) {
      logger.warn(`Invalid day: ${day}`);
      throw new createHttpError.BadRequest(
        "Invalid day. Must be between 0 (Sunday) and 6 (Saturday)."
      );
    }

    // Validate the time range
    if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
      logger.warn("Invalid time range provided.");
      throw new createHttpError.BadRequest(
        "Invalid startTime or endTime. They must be valid Date objects."
      );
    }

    if (startTime >= endTime) {
      logger.warn("startTime is greater than or equal to endTime.");
      throw new createHttpError.BadRequest(
        "Invalid time range. startTime must be earlier than endTime."
      );
    }

    try {
      logger.info("Fetching instructors by availability...");
      const instructors =
        await this.instructorRepository.findAvailableInstructors(
          day,
          startTime,
          endTime
        );
      logger.info(`Found ${instructors.length} available instructors.`);
      return instructors;
    } catch (error) {
      logger.error(
        "Error occurred while fetching instructors by availability:",
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor.
   * @returns A promise that resolves to the instructor.
   * @throws {NotFound} If no instructor is found.
   */
  async getInstructorById(instructorId: string): Promise<Instructor> {
    logger.info(`Fetching instructor by ID: ${instructorId}...`);
    const instructor = await this.instructorRepository.findById(instructorId);

    if (!instructor) {
      logger.warn(`Instructor with ID ${instructorId} not found.`);
      throw new createHttpError.NotFound(
        `Instructor with ID ${instructorId} not found`
      );
    }

    logger.info(`Instructor with ID ${instructorId} retrieved successfully.`);
    return instructor;
  }

  /**
   * Updates an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor to update.
   * @param instructorData - The updated instructor data.
   * @returns A promise that resolves to the updated instructor or `null` if not found.
   * @throws {NotFound} If no instructor is found with the given ID.
   * @throws {BadRequest} If the data is invalid.
   */
  async updateInstructor(
    instructorId: string,
    instructorData: Instructor
  ): Promise<Instructor | null> {
    logger.info(
      `Validating and updating instructor with ID: ${instructorId}...`
    );
    const instructor = await this.getInstructorById(instructorId);

    this.validateInstructorData(instructorData);

    const updatedInstructor: Instructor = {
      instructorId,
      name: instructorData.name,
      specialties: [...instructorData.specialties],
      availabilities: [...instructorData.availabilities],
    };

    try {
      const result = await this.instructorRepository.update(
        instructorId,
        updatedInstructor
      );
      logger.info(`Instructor with ID ${instructorId} updated successfully.`);
      return result;
    } catch (error) {
      logger.error("Error occurred while updating instructor:", error);
      throw error;
    }
  }

  /**
   * Deletes an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor to delete.
   * @returns A promise that resolves to a boolean indicating success.
   */
  async deleteInstructor(instructorId: string): Promise<boolean> {
    logger.info(`Deleting instructor with ID: ${instructorId}...`);
    try {
      const result = await this.instructorRepository.delete(instructorId);
      logger.info(`Instructor with ID ${instructorId} deleted successfully.`);

      const resLessons =
        await this.lessonRepository.deleteLessonsByInstructorId(instructorId);

      if (resLessons)
        logger.info(`All lessons of ${instructorId} deleted successfully.`);

      return result;
    } catch (error) {
      logger.error("Error occurred while deleting instructor:", error);
      throw error;
    }
  }

  /**
   * Deletes all instructors.
   * @returns A promise that resolves to a boolean indicating success.
   */
  async deleteAllInstructors(): Promise<boolean> {
    logger.info("Deleting all instructors...");
    try {
      const result = await this.instructorRepository.deleteAll();
      logger.info("All instructors deleted successfully.");
      const resLessons = await this.lessonRepository.deleteAllLessons();

      if (resLessons) logger.info("All lessons deleted successfully.");

      return result;
    } catch (error) {
      logger.error("Error occurred while deleting all instructors:", error);
      throw error;
    }
  }

  /**
   * Validates instructor data.
   * Ensures that availabilities, specialties, and the instructor's name are valid.
   * @param instructorData - The instructor data to validate.
   * @throws {BadRequest} If any data is invalid.
   */
  private validateInstructorData(
    instructorData: Instructor | NewInstructor
  ): void {
    logger.info("Validating instructor data...");
    if (
      instructorData.availabilities.length === 0 ||
      instructorData.availabilities.length > 7
    ) {
      logger.warn("Invalid availabilities length.");
      throw new createHttpError.BadRequest(
        "The availabilities for the new instructor must be between 1 and 7 entries."
      );
    }

    if (instructorData.specialties.length === 0) {
      logger.warn("No specialties provided for the instructor.");
      throw new createHttpError.BadRequest(
        "The instructor must have at least one specialty."
      );
    }

    if (instructorData.name.trim().length === 0) {
      logger.warn("Instructor name is empty.");
      throw new createHttpError.BadRequest("Instructor name cannot be empty.");
    }

    let numDays = 0;
    // Validate each availability entry
    for (const availability of instructorData.availabilities) {
      if (typeof availability === "object") {
        if (
          isNaN(availability.startTime.getTime()) ||
          isNaN(availability.endTime.getTime())
        ) {
          throw new createHttpError.BadRequest(
            "Invalid date format for startTime or endTime"
          );
        }
        numDays++; // That means that thre is availability
        if (
          availability.startTime.getHours() < 0 ||
          availability.startTime.getHours() > 23
        ) {
          throw new createHttpError.BadRequest(
            `Invalid start time (${availability.startTime}). Must be between 0 and 23.`
          );
        }
        if (
          availability.endTime.getHours() < 0 ||
          availability.endTime.getHours() > 23
        ) {
          throw new createHttpError.BadRequest(
            `Invalid end time (${availability.endTime.getHours()}). Must be between 0 and 23.`
          );
        }
        if (availability.startTime >= availability.endTime) {
          throw new createHttpError.BadRequest(
            `Start time (${availability.startTime.getHours()}:${availability.startTime.getMinutes()}) cannot be greater or equal to end time (${availability.endTime.getHours()}:${availability.endTime.getMinutes()}).`
          );
        }
      }
    }

    if (numDays === 0) {
      throw new createHttpError.BadRequest(
        "Instructor must have some availability during the week."
      );
    }

    // Validate each specialty against the Swimming enum
    for (const specialty of instructorData.specialties) {
      if (!Object.values(Swimming).includes(specialty)) {
        throw new createHttpError.BadRequest(
          `Invalid specialty: ${specialty}. Must be one of: ${Object.values(
            Swimming
          ).join(", ")}`
        );
      }
    }
  }
}
