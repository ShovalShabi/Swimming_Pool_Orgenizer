import { Request, Response } from "express";
import InstructorService from "../service/instructor.service.js";
import { Swimming } from "../utils/swimming-enum.utils.js";

export default class InstructorController {
  private instructorService: InstructorService;

  constructor() {
    this.instructorService = new InstructorService();
  }

  async createInstructor(req: Request, res: Response): Promise<Response> {
    try {
      const instructorData = req.body;
      const newInstructor = await this.instructorService.createInstructor(
        instructorData
      );
      return res.status(201).json(newInstructor);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getAllInstructors(req: Request, res: Response): Promise<Response> {
    try {
      const instructors = await this.instructorService.getAllInstructors();
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
      const specialties: Swimming[] = req.body; // Expecting an array of specialties from the request body
      const instructors =
        await this.instructorService.getInstructorsBySpecialties(specialties);
      return res.status(200).json(instructors);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getInstructorById(req: Request, res: Response): Promise<Response> {
    try {
      const { instructorId } = req.params;
      const instructor = await this.instructorService.getInstructorById(
        instructorId
      );
      return res.status(200).json(instructor);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateInstructor(req: Request, res: Response): Promise<Response> {
    try {
      const { instructorId } = req.params;
      const instructorData = req.body;
      const updatedInstructor = await this.instructorService.updateInstructor(
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
