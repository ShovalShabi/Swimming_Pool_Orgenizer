import mongoose from "mongoose";
import { IInstructor } from "../../model/instructor.model.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import StartAndEndTime, { Availability } from "./start-and-end-time.dto.js";

/**
 * Class representing an Instructor.
 */
export default class Instructor {
  /**
   * Creates an instance of Instructor.
   * @param instructorId - The unique identifier for the instructor (can be null for new instructors).
   * @param name - The name of the instructor.
   * @param specialties - An array of the instructor's specialties from the Swimming enum.
   * @param availabilities - Weekly availability schedule (size 7, 0-Sunday, 1-Monday, etc.).
   */
  constructor(
    public instructorId: string | null,
    public name: string,
    public specialties: Swimming[],
    public availabilities: Availability[] // Size 7 (0-Sunday, 1-Monday, etc.)
  ) {}

  /**
   * Converts a Mongoose Model (IInstructor) to an Instructor DTO.
   * @param instructorDoc - The Mongoose document conforming to the IInstructor interface.
   * @returns An instance of the Instructor class representing the DTO.
   */
  static fromModel(instructorDoc: IInstructor): Instructor {
    return new Instructor(
      instructorDoc._id?.toString() || null, // Convert `_id` to string or keep it null.
      instructorDoc.name,
      instructorDoc.specialties,
      instructorDoc.availabilities.map((avail) =>
        typeof avail === "number"
          ? -1
          : new StartAndEndTime(avail.startTime, avail.endTime)
      )
    );
  }

  /**
   * Converts an Instructor DTO to a plain object compatible with the Mongoose Model.
   * @param instructor - An instance of the Instructor DTO.
   * @returns A plain object conforming to the IInstructor interface, suitable for database operations.
   */
  static toModel(instructor: Instructor): Partial<IInstructor> {
    const modelData: Partial<IInstructor> = {
      name: instructor.name,
      specialties: instructor.specialties,
      availabilities: instructor.availabilities.map((avail) =>
        typeof avail === "number"
          ? -1
          : new StartAndEndTime(avail.startTime, avail.endTime)
      ),
    };

    // If instructorId exists, set it as `_id` to ensure updates don't create new documents.
    if (instructor.instructorId) {
      modelData._id = new mongoose.Types.ObjectId(instructor.instructorId);
    }

    return modelData;
  }
}
