import { Express } from "express";
import lessonRouter from "../route/lesson.route.js";
import instructorRouter from "../route/instructor.route.js";

export function mountRoutes(app: Express) {
  // Mount routes under their respective base paths
  app.use("/lesson", lessonRouter);
  app.use("/instructor", instructorRouter);
}
