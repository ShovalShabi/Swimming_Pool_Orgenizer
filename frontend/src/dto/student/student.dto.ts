import { Swimming } from "../../utils/swimming-enum.utils.js";

/**
 * Student Class
 *
 * Represents a student enrolled in a swimming lesson, including their name, swimming preferences, and contact information.
 *
 * @param {string} name - The name of the student.
 * @param {Swimming[]} preferences - The swimming styles preferred by the student (e.g., chest, backstroke). Defined in the `Swimming` enum.
 * @param {string} phoneNumber - The student's contact phone number (e.g., "0502452651").
 */
export default class Student {
  /**
   * Constructor for the Student class.
   *
   * @param {string} name - The name of the student.
   * @param {Swimming[]} preferences - The swimming styles preferred by the student.
   * @param {string} phoneNumber - The student's contact phone number.
   */
  constructor(
    public name: string,
    public preferences: Swimming[], // e.g., [Swimming.CHEST, Swimming.BACK_STROKE]
    public phoneNumber: string // e.g., 0502452651
  ) {}
}
