import { Swimming } from "../../utils/swimming-enum.utils.js";
import { Availability } from "./start-and-end-time.dto.js";

/**
 * NewInstructor Class
 *
 * Represents a new instructor being created, including their name, specialties, and weekly availability.
 *
 * @param {string} name - The name of the instructor.
 * @param {Swimming[]} specialties - An array of swimming styles that the instructor is qualified to teach.
 * @param {Availability[]} availabilities - An array representing the instructor's weekly availability.
 *                                          The array should always have a size of 7, corresponding to the days of the week
 *                                          (0-Sunday, 1-Monday, etc.). Entries with `-1` indicate unavailability for that day.
 */
export default class NewInstructor {
  /**
   * Constructor for the NewInstructor class.
   *
   * @param {string} name - The name of the new instructor.
   * @param {Swimming[]} specialties - The swimming styles or specialties the instructor teaches.
   * @param {Availability[]} availabilities - The weekly availability of the instructor, where each entry corresponds to a day of the week.
   *                                          Entries with `-1` indicate the instructor is unavailable on that day.
   */
  constructor(
    public name: string,
    public specialties: Swimming[],
    public availabilities: Availability[] // always will be the size of 7 like the days of the week 0-Sunday, 1-Monday etc. if not -1 then the entry has startTime and endTime
  ) {}
}
