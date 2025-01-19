/**
 * Compares two Date objects based on their time (HH:MM:SS), ignoring the date component.
 *
 * @param date1 - The first `Date` object to compare.
 * @param date2 - The second `Date` object to compare.
 * @returns A numeric value indicating the relationship between the two times:
 *          - `-1` if `date1` is earlier than `date2`
 *          - `0` if `date1` and `date2` are equal in time
 *          - `1` if `date1` is later than `date2`
 *
 * @example
 * const date1 = new Date("2025-01-16T08:30:00Z");
 * const date2 = new Date("2025-01-16T09:15:00Z");
 * console.log(compareTime(date1, date2)); // Output: -1
 *
 * const date3 = new Date("2025-01-16T10:00:00Z");
 * const date4 = new Date("2025-01-16T10:00:00Z");
 * console.log(compareTime(date3, date4)); // Output: 0
 *
 * const date5 = new Date("2025-01-16T12:45:00Z");
 * const date6 = new Date("2025-01-16T12:30:00Z");
 * console.log(compareTime(date5, date6)); // Output: 1
 */
const compareTime = (date1: Date, date2: Date): -1 | 0 | 1 => {
  // Extract hours, minutes, and seconds
  const time1 = {
    hours: date1.getHours(),
    minutes: date1.getMinutes(),
    seconds: date1.getSeconds(),
  };

  const time2 = {
    hours: date2.getHours(),
    minutes: date2.getMinutes(),
    seconds: date2.getSeconds(),
  };

  // Compare hours
  if (time1.hours < time2.hours) return -1;
  if (time1.hours > time2.hours) return 1;

  // Compare minutes if hours are equal
  if (time1.minutes < time2.minutes) return -1;
  if (time1.minutes > time2.minutes) return 1;

  // Compare seconds if hours and minutes are equal
  if (time1.seconds < time2.seconds) return -1;
  if (time1.seconds > time2.seconds) return 1;

  // If hours, minutes, and seconds are equal
  return 0;
};

export default compareTime;
