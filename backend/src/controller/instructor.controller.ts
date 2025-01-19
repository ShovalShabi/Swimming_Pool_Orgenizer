import { Request, Response } from "express";
import InstructorService from "../service/instructor/instructor.service.js";
import { Swimming } from "../utils/swimming-enum.utils.js";
import Instructor from "../dto/instructor/instructor.dto.js";
import NewInstructor from "../dto/instructor/new-instructor.dto.js";
import InstructorServiceInterface from "../service/instructor/IInstructor.service.js";

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
    try {
      const instructorData: NewInstructor = req.body;
      const newInstructor: Instructor =
        await this.instructorService.createInstructor(instructorData);
      return res.status(201).json(newInstructor);
    } catch (error: any) {
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
    try {
      const instructors: Instructor[] =
        await this.instructorService.getAllInstructors();
      return res.status(200).json(instructors);
    } catch (error: any) {
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
    try {
      // Extract specialties from query parameters
      const specialties: Swimming[] = req.query.specialties
        ? ((Array.isArray(req.query.specialties)
            ? req.query.specialties
            : [req.query.specialties]) as Swimming[])
        : [];

      // Call service to retrieve instructors by specialties
      const instructors: Instructor[] =
        await this.instructorService.getInstructorsBySpecialties(specialties);
      return res.status(200).json(instructors);
    } catch (error: any) {
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
    try {
      const day: number = parseInt(req.query.day as string);
      // Parse `startTime` and `endTime` parameters
      const startTime = new Date(req.query.startTime as string);
      const endTime = new Date(req.query.endTime as string);

      const instructors: Instructor[] =
        await this.instructorService.getInstructorsByAvailability(
          day,
          startTime,
          endTime
        );
      return res.status(200).json(instructors);
    } catch (error: any) {
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
    try {
      const { instructorId } = req.params;
      const instructor: Instructor =
        await this.instructorService.getInstructorById(instructorId);
      return res.status(200).json(instructor);
    } catch (error: any) {
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
    try {
      const { instructorId } = req.params;
      const instructorData: Instructor = req.body;
      const updatedInstructor: Instructor | null =
        await this.instructorService.updateInstructor(
          instructorId,
          instructorData
        );
      return res.status(200).json(updatedInstructor);
    } catch (error: any) {
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
    try {
      const { instructorId } = req.params;
      await this.instructorService.deleteInstructor(instructorId);
      return res
        .status(200)
        .json({ message: "Instructor deleted successfully" });
    } catch (error: any) {
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
    try {
      await this.instructorService.deleteAllInstructors();
      return res
        .status(200)
        .json({ message: "All instructors deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
