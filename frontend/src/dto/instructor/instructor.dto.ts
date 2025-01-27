import { Swimming } from "../../utils/swimming-enum.utils.js";
import { Availability } from "./start-and-end-time.dto.js";

/**
 * Instructor Class
 *
 * Represents an instructor with their details, specialties, and weekly availability.
 *
 * @param {string | null} instructorId - The unique identifier for the instructor. Can be `null` if the instructor is not yet saved in the system.
 * @param {string} name - The name of the instructor.
 * @param {Swimming[]} specialties - An array of swimming specialties that the instructor is qualified to teach.
 * @param {Availability[]} availabilities - An array of availability objects representing the instructor's weekly schedule.
 *                                          The array should have a size of 7, where each index corresponds to a day of the week (0-Sunday, 1-Monday, etc.).
 */
export default class Instructor {
  /**
   * Constructor for the Instructor class.
   *
   * @param {string | null} instructorId - The unique identifier for the instructor. Can be `null` for new instructors.
   * @param {string} name - The name of the instructor.
   * @param {Swimming[]} specialties - The swimming styles or specialties the instructor teaches.
   * @param {Availability[]} availabilities - The weekly availability of the instructor.
   */
  constructor(
    public instructorId: string | null,
    public name: string,
    public specialties: Swimming[],
    public availabilities: Availability[] // Size 7 (0-Sunday, 1-Monday, etc.)
  ) {}
}
