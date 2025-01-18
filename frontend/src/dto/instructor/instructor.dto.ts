import { Swimming } from "../../utils/swimming-enum.utils.js";
import { Availability } from "./start-and-end-time.dto.js";

// Instructor Class
export default class Instructor {
  constructor(
    public instructorId: string | null,
    public name: string,
    public specialties: Swimming[],
    public availabilities: Availability[] // Size 7 (0-Sunday, 1-Monday, etc.)
  ) {}
}
