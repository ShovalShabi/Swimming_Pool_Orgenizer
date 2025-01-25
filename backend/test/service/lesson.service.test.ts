import { jest } from "@jest/globals";
import LessonService from "../../src/service/lesson/lesson.service.js";
import Lesson from "../../src/dto/lesson/lesson.dto.js";
import NewLesson from "../../src/dto/lesson/new-lesson.dto.js";
import Instructor from "../../src/dto/instructor/instructor.dto.js";
import { LessonType } from "../../src/utils/lesson-enum.utils.js";
import { Swimming } from "../../src/utils/swimming-enum.utils.js";
import StartAndEndTime from "../../src/dto/instructor/start-and-end-time.dto.js";
import createHttpError from "http-errors";

const mockLessonRepo = {
  createLesson: jest.fn(),
  getLessonById: jest.fn(),
  getAllLessonsWithinRange: jest.fn(),
  getInstructorLessons: jest.fn(),
  updateLesson: jest.fn(),
  deleteLesson: jest.fn(),
  deleteLessonsByInstructorId: jest.fn(),
  deleteAllLessons: jest.fn(),
} as any;

const mockInstructorService = {
  getInstructorById: jest.fn(),
} as any;

describe("LessonService", () => {
  let service: LessonService;

  beforeEach(() => {
    service = new LessonService();
    service["lessonRepository"] = mockLessonRepo;
    service["instructorService"] = mockInstructorService;
    jest.clearAllMocks();

    // Default mock setup for getInstructorLessons
    mockLessonRepo.getInstructorLessons.mockResolvedValue([]);
  });

  describe("createLesson", () => {
    it("should create a valid lesson", async () => {
      const instructor = new Instructor(
        "123",
        "John Doe",
        [Swimming.BACK_STROKE],
        [
          -1,
          -1,
          new StartAndEndTime(
            new Date("2025-01-14T09:00:00Z"),
            new Date("2025-01-14T17:00:00Z")
          ),
          -1,
          -1,
          -1,
          -1,
        ]
      );

      const newLesson = new NewLesson(
        LessonType.PUBLIC,
        instructor.instructorId!,
        [Swimming.BACK_STROKE],
        new StartAndEndTime(
          new Date("2025-01-14T10:00:00Z"),
          new Date("2025-01-14T11:00:00Z")
        ),
        [
          {
            name: "Jane Doe",
            preferences: [Swimming.BACK_STROKE],
            lessonType: LessonType.PUBLIC,
          },
        ]
      );

      const createdLesson = new Lesson(
        "12345",
        newLesson.typeLesson,
        newLesson.specialties,
        newLesson.instructorId,
        newLesson.startAndEndTime,
        newLesson.students
      );

      mockInstructorService.getInstructorById.mockResolvedValue(instructor);
      mockLessonRepo.createLesson.mockResolvedValue(createdLesson);

      console.log(`Created lesson: ${JSON.stringify(createdLesson, null, 2)}`);

      const result = await service.createLesson(newLesson, 2);
      expect(result).toEqual(createdLesson);
      expect(mockLessonRepo.createLesson).toHaveBeenCalledWith(
        expect.any(Lesson)
      );
    });

    it("should throw BadRequest for invalid day", async () => {
      const newLesson = new NewLesson(
        LessonType.PUBLIC,
        "123",
        [Swimming.BACK_STROKE],
        new StartAndEndTime(
          new Date("2025-01-14T10:00:00Z"),
          new Date("2025-01-14T11:00:00Z")
        ),
        [
          {
            name: "Jane Doe",
            preferences: [Swimming.BACK_STROKE],
            lessonType: LessonType.PUBLIC,
          },
        ]
      );

      await expect(service.createLesson(newLesson, -1)).rejects.toThrow(
        createHttpError.BadRequest
      );
      await expect(service.createLesson(newLesson, 7)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });

    it("should throw BadRequest if instructor does not teach required specialties", async () => {
      const instructor = new Instructor(
        "123",
        "John Doe",
        [Swimming.BUTTERFLY_STROKE],
        [
          -1,
          -1,
          new StartAndEndTime(
            new Date("2025-01-14T09:00:00Z"),
            new Date("2025-01-14T17:00:00Z")
          ),
          -1,
          -1,
          -1,
          -1,
        ]
      );

      const newLesson = new NewLesson(
        LessonType.PUBLIC,
        instructor.instructorId!,
        [Swimming.BACK_STROKE],
        new StartAndEndTime(
          new Date("2025-01-14T10:00:00Z"),
          new Date("2025-01-14T11:00:00Z")
        ),
        [
          {
            name: "Jane Doe",
            preferences: [Swimming.BACK_STROKE],
            lessonType: LessonType.PUBLIC,
          },
        ]
      );

      mockInstructorService.getInstructorById.mockResolvedValue(instructor);

      await expect(service.createLesson(newLesson, 2)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });

    it("should throw BadRequest if lesson overlaps with existing lessons", async () => {
      const instructor = new Instructor(
        "123",
        "John Doe",
        [Swimming.BACK_STROKE],
        [
          -1,
          -1,
          new StartAndEndTime(
            new Date("2025-01-14T09:00:00Z"),
            new Date("2025-01-14T17:00:00Z")
          ),
          -1,
          -1,
          -1,
          -1,
        ]
      );

      const newLesson = new NewLesson(
        LessonType.PUBLIC,
        instructor.instructorId!,
        [Swimming.BACK_STROKE],
        new StartAndEndTime(
          new Date("2025-01-14T10:00:00Z"),
          new Date("2025-01-14T11:00:00Z")
        ),
        [
          {
            name: "Jane Doe",
            preferences: [Swimming.BACK_STROKE],
            lessonType: LessonType.PUBLIC,
          },
        ]
      );

      const overlappingLesson = new Lesson(
        "54321",
        LessonType.PUBLIC,
        [Swimming.BACK_STROKE],
        instructor.instructorId!,
        new StartAndEndTime(
          new Date("2025-01-14T10:00:00Z"),
          new Date("2025-01-14T11:00:00Z")
        ),
        [
          {
            name: "John Doe",
            preferences: [Swimming.BACK_STROKE],
            lessonType: LessonType.PUBLIC,
          },
        ]
      );

      mockInstructorService.getInstructorById.mockResolvedValue(instructor);
      mockLessonRepo.getInstructorLessons.mockResolvedValue([
        overlappingLesson,
      ]);

      await expect(service.createLesson(newLesson, 2)).rejects.toThrow(
        createHttpError.BadRequest
      );
    });
  });

  describe("getLessonById", () => {
    it("should retrieve a lesson by ID", async () => {
      const lesson = new Lesson(
        "123",
        LessonType.PUBLIC,
        [Swimming.BACK_STROKE],
        "123",
        new StartAndEndTime(
          new Date("2025-01-14T10:00:00Z"),
          new Date("2025-01-14T11:00:00Z")
        ),
        [
          {
            name: "Jane Doe",
            preferences: [Swimming.BACK_STROKE],
            lessonType: LessonType.PUBLIC,
          },
        ]
      );

      mockLessonRepo.getLessonById.mockResolvedValue(lesson);

      const result = await service.getLessonById("123");
      expect(result).toEqual(lesson);
    });

    it("should throw NotFound if lesson does not exist", async () => {
      mockLessonRepo.getLessonById.mockResolvedValue(null);
      await expect(service.getLessonById("123")).rejects.toThrow(
        createHttpError.NotFound
      );
    });
  });

  describe("deleteLesson", () => {
    it("should delete a lesson by ID", async () => {
      mockLessonRepo.deleteLesson.mockResolvedValue(true);

      const result = await service.deleteLesson("123");
      expect(result).toBe(true);
      expect(mockLessonRepo.deleteLesson).toHaveBeenCalledWith("123");
    });

    it("should return false if lesson is not found", async () => {
      mockLessonRepo.deleteLesson.mockResolvedValue(false);

      const result = await service.deleteLesson("123");
      expect(result).toBe(false);
    });
  });

  describe("deleteAllLessons", () => {
    it("should delete all lessons", async () => {
      mockLessonRepo.deleteAllLessons.mockResolvedValue(true);

      const result = await service.deleteAllLessons();
      expect(result).toBe(true);
      expect(mockLessonRepo.deleteAllLessons).toHaveBeenCalledTimes(1);
    });

    it("should return false if no lessons are found to delete", async () => {
      mockLessonRepo.deleteAllLessons.mockResolvedValue(false);

      const result = await service.deleteAllLessons();
      expect(result).toBe(false);
    });
  });
});
