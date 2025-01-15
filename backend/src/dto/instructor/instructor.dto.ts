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
}
