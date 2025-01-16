import { Request, Response, NextFunction } from "express";

const deserializeLessonTimes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  if (body && body.startAndEndTime) {
    const { startTime, endTime } = body.startAndEndTime;

    // Convert `startTime` and `endTime` to Date objects
    body.startAndEndTime.startTime = new Date(startTime);
    body.startAndEndTime.endTime = new Date(endTime);
  }

  next();
};

export default deserializeLessonTimes;
