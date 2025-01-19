import { Request, Response, NextFunction } from "express";

/**
 * Middleware to deserialize `startAndEndTime` in the request body.
 * Converts the `startTime` and `endTime` fields within `startAndEndTime` to `Date` objects
 * for proper handling within the application.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the chain.
 */
const deserializeLessonTimes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  // Check if `startAndEndTime` exists in the body
  if (body && body.startAndEndTime) {
    const { startTime, endTime } = body.startAndEndTime;

    // Convert `startTime` and `endTime` to Date objects
    body.startAndEndTime.startTime = new Date(startTime);
    body.startAndEndTime.endTime = new Date(endTime);
  }

  next(); // Proceed to the next middleware or route handler
};

export default deserializeLessonTimes;
