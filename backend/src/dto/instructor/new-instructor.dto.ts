import { Swimming } from "../../utils/swimming-enum.utils.js";
import { Availability } from "./start-and-end-time.dto.js";

/**
 * Class representing a new instructor.
 * Used for creating new instructor records without an existing unique identifier.
 */
export default class NewInstructor {
  /**
   * Creates an instance of NewInstructor.
   * @param name - The name of the instructor.
   * @param specialties - An array of specialties from the Swimming enum that the instructor is proficient in.
   * @param availabilities - Weekly availability schedule, always of size 7 (0-Sunday, 1-Monday, etc.).
   *                         If the entry is not `-1`, it includes `startTime` and `endTime`.
   */
  constructor(
    public name: string,
    public specialties: Swimming[],
    public availabilities: Availability[] // Always of size 7, representing weekly availability.
  ) {}
}
