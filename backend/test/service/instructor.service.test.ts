import InstructorService from "../../src/service/instructor/instructor.service.js";
import Instructor from "../../src/dto/instructor/instructor.dto.js";
import NewInstructor from "../../src/dto/instructor/new-instructor.dto.js";
import { Swimming } from "../../src/utils/swimming-enum.utils.js";
import createHttpError from "http-errors";
import { jest } from "@jest/globals";
import InstructorRepository from "../../src/repository/instructor/instructor.repository.js";
import LessonRepository from "../../src/repository/lesson/lesson.repository.js";

// Mock the methods manually to ensure Jest recognizes them
const mockInstructorRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findBySpecialties: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  findAvailableInstructors: jest.fn(),
  delete: jest.fn(),
  deleteAll: jest.fn(),
} as unknown as jest.Mocked<InstructorRepository>;

const mockLessonRepo = {
  deleteLessonsByInstructorId: jest.fn(),
  deleteAllLessons: jest.fn(),
} as unknown as jest.Mocked<LessonRepository>;

describe("InstructorService", () => {
  let service: InstructorService;

  beforeEach(() => {
    service = new InstructorService();
    service["instructorRepository"] = mockInstructorRepo;
    service["lessonRepository"] = mockLessonRepo;
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  describe("createInstructor", () => {
    it("should create a new instructor with valid data", async () => {
      const newInstructor = new NewInstructor(
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );
      const createdInstructor = new Instructor(
        "123",
        newInstructor.name,
        newInstructor.specialties,
        newInstructor.availabilities
      );

      mockInstructorRepo.create.mockResolvedValue(createdInstructor);

      const result = await service.createInstructor(newInstructor);

      expect(result).toEqual(createdInstructor);
      expect(mockInstructorRepo.create).toHaveBeenCalledWith(
        expect.any(Instructor)
      );
      expect(result).toHaveProperty("instructorId");
    });

    it("should throw BadRequest if availabilities length is invalid", async () => {
      const invalidInstructor = new NewInstructor(
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        []
      );

      await expect(service.createInstructor(invalidInstructor)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });

    it("should throw BadRequest if specialties are empty", async () => {
      const invalidInstructor = new NewInstructor(
        "John Doe",
        [],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );

      await expect(service.createInstructor(invalidInstructor)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });

    it("should throw BadRequest if time ranges are invalid", async () => {
      const invalidInstructor = new NewInstructor(
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T17:00:00Z"),
            endTime: new Date("2025-01-16T09:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );

      await expect(service.createInstructor(invalidInstructor)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });
  });

  describe("updateInstructor", () => {
    it("should update an instructor with valid data", async () => {
      const instructorId = "123";
      const existingInstructor = new Instructor(
        instructorId,
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );
      const updatedData = new Instructor(
        instructorId,
        "Jane Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T10:00:00Z"),
            endTime: new Date("2025-01-16T18:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );

      mockInstructorRepo.findById.mockResolvedValue(existingInstructor);
      mockInstructorRepo.update.mockResolvedValue(updatedData);

      const result = await service.updateInstructor(instructorId, updatedData);

      expect(updatedData).toBeInstanceOf(Instructor);
      expect(result).toEqual(updatedData);
      expect(mockInstructorRepo.findById).toHaveBeenCalledWith(instructorId);
      expect(mockInstructorRepo.update).toHaveBeenCalledWith(
        instructorId,
        updatedData
      );
    });

    it("should throw NotFound if the instructor ID does not exist", async () => {
      const instructorId = "999";
      const updatedData = new Instructor(
        instructorId,
        "Jane Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T10:00:00Z"),
            endTime: new Date("2025-01-16T18:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );

      mockInstructorRepo.findById.mockResolvedValue(null);

      await expect(
        service.updateInstructor(instructorId, updatedData)
      ).rejects.toThrow(createHttpError.NotFound);
    });

    it("should throw BadRequest if updated data is invalid", async () => {
      const instructorId = "123";
      const existingInstructor = new Instructor(
        instructorId,
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );
      const invalidData = new Instructor(
        instructorId,
        "Jane Doe",
        [],
        [] // Invalid specialties and availabilities
      );

      mockInstructorRepo.findById.mockResolvedValue(existingInstructor);

      await expect(
        service.updateInstructor(instructorId, invalidData)
      ).rejects.toThrow(createHttpError.BadRequest);
    });

    it("should handle errors during the update process", async () => {
      const instructorId = "123";
      const existingInstructor = new Instructor(
        instructorId,
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );
      const updatedData = new Instructor(
        instructorId,
        "Jane Doe",
        ["BUTTERFLY_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T10:00:00Z"),
            endTime: new Date("2025-01-16T18:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );

      mockInstructorRepo.findById.mockResolvedValue(existingInstructor);
      mockInstructorRepo.update.mockRejectedValue(new Error("Database error"));

      await expect(
        service.updateInstructor(instructorId, updatedData)
      ).rejects.toThrow("Database error");
    });
  });

  describe("Edge Case Validation", () => {
    it("should throw BadRequest if availabilities contain invalid times", async () => {
      const invalidInstructor = new NewInstructor(
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          {
            startTime: new Date("2025-01-16T18:00:00Z"),
            endTime: new Date("2025-01-16T09:00:00Z"), // Invalid time range
          },
        ]
      );

      await expect(service.createInstructor(invalidInstructor)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });

    it("should throw BadRequest if no availability days are provided", async () => {
      const invalidInstructor = new NewInstructor(
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        [-1, -1, -1, -1, -1, -1, -1] // All unavailable days
      );

      await expect(service.createInstructor(invalidInstructor)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });

    it("should throw BadRequest if name is empty or whitespace", async () => {
      const invalidInstructor = new NewInstructor(
        "   ", // Invalid name
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );

      await expect(service.createInstructor(invalidInstructor)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });
  });

  describe("getAllInstructors", () => {
    it("should return all instructors", async () => {
      const instructors = [
        new Instructor("123", "John Doe", ["BACK_STROKE"] as Swimming[], [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]),
      ];

      mockInstructorRepo.findAll.mockResolvedValue(instructors);

      const result = await service.getAllInstructors();

      expect(result).toEqual(instructors);
      expect(mockInstructorRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getInstructorById", () => {
    it("should retrieve an instructor by ID", async () => {
      const instructorId = "123";
      const instructor = new Instructor(
        instructorId,
        "John Doe",
        ["BACK_STROKE"] as Swimming[],
        [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]
      );

      mockInstructorRepo.findById.mockResolvedValue(instructor);

      const result = await service.getInstructorById(instructorId);

      expect(result).toEqual(instructor);
      expect(mockInstructorRepo.findById).toHaveBeenCalledWith(instructorId);
    });

    it("should throw NotFound if instructor does not exist", async () => {
      const instructorId = "999";

      mockInstructorRepo.findById.mockResolvedValue(null);

      await expect(service.getInstructorById(instructorId)).rejects.toThrow(
        createHttpError.NotFound
      );
    });
  });

  describe("getInstructorsBySpecialties", () => {
    it("should retrieve instructors by specialties", async () => {
      const specialties = ["BACK_STROKE"] as Swimming[];
      const instructors = [
        new Instructor("123", "John Doe", specialties, [
          -1,
          -1,
          {
            startTime: new Date("2025-01-16T09:00:00Z"),
            endTime: new Date("2025-01-16T17:00:00Z"),
          },
          -1,
          -1,
          -1,
          -1,
        ]),
      ];

      mockInstructorRepo.findBySpecialties.mockResolvedValue(instructors);

      const result = await service.getInstructorsBySpecialties(specialties);

      expect(result).toEqual(instructors);
      expect(mockInstructorRepo.findBySpecialties).toHaveBeenCalledWith(
        specialties
      );
    });

    it("should throw BadRequest for invalid specialties", async () => {
      const specialties = ["INVALID_SPECIALTY"];

      await expect(
        service.getInstructorsBySpecialties(specialties as Swimming[])
      ).rejects.toThrow(createHttpError.BadRequest);
    });
  });

  describe("getInstructorsByAvailability", () => {
    it("should retrieve instructors by availability", async () => {
      const day = 2;
      const startTime = new Date("2025-01-16T09:00:00Z");
      const endTime = new Date("2025-01-16T17:00:00Z");
      const instructors = [
        new Instructor("123", "John Doe", ["BACK_STROKE"] as Swimming[], [
          -1,
          -1,
          { startTime, endTime },
          -1,
          -1,
          -1,
          -1,
        ]),
      ];

      mockInstructorRepo.findAvailableInstructors.mockResolvedValue(
        instructors
      );

      const result = await service.getInstructorsByAvailability(
        day,
        startTime,
        endTime
      );

      expect(result).toEqual(instructors);
      expect(mockInstructorRepo.findAvailableInstructors).toHaveBeenCalledWith(
        day,
        startTime,
        endTime
      );
    });

    it("should throw BadRequest for invalid day", async () => {
      const day = 7;
      const startTime = new Date("2025-01-16T09:00:00Z");
      const endTime = new Date("2025-01-16T17:00:00Z");

      await expect(
        service.getInstructorsByAvailability(day, startTime, endTime)
      ).rejects.toThrow(createHttpError.BadRequest);
    });

    it("should throw BadRequest for invalid time range", async () => {
      const day = 2;
      const startTime = new Date("2025-01-16T17:00:00Z");
      const endTime = new Date("2025-01-16T09:00:00Z");

      await expect(
        service.getInstructorsByAvailability(day, startTime, endTime)
      ).rejects.toThrow(createHttpError.BadRequest);
    });
  });

  describe("deleteInstructor", () => {
    it("should delete instructor by ID", async () => {
      const instructorId = "123";

      mockInstructorRepo.delete.mockResolvedValue(true);
      mockLessonRepo.deleteLessonsByInstructorId.mockResolvedValue(1);

      const result = await service.deleteInstructor(instructorId);

      expect(result).toBe(true);
      expect(mockInstructorRepo.delete).toHaveBeenCalledWith(instructorId);
      expect(mockLessonRepo.deleteLessonsByInstructorId).toHaveBeenCalledWith(
        instructorId
      );
    });

    it("should handle errors when deleting an instructor", async () => {
      const instructorId = "123";

      mockInstructorRepo.delete.mockRejectedValue(new Error("Delete failed"));

      await expect(service.deleteInstructor(instructorId)).rejects.toThrow(
        "Delete failed"
      );
    });
  });

  describe("deleteAllInstructors", () => {
    it("should delete all instructors and their lessons", async () => {
      mockInstructorRepo.deleteAll.mockResolvedValue(true);
      mockLessonRepo.deleteAllLessons.mockResolvedValue(true);

      const result = await service.deleteAllInstructors();

      expect(result).toBe(true);
      expect(mockInstructorRepo.deleteAll).toHaveBeenCalledTimes(1);
      expect(mockLessonRepo.deleteAllLessons).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during deletion", async () => {
      mockInstructorRepo.deleteAll.mockRejectedValue(
        new Error("Delete failed")
      );

      await expect(service.deleteAllInstructors()).rejects.toThrow(
        "Delete failed"
      );
    });
  });
});
