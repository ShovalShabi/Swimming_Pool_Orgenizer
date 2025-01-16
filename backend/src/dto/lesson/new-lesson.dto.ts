import { LessonType } from "../../utils/lesson-enum.utils.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import StartAndEndTime from "../instructor/start-and-end-time.dto.js";
import Student from "../student/student.dto.js";

// NewLesson Class
export default class NewLesson {
  constructor(
    public typeLesson: LessonType,
    public instructorId: string,
    public specialties: Swimming[],
    public startAndEndTime: StartAndEndTime,
    public students: Student[]
  ) {}
}
