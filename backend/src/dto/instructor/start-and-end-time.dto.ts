/**
 * Class representing a start and end time.
 * Typically used to indicate availability within a specific time range.
 */
export default class StartAndEndTime {
  /**
   * Creates an instance of StartAndEndTime.
   * @param startTime - The start time of the availability. While the `Date` object is used, only the hours and minutes are relevant.
   * @param endTime - The end time of the availability. While the `Date` object is used, only the hours and minutes are relevant.
   */
  constructor(
    public startTime: Date, // Only hours and minutes are relevant.
    public endTime: Date // Only hours and minutes are relevant.
  ) {}
}

/**
 * Type representing an instructor's availability for a specific day.
 * - `-1`: Indicates no availability for the day.
 * - `StartAndEndTime`: Represents the start and end times for the day.
 */
export type Availability = -1 | StartAndEndTime;
