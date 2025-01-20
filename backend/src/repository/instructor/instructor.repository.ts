import path from "path";
import InstructorRepositoryInterface from "./IInstructor.repository.js";
import InstructorModel, { IInstructor } from "../../model/instructor.model.js";
import Instructor from "../../dto/instructor/instructor.dto.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import { createCustomLogger } from "../../etc/logger.etc.js";

// Initialize logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

/**
 * Repository for managing instructor data.
 * Implements the `InstructorRepositoryInterface` to interact with the database.
 */
export default class InstructorRepository
  implements InstructorRepositoryInterface
{
  /**
   * Creates a new instructor in the database.
   * @param instructorData - The data for the new instructor.
   * @returns A promise that resolves to the newly created instructor.
   */
  async create(instructorData: Instructor): Promise<Instructor> {
    logger.info("Creating a new instructor...");
    try {
      const newInstructor = new InstructorModel(
        Instructor.toModel(instructorData)
      );
      const savedInstructor = await newInstructor.save();
      logger.info(
        `Instructor created successfully with ID: ${savedInstructor._id}`
      );
      return Instructor.fromModel(savedInstructor);
    } catch (error) {
      logger.error("Error creating instructor:", error);
      throw error;
    }
  }

  /**
   * Retrieves all instructors from the database.
   * @returns A promise that resolves to an array of all instructors.
   */
  async findAll(): Promise<Instructor[]> {
    logger.info("Fetching all instructors...");
    try {
      const instructorDocs = await InstructorModel.find();
      logger.info(`Retrieved ${instructorDocs.length} instructors.`);
      return instructorDocs.map((doc) => Instructor.fromModel(doc));
    } catch (error) {
      logger.error("Error fetching all instructors:", error);
      throw error;
    }
  }

  /**
   * Retrieves an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor.
   * @returns A promise that resolves to the instructor, or `null` if not found.
   */
  async findById(instructorId: string): Promise<Instructor | null> {
    logger.info(`Fetching instructor with ID: ${instructorId}...`);
    try {
      const instructorDoc = await InstructorModel.findOne({
        _id: instructorId,
      });
      if (instructorDoc) {
        logger.info(
          `Instructor with ID ${instructorId} retrieved successfully.`
        );
        return Instructor.fromModel(instructorDoc);
      }
      logger.warn(`Instructor with ID ${instructorId} not found.`);
      return null;
    } catch (error) {
      logger.error(`Error fetching instructor with ID ${instructorId}:`, error);
      throw error;
    }
  }

  /**
   * Retrieves instructors by their specialties.
   * @param specialties - An array of swimming specialties to filter by.
   * @returns A promise that resolves to an array of instructors with the specified specialties.
   */
  async findBySpecialties(specialties: Swimming[]): Promise<Instructor[]> {
    logger.info(
      `Fetching instructors by specialties: ${specialties.join(", ")}...`
    );
    try {
      const instructorDocs = await InstructorModel.find({
        specialties: { $all: specialties },
      });
      logger.info(
        `Retrieved ${instructorDocs.length} instructors matching specialties.`
      );
      return instructorDocs.map((doc) => Instructor.fromModel(doc));
    } catch (error) {
      logger.error("Error fetching instructors by specialties:", error);
      throw error;
    }
  }

  /**
   * Retrieves instructors who are available on a specific day and time range.
   * @param day - The day of the week (0 for Sunday, 1 for Monday, etc.).
   * @param startTime - The start time of the availability window.
   * @param endTime - The end time of the availability window.
   * @returns A promise that resolves to an array of available instructors.
   */
  async findAvailableInstructors(
    day: number,
    startTime: Date,
    endTime: Date
  ): Promise<Instructor[]> {
    logger.info(
      `Fetching instructors available on day ${day} from ${startTime} to ${endTime}...`
    );
    try {
      const requestedStartTime = {
        hours: startTime.getHours(),
        minutes: startTime.getMinutes(),
        seconds: startTime.getSeconds(),
      };

      const requestedEndTime = {
        hours: endTime.getHours(),
        minutes: endTime.getMinutes(),
        seconds: endTime.getSeconds(),
      };

      const instructorDocs = (
        await InstructorModel.find({
          [`availabilities.${day}`]: {
            $not: { $eq: -1 }, // Ensure the day is not -1 (instructor is available)
          },
        })
      ).filter((doc: IInstructor) => {
        const availability = (doc as any).availabilities[day]; // Use `as any` if `availabilities` isn't explicitly typed in your model

        if (!availability || availability === -1) {
          return false; // Skip unavailable instructors
        }

        const startTimeComponents = {
          hours: new Date(availability.startTime).getHours(),
          minutes: new Date(availability.startTime).getMinutes(),
          seconds: new Date(availability.startTime).getSeconds(),
        };

        const endTimeComponents = {
          hours: new Date(availability.endTime).getHours(),
          minutes: new Date(availability.endTime).getMinutes(),
          seconds: new Date(availability.endTime).getSeconds(),
        };
        if (requestedEndTime.hours === 0) {
          // corner case for not overflow to the next day
          requestedEndTime.hours = 24;
        }

        const startCondition =
          startTimeComponents.hours < requestedStartTime.hours ||
          (startTimeComponents.hours === requestedStartTime.hours &&
            startTimeComponents.minutes < requestedStartTime.minutes) ||
          (startTimeComponents.hours === requestedStartTime.hours &&
            startTimeComponents.minutes === requestedStartTime.minutes &&
            startTimeComponents.seconds <= requestedStartTime.seconds);

        const endCondition =
          endTimeComponents.hours > requestedEndTime.hours ||
          (endTimeComponents.hours === requestedEndTime.hours &&
            endTimeComponents.minutes > requestedEndTime.minutes) ||
          (endTimeComponents.hours === requestedEndTime.hours &&
            endTimeComponents.minutes === requestedEndTime.minutes &&
            endTimeComponents.seconds >= requestedEndTime.seconds);

        return startCondition && endCondition;
      });

      logger.info(
        `Retrieved ${instructorDocs.length} instructors available on day ${day}.`
      );
      return instructorDocs.map((doc: IInstructor) =>
        Instructor.fromModel(doc)
      );
    } catch (error) {
      logger.error("Error fetching available instructors:", error);
      throw error;
    }
  }

  /**
   * Updates an instructor's information in the database.
   * @param instructorId - The unique identifier of the instructor to update.
   * @param instructorData - The updated instructor data.
   * @returns A promise that resolves to the updated instructor, or `null` if not found.
   */
  async update(
    instructorId: string,
    instructorData: Instructor
  ): Promise<Instructor | null> {
    logger.info(`Updating instructor with ID: ${instructorId}...`);
    try {
      const updatedInstructor = await InstructorModel.findOneAndUpdate(
        { _id: instructorId },
        Instructor.toModel(instructorData),
        { new: true }
      );
      if (updatedInstructor) {
        logger.info(`Instructor with ID ${instructorId} updated successfully.`);
        return Instructor.fromModel(updatedInstructor);
      }
      logger.warn(`Instructor with ID ${instructorId} not found for update.`);
      return null;
    } catch (error) {
      logger.error(`Error updating instructor with ID ${instructorId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor to delete.
   * @returns A promise that resolves to `true` if the instructor was successfully deleted.
   */
  async delete(instructorId: string): Promise<boolean> {
    logger.info(`Deleting instructor with ID: ${instructorId}...`);
    try {
      const result = await InstructorModel.deleteOne({ _id: instructorId });
      logger.info(`Instructor with ID ${instructorId} deleted successfully.`);
      return result.deletedCount > 0;
    } catch (error) {
      logger.error(`Error deleting instructor with ID ${instructorId}:`, error);
      throw error;
    }
  }

  /**
   * Deletes all instructors from the database.
   * @returns A promise that resolves to `true` if all instructors were successfully deleted.
   */
  async deleteAll(): Promise<boolean> {
    logger.info("Deleting all instructors...");
    try {
      const result = await InstructorModel.deleteMany({});
      logger.info("All instructors deleted successfully.");
      return result.deletedCount > 0;
    } catch (error) {
      logger.error("Error deleting all instructors:", error);
      throw error;
    }
  }
}
