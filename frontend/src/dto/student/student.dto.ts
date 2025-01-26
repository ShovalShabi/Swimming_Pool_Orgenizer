import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";

export default class Student {
  constructor(
    public name: string,
    public preferences: Swimming[], // e.g., [Swimming.FREESTYLE, Swimming.BACKSTROKE]
    public phoneNumber: string // e.g., 0502452651
  ) {}
}
