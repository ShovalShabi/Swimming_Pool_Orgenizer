import express from "express";
import { Request, Response } from "express";
import LessonController from "../controller/lesson.controller.js";

const lessonRouter = express.Router();
const lessonController = new LessonController();

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management APIs
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
 *         - dateAndTime
 *         - duration
 *         - students
 *       properties:
 *         typeLesson:
 *           type: string
 *           enum: [PUBLIC, PRIVATE]
 *           example: "PUBLIC"
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *             enum: [CHEST, BACK_STROKE, BUTTERFLY_STROKE, ROWING]
 *           example: ["BACK_STROKE", "CHEST"]
 *         dateAndTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:00:00Z"
 *         duration:
 *           type: number
 *           example: 60
 *         students:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [CHEST, BACK_STROKE, BUTTERFLY_STROKE, ROWING]
 *                 example: ["CHEST"]
 *               lessonType:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE]
 *                 example: "PRIVATE"
 *
 *     Lesson:
 *       type: object
 *       properties:
 *         lessonId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         typeLesson:
 *           type: string
 *           enum: [PUBLIC, PRIVATE]
 *           example: "PRIVATE"
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *             enum: [CHEST, BACK_STROKE, BUTTERFLY_STROKE, ROWING]
 *           example: ["CHEST"]
 *         instructorId:
 *           type: string
 *           example: "350e8400-e29b-41d4-a716-446655440000"
 *         dateAndTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:00:00Z"
 *         duration:
 *           type: number
 *           example: 90
 *         students:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [CHEST, BACK_STROKE, BUTTERFLY_STROKE, ROWING]
 *                 example: ["ROWING"]
 *               lessonType:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE]
 *                 example: "PUBLIC"
 */

/**
 * @swagger
 * /lesson:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewLesson'
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
lessonRouter.post("/", async (req: Request, res: Response) => {
  lessonController.createLesson(req, res);
});

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
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Successfully retrieved the lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
lessonRouter.get("/:lessonId", async (req: Request, res: Response) => {
  lessonController.getLessonById(req, res);
});

/**
 * @swagger
 * /lesson:
 *   get:
 *     summary: Retrieve all lessons
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: start
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-01-15T00:00:00Z"
 *       - in: query
 *         name: end
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2025-02-15T23:59:59Z"
 *     responses:
 *       200:
 *         description: Successfully retrieved all lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 */
lessonRouter.get("/", async (req: Request, res: Response) => {
  lessonController.getAllLessons(req, res);
});

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
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 */
lessonRouter.put("/:lessonId", async (req: Request, res: Response) => {
  lessonController.updateLesson(req, res);
});

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
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 */
lessonRouter.delete("/:lessonId", async (req: Request, res: Response) => {
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
 *         description: All lessons deleted successfully
 */
lessonRouter.delete("/", async (req: Request, res: Response) => {
  lessonController.deleteAllLessons(req, res);
});

export default lessonRouter;
