// StartAndEndTime Class
export default class StartAndEndTime {
  constructor(
    public startTime: Date, // could be any date bute the relevance is for the hours and minutes
    public endTime: Date // could be any date bute the relevance is for the hours and minutes
  ) {}
}

// Availability Type
export type Availability = -1 | StartAndEndTime;
