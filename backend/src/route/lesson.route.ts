import express, { Request, Response } from "express";
import LessonController from "../controller/lesson.controller.js";
import deserializeLessonTimes from "../utils/middleware/deserialize-single-date-object.utils.js";

const lessonRouter = express.Router();
const lessonController = new LessonController();

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: APIs for managing lessons.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewLesson:
 *       type: object
 *       required:
 *         - typeLesson
 *         - specialties
 *         - instructorId
 *         - startAndEndTime
 *         - students
 *       properties:
 *         typeLesson:
 *           type: string
 *           enum: [PUBLIC, PRIVATE, MIXED]
 *           description: The type of the lesson.
 *           example: "PRIVATE"
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *           description: The specialties covered in the lesson.
 *           example: ["CHEST"]
 *         instructorId:
 *           type: string
 *           description: The ID of the instructor teaching the lesson.
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         startAndEndTime:
 *           type: object
 *           properties:
 *             startTime:
 *               type: string
 *               format: date-time
 *               description: Start time of the lesson.
 *               example: "2025-01-15T10:00:00Z"
 *             endTime:
 *               type: string
 *               format: date-time
 *               description: End time of the lesson.
 *               example: "2025-01-15T11:00:00Z"
 *         students:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the student.
 *                 example: "John Doe"
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: The preferences of the student.
 *                 example: ["BACK_STROKE"]
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the student.
 *                 example: "0502452651"
 *     Lesson:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/NewLesson'
 *         - type: object
 *           properties:
 *             lessonId:
 *               type: string
 *               description: Unique identifier for the lesson.
 *               example: "550e8400-e29b-41d4-a716-446655440000"
 */

/**
 * @swagger
 * /lesson:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: day
 *         required: true
 *         schema:
 *           type: integer
 *           description: Day of the week (0 = Sunday, 6 = Saturday).
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewLesson'
 *     responses:
 *       201:
 *         description: Lesson created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
lessonRouter.post(
  "/",
  deserializeLessonTimes,
  (req: Request, res: Response) => {
    lessonController.createLesson(req, res);
  }
);

/**
 * @swagger
 * /lesson/{lessonId}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the lesson.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Successfully retrieved the lesson.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
lessonRouter.get("/:lessonId", (req: Request, res: Response) => {
  lessonController.getLessonById(req, res);
});

/**
 * @swagger
 * /lesson:
 *   get:
 *     summary: Retrieve all lessons within a date range
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Start date of the range.
 *           example: "2025-01-01T00:00:00Z"
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           description: End date of the range.
 *           example: "2025-01-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Successfully retrieved lessons within the range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
lessonRouter.get("/", (req: Request, res: Response) => {
  lessonController.getAllLessonsWithinRange(req, res);
});

/**
 * @swagger
 * /lesson/instructor/{instructorId}/day:
 *   get:
 *     summary: Get lessons of an instructor on a specific day
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the instructor.
 *           example: "12345"
 *       - in: query
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           description: The day to filter lessons by.
 *           example: "2025-01-15"
 *     responses:
 *       200:
 *         description: Successfully retrieved lessons for the instructor on the specified day.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
lessonRouter.get(
  "/instructor/:instructorId/day",
  (req: Request, res: Response) => {
    lessonController.getLessonsOfInstructorByDay(req, res);
  }
);

/**
 * @swagger
 * /lesson/{lessonId}:
 *   put:
 *     summary: Update a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the lesson.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: Lesson updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
lessonRouter.put(
  "/:lessonId",
  deserializeLessonTimes,
  (req: Request, res: Response) => {
    lessonController.updateLesson(req, res);
  }
);

/**
 * @swagger
 * /lesson/{lessonId}:
 *   delete:
 *     summary: Delete a lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the lesson.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Lesson deleted successfully.
 */
lessonRouter.delete("/:lessonId", (req: Request, res: Response) => {
  lessonController.deleteLesson(req, res);
});

/**
 * @swagger
 * /lesson:
 *   delete:
 *     summary: Delete all lessons
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: All lessons deleted successfully.
 */
lessonRouter.delete("/", (req: Request, res: Response) => {
  lessonController.deleteAllLessons(req, res);
});

export default lessonRouter;
