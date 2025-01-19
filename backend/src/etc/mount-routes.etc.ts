import { Express } from "express";
import lessonRouter from "../route/lesson.route.js";
import instructorRouter from "../route/instructor.route.js";

/**
 * Mounts application routes to the Express application instance.
 * This function associates specific routers with their respective base paths.
 *
 * @param app - The Express application instance to which the routes are mounted.
 */
export function mountRoutes(app: Express): void {
  /**
   * Mounts the lesson-related routes.
   * All routes in `lessonRouter` will be prefixed with `/lesson`.
   */
  app.use("/lesson", lessonRouter);

  /**
   * Mounts the instructor-related routes.
   * All routes in `instructorRouter` will be prefixed with `/instructor`.
   */
  app.use("/instructor", instructorRouter);
}
