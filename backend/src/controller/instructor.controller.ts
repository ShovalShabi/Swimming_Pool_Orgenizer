import { Request, Response } from "express";
import path from "path";
import InstructorService from "../service/instructor/instructor.service.js";
import { Swimming } from "../utils/swimming-enum.utils.js";
import Instructor from "../dto/instructor/instructor.dto.js";
import NewInstructor from "../dto/instructor/new-instructor.dto.js";
import InstructorServiceInterface from "../service/instructor/IInstructor.service.js";
import { createCustomLogger } from "../etc/logger.etc.js";

// Initialize logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

/**
 * Controller for handling instructor-related operations.
 */
export default class InstructorController {
  private instructorService: InstructorServiceInterface;

  constructor() {
    this.instructorService = new InstructorService();
  }

  /**
   * Creates a new instructor.
   * @param req - The Express request object. Expects a `NewInstructor` in the body.
   * @param res - The Express response object.
   * @returns The newly created instructor.
   */
  async createInstructor(req: Request, res: Response): Promise<Response> {
    logger.info("Received request to create a new instructor.");
    try {
      const instructorData: NewInstructor = req.body;
      logger.info("Validating and creating a new instructor...");
      const newInstructor: Instructor =
        await this.instructorService.createInstructor(instructorData);
      logger.info(
        `Instructor created successfully with ID: ${newInstructor.instructorId}`
      );
      return res.status(201).json(newInstructor);
    } catch (error: any) {
      logger.error("Error creating instructor:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieves all instructors.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A list of all instructors.
   */
  async getAllInstructors(req: Request, res: Response): Promise<Response> {
    logger.info("Received request to fetch all instructors.");
    try {
      const instructors: Instructor[] =
        await this.instructorService.getAllInstructors();
      logger.info(`Retrieved ${instructors.length} instructors.`);
      return res.status(200).json(instructors);
    } catch (error: any) {
      logger.error("Error fetching all instructors:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieves instructors by their specialties.
   * @param req - The Express request object. Expects `specialties` as query parameters.
   * @param res - The Express response object.
   * @returns A list of instructors with the specified specialties.
   */
  async getInstructorsBySpecialties(
    req: Request,
    res: Response
  ): Promise<Response> {
    logger.info("Received request to fetch instructors by specialties.");
    try {
      // Extract specialties from query parameters
      const specialties: Swimming[] = req.query.specialties
        ? ((Array.isArray(req.query.specialties)
            ? req.query.specialties
            : [req.query.specialties]) as Swimming[])
        : [];
      logger.info(
        `Fetching instructors for specialties: ${specialties.join(", ")}`
      );
      const instructors: Instructor[] =
        await this.instructorService.getInstructorsBySpecialties(specialties);
      logger.info(
        `Retrieved ${instructors.length} instructors matching specialties.`
      );
      return res.status(200).json(instructors);
    } catch (error: any) {
      logger.error("Error fetching instructors by specialties:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieves instructors by availability.
   * @param req - The Express request object. Expects `day`, `startTime`, and `endTime` as query parameters.
   * @param res - The Express response object.
   * @returns A list of instructors available at the specified time and day.
   */
  async getInstructorsByAvailability(
    req: Request,
    res: Response
  ): Promise<Response> {
    logger.info("Received request to fetch instructors by availability.");
    try {
      const day: number = parseInt(req.query.day as string);
      // Parse `startTime` and `endTime` parameters
      const startTime = new Date(req.query.startTime as string);
      const endTime = new Date(req.query.endTime as string);
      logger.info(
        `Fetching instructors available on day ${day} from ${startTime} to ${endTime}.`
      );
      const instructors: Instructor[] =
        await this.instructorService.getInstructorsByAvailability(
          day,
          startTime,
          endTime
        );
      logger.info(
        `Retrieved ${instructors.length} instructors available on day ${day}.`
      );
      return res.status(200).json(instructors);
    } catch (error: any) {
      logger.error("Error fetching instructors by availability:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieves an instructor by their ID.
   * @param req - The Express request object. Expects `instructorId` as a route parameter.
   * @param res - The Express response object.
   * @returns The instructor with the specified ID.
   */
  async getInstructorById(req: Request, res: Response): Promise<Response> {
    const { instructorId } = req.params;
    logger.info(
      `Received request to fetch instructor with ID: ${instructorId}`
    );
    try {
      const instructor: Instructor =
        await this.instructorService.getInstructorById(instructorId);
      logger.info(`Instructor with ID ${instructorId} retrieved successfully.`);
      return res.status(200).json(instructor);
    } catch (error: any) {
      logger.error(`Error fetching instructor with ID ${instructorId}:`, error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Updates an instructor by their ID.
   * @param req - The Express request object. Expects `instructorId` as a route parameter and an `Instructor` object in the body.
   * @param res - The Express response object.
   * @returns The updated instructor.
   */
  async updateInstructor(req: Request, res: Response): Promise<Response> {
    const { instructorId } = req.params;
    logger.info(
      `Received request to update instructor with ID: ${instructorId}.`
    );
    try {
      const instructorData: Instructor = req.body;
      logger.info("Validating and updating instructor data...");
      const updatedInstructor: Instructor | null =
        await this.instructorService.updateInstructor(
          instructorId,
          instructorData
        );
      logger.info(`Instructor with ID ${instructorId} updated successfully.`);
      return res.status(200).json(updatedInstructor);
    } catch (error: any) {
      logger.error(`Error updating instructor with ID ${instructorId}:`, error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Deletes an instructor by their ID.
   * @param req - The Express request object. Expects `instructorId` as a route parameter.
   * @param res - The Express response object.
   * @returns A success message.
   */
  async deleteInstructor(req: Request, res: Response): Promise<Response> {
    const { instructorId } = req.params;
    logger.info(
      `Received request to delete instructor with ID: ${instructorId}`
    );
    try {
      await this.instructorService.deleteInstructor(instructorId);
      logger.info(`Instructor with ID ${instructorId} deleted successfully.`);
      return res
        .status(200)
        .json({ message: "Instructor deleted successfully" });
    } catch (error: any) {
      logger.error(`Error deleting instructor with ID ${instructorId}:`, error);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Deletes all instructors.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A success message.
   */
  async deleteAllInstructors(req: Request, res: Response): Promise<Response> {
    logger.info("Received request to delete all instructors.");
    try {
      await this.instructorService.deleteAllInstructors();
      logger.info("All instructors deleted successfully.");
      return res
        .status(200)
        .json({ message: "All instructors deleted successfully" });
    } catch (error: any) {
      logger.error("Error deleting all instructors:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}
