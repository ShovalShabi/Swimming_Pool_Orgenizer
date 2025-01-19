import InstructorRepositoryInterface from "./IInstructor.repository.js";
import InstructorModel, { IInstructor } from "../../model/instructor.model.js";
import Instructor from "../../dto/instructor/instructor.dto.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";

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
    const newInstructor = new InstructorModel(
      Instructor.toModel(instructorData)
    );
    const savedInstructor = await newInstructor.save();
    return Instructor.fromModel(savedInstructor);
  }

  /**
   * Retrieves all instructors from the database.
   * @returns A promise that resolves to an array of all instructors.
   */
  async findAll(): Promise<Instructor[]> {
    const instructorDocs = await InstructorModel.find();
    return instructorDocs.map((doc) => Instructor.fromModel(doc));
  }

  /**
   * Retrieves an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor.
   * @returns A promise that resolves to the instructor, or `null` if not found.
   */
  async findById(instructorId: string): Promise<Instructor | null> {
    const instructorDoc = await InstructorModel.findOne({ _id: instructorId });
    return instructorDoc ? Instructor.fromModel(instructorDoc) : null;
  }

  /**
   * Retrieves instructors by their specialties.
   * @param specialties - An array of swimming specialties to filter by.
   * @returns A promise that resolves to an array of instructors with the specified specialties.
   */
  async findBySpecialties(specialties: Swimming[]): Promise<Instructor[]> {
    const instructorDocs = await InstructorModel.find({
      specialties: { $all: specialties },
    });
    return instructorDocs.map((doc) => Instructor.fromModel(doc));
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

    return instructorDocs.map((doc: IInstructor) => Instructor.fromModel(doc));
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
    const updatedInstructor = await InstructorModel.findOneAndUpdate(
      { _id: instructorId },
      Instructor.toModel(instructorData),
      { new: true }
    );

    return updatedInstructor ? Instructor.fromModel(updatedInstructor) : null;
  }

  /**
   * Deletes an instructor by their ID.
   * @param instructorId - The unique identifier of the instructor to delete.
   * @returns A promise that resolves to `true` if the instructor was successfully deleted.
   */
  async delete(instructorId: string): Promise<boolean> {
    const result = await InstructorModel.deleteOne({ _id: instructorId });
    return result.deletedCount > 0;
  }

  /**
   * Deletes all instructors from the database.
   * @returns A promise that resolves to `true` if all instructors were successfully deleted.
   */
  async deleteAll(): Promise<boolean> {
    const result = await InstructorModel.deleteMany({});
    return result.deletedCount > 0;
  }
}
