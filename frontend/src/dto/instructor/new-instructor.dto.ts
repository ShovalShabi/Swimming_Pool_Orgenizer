import { Swimming } from "../../utils/swimming-enum.utils.js";
import { Availability } from "./start-and-end-time.dto.js";

// NewInstructor Class
export default class NewInstructor {
  constructor(
    public name: string,
    public specialties: Swimming[],
    public availabilities: Availability[] // always will be the size of 7 like the days of the week 0-Sunday, 1-Monday etc. if not -1 then the entry has startTime and endTime
  ) {}
}
