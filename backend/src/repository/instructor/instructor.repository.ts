import InstructorRepositoryInterface from "./IInstructor.repository.js";
import InstructorModel, { IInstructor } from "../../model/instructor.model.js";
import Instructor from "../../dto/instructor/instructor.dto.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import StartAndEndTime from "../../dto/instructor/start-and-end-time.dto.js";

export default class InstructorRepository
  implements InstructorRepositoryInterface
{
  async create(instructorData: Instructor): Promise<Instructor> {
    const newInstructor = new InstructorModel(
      Instructor.toModel(instructorData)
    );
    const savedInstructor = await newInstructor.save();
    return Instructor.fromModel(savedInstructor);
  }

  async findAll(): Promise<Instructor[]> {
    const instructorDocs = await InstructorModel.find();
    return instructorDocs.map((doc) => Instructor.fromModel(doc));
  }

  async findById(instructorId: string): Promise<Instructor | null> {
    const instructorDoc = await InstructorModel.findOne({ _id: instructorId });
    return instructorDoc ? Instructor.fromModel(instructorDoc) : null;
  }

  async findBySpecialties(specialties: Swimming[]): Promise<Instructor[]> {
    const instructorDocs = await InstructorModel.find({
      specialties: { $all: specialties },
    });
    return instructorDocs.map((doc) => Instructor.fromModel(doc));
  }

  async findAvailableInstructors(
    day: number,
    startTime: Date,
    endTime: Date
  ): Promise<Instructor[]> {
    const instructorDocs = await InstructorModel.find({
      [`availabilities.${day}`]: {
        $not: { $eq: -1 }, // Ensure the day is not -1 (instructor is available)
      },
      [`availabilities.${day}.startTime`]: { $lte: startTime }, // Instructor's start time is earlier or equal to the requested start time
      [`availabilities.${day}.endTime`]: { $gte: endTime }, // Instructor's end time is later or equal to the requested end time
    });

    return instructorDocs.map((doc) => Instructor.fromModel(doc));
  }

  async update(
    instructorId: string,
    instructorData: Instructor
  ): Promise<Instructor | null> {
    const updatedInstructor = await InstructorModel.findOneAndUpdate(
      { _id: instructorId },
      Instructor.toModel(instructorData),
      { new: true }
    );

    return updatedInstructor ? Instructor.fromModel(updatedInstructor) : null;
  }

  async delete(instructorId: string): Promise<boolean> {
    const result = await InstructorModel.deleteOne({ _id: instructorId });
    return result.deletedCount > 0;
  }

  async deleteAll(): Promise<boolean> {
    const result = await InstructorModel.deleteMany({});
    return result.deletedCount > 0;
  }
}
