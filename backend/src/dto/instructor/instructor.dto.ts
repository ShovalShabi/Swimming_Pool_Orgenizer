import { IInstructor } from "../../model/instructor.model.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import StartAndEndTime from "./start-and-end-time.dto.js";

// Instructor Class
export default class Instructor {
  constructor(
    public instructorId: string,
    public name: string,
    public specialties: Swimming[],
    public availabilities: StartAndEndTime[] // always will be the size of 7 like the days of the week 0-Sunday, 1-Monday etc.
  ) {}

  /**
   * Convert Mongoose Model (IInstructor) to Instructor DTO
   * @param instructorDoc - Mongoose document (IInstructor)
   * @returns Instance of Instructor DTO
   */
  static fromModel(instructorDoc: IInstructor): Instructor {
    return new Instructor(
      instructorDoc.instructorId,
      instructorDoc.name,
      instructorDoc.specialties,
      instructorDoc.availabilities.map(
        (avail) => new StartAndEndTime(avail.startTimeUTC, avail.endTimeUTC)
      )
    );
  }

  /**
   * Convert Instructor DTO to Mongoose Model (IInstructor)
   * @returns Plain object matching IInstructor
   */
  static toModel(instructor: Instructor): Partial<IInstructor> {
    return {
      instructorId: instructor.instructorId,
      name: instructor.name,
      specialties: instructor.specialties,
      availabilities: instructor.availabilities.map((avail) => ({
        startTimeUTC: avail.startTimeUTC,
        endTimeUTC: avail.endTimeUTC,
      })),
    };
  }
}
