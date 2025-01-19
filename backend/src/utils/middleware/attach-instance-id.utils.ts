import { v4 as uuidv4 } from "uuid"; // Import uuidv4 for generating instance ID
import { Request, Response, NextFunction } from "express"; // Import types for Express

// Generate unique instance ID
const instanceId: string = uuidv4();

/**
 * Middleware function to attach instance ID to response headers.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
const attachInstanceId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.setHeader("X-Instance-ID", instanceId);
  next();
};

// Export the instance ID and middleware function
export { instanceId, attachInstanceId };
