import createHttpError from "http-errors";
import Instructor from "../../dto/instructor/instructor.dto.js";
import NewInstructor from "../../dto/instructor/new-instructor.dto.js";
import InstructorRepositoryInterface from "../../repository/instructor/IInstructor.repository.js";
import InstructorRepository from "../../repository/instructor/instructor.repository.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import InstructorServiceInterface from "./IInstructor.service.js";

export default class InstructorService implements InstructorServiceInterface {
  private instructorRepository: InstructorRepositoryInterface;

  constructor() {
    this.instructorRepository = new InstructorRepository();
  }

  async createInstructor(instructorData: NewInstructor) {
    this.validateInstructorData(instructorData);

    const instructor: Instructor = new Instructor(
      null, // instructorId will be assigned by the database
      instructorData.name,
      instructorData.specialties,
      instructorData.availabilities
    );

    return this.instructorRepository.create(instructor);
  }

  async getAllInstructors() {
    return this.instructorRepository.findAll();
  }

  /**
   * Get instructors by specialties
   */
  async getInstructorsBySpecialties(specialties: Swimming[]) {
    //NOTE: specialties can be empty
    // Validate each specialty against the Swimming enum
    for (const specialty of specialties) {
      if (!Object.values(Swimming).includes(specialty)) {
        throw new createHttpError.BadRequest(
          `Invalid specialty: ${specialty}. Must be one of: ${Object.values(
            Swimming
          ).join(", ")}`
        );
      }
    }

    return this.instructorRepository.findBySpecialties(specialties);
  }

  async getInstructorsByAvailability(
    day: number,
    startTimeUTC: number,
    endTimeUTC: number
  ) {
    if (isNaN(day) || day < 0 || day > 6)
      throw new createHttpError.BadRequest(
        "Invalid day. Must be between 0 and 6."
      );

    if (
      isNaN(startTimeUTC) ||
      startTimeUTC < 0 ||
      startTimeUTC > 23 ||
      isNaN(endTimeUTC) ||
      endTimeUTC < 0 ||
      endTimeUTC > 23 ||
      startTimeUTC > endTimeUTC
    ) {
      throw new createHttpError.BadRequest(
        "Invalid time range. Ensure 0 <= startTimeUTC <= endTimeUTC <= 23."
      );
    }

    return this.instructorRepository.findAvailableInstructors(
      day,
      startTimeUTC,
      endTimeUTC
    );
  }

  async getInstructorById(instructorId: string) {
    const instructor = await this.instructorRepository.findById(instructorId);

    if (!instructor) {
      throw new createHttpError.NotFound(
        `Instructor with ID ${instructorId} not found`
      );
    }

    return instructor;
  }

  async updateInstructor(instructorId: string, instructorData: Instructor) {
    const instructor = await this.getInstructorById(instructorId);

    if (!instructor) {
      throw new createHttpError.NotFound(
        `Instructor with ID ${instructorId} not found`
      );
    }

    this.validateInstructorData(instructorData);

    const updatedInstructor: Instructor = {
      instructorId,
      name: instructorData.name,
      specialties: [...instructorData.specialties],
      availabilities: [...instructorData.availabilities],
    };
    return this.instructorRepository.update(instructorId, updatedInstructor);
  }

  async deleteInstructor(instructorId: string) {
    return this.instructorRepository.delete(instructorId);
  }

  async deleteAllInstructors() {
    return this.instructorRepository.deleteAll();
  }

  validateInstructorData = (
    instructorData: Instructor | NewInstructor
  ): void => {
    if (
      instructorData.availabilities.length === 0 ||
      instructorData.availabilities.length > 7
    ) {
      throw new createHttpError.BadRequest(
        "The availabilities for the new instructor must be between 1 and 7 entries." // each entry for each day od the week
      );
    }

    if (instructorData.specialties.length === 0) {
      throw new createHttpError.BadRequest(
        "The instructor must have at least one specialty." // instructor can't be without specialties
      );
    }

    if (instructorData.name.trim().length === 0) {
      throw new createHttpError.BadRequest("Instructor name cannot be empty.");
    }

    let numDays = 0;
    // Validate each availability entry
    for (const availability of instructorData.availabilities) {
      if (typeof availability === "object") {
        numDays++; // That means that thre is availability
        if (availability.startTimeUTC < 0 || availability.startTimeUTC > 23) {
          throw new createHttpError.BadRequest(
            `Invalid start time (${availability.startTimeUTC}). Must be between 0 and 23.`
          );
        }
        if (availability.endTimeUTC < 0 || availability.endTimeUTC > 23) {
          throw new createHttpError.BadRequest(
            `Invalid end time (${availability.endTimeUTC}). Must be between 0 and 23.`
          );
        }
        if (availability.startTimeUTC > availability.endTimeUTC) {
          throw new createHttpError.BadRequest(
            `Start time (${availability.startTimeUTC}) cannot be greater than end time (${availability.endTimeUTC}).`
          );
        }
      }
    }

    if (numDays === 0)
      throw new createHttpError.BadRequest(
        "Instructor must have some availability during the week."
      );

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
  };
}
