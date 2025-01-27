/**
 * StartAndEndTime Class
 *
 * Represents a time interval with a start time and an end time.
 *
 * @param {Date} startTime - The starting time of the interval. The relevant parts are the hours and minutes.
 * @param {Date} endTime - The ending time of the interval. The relevant parts are the hours and minutes.
 */
export default class StartAndEndTime {
  /**
   * Constructor for the StartAndEndTime class.
   *
   * @param {Date} startTime - The start time of the interval.
   * @param {Date} endTime - The end time of the interval.
   */
  constructor(
    public startTime: Date, // Only hours and minutes are relevant.
    public endTime: Date // Only hours and minutes are relevant.
  ) {}
}

/**
 * Availability Type
 *
 * Represents the availability of an instructor for a specific day.
 *
 * @type {-1 | StartAndEndTime}
 * - `-1` indicates that the instructor is unavailable on that day.
 * - `StartAndEndTime` represents the time interval during which the instructor is available.
 */
export type Availability = -1 | StartAndEndTime;
