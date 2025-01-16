import mongoose from "mongoose";
import { IInstructor } from "../../model/instructor.model.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import StartAndEndTime, { Availability } from "./start-and-end-time.dto.js";

// Instructor Class
export default class Instructor {
  constructor(
    public instructorId: string | null,
    public name: string,
    public specialties: Swimming[],
    public availabilities: Availability[] // Size 7 (0-Sunday, 1-Monday, etc.)
  ) {}

  /**
   * Convert Mongoose Model (IInstructor) to Instructor DTO
   * @param instructorDoc - Mongoose document (IInstructor)
   * @returns Instance of Instructor DTO
   */
  static fromModel(instructorDoc: IInstructor): Instructor {
    return new Instructor(
      instructorDoc._id?.toString() || null, // Convert `_id` to string or keep it null,
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
   * Convert Instructor DTO to Plain Object for Mongoose Model
   * @returns Plain object for Mongoose Model (IInstructor)
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

    // If instructorId exists, set it as `_id` to ensure updates don't create new documents
    if (instructor.instructorId) {
      modelData._id = new mongoose.Types.ObjectId(instructor.instructorId);
    }

    return modelData;
  }
}
