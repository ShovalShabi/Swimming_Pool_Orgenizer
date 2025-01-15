import { Request, Response } from "express";
import InstructorService from "../service/instructor.service.js";
import { Swimming } from "../utils/swimming-enum.utils.js";
import Instructor from "../dto/instructor/instructor.dto.js";
import NewInstructor from "../dto/instructor/new-instructor.dto.js";

export default class InstructorController {
  private instructorService: InstructorService;

  constructor() {
    this.instructorService = new InstructorService();
  }

  async createInstructor(req: Request, res: Response): Promise<Response> {
    try {
      const instructorData: NewInstructor = req.body;
      const newInstructor: Instructor =
        await this.instructorService.createInstructor(instructorData);
      console.log("creted instructor successfully");

      return res.status(201).json(newInstructor);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

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
   * Get instructors by specialties
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
