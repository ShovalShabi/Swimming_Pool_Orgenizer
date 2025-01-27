import path from "path";
import createHttpError from "http-errors";
import Lesson from "../../dto/lesson/lesson.dto.js";
import NewLesson from "../../dto/lesson/new-lesson.dto.js";
import LessonRepositoryInterface from "../../repository/lesson/ILesson.repository.js";
import LessonRepository from "../../repository/lesson/lesson.repository.js";
import { Swimming } from "../../utils/swimming-enum.utils.js";
import { LessonType } from "../../utils/lesson-enum.utils.js";
import InstructorServiceInterface from "../instructor/IInstructor.service.js";
import InstructorService from "../instructor/instructor.service.js";
import Instructor from "../../dto/instructor/instructor.dto.js";
import StartAndEndTime from "../../dto/instructor/start-and-end-time.dto.js";
import { DaysOfWeek } from "../../utils/days-week-enum.utils.js";
import LessonServiceInterface from "./ILesson.service.js";
import compareTime from "../../utils/compare-hours.utils.js";
import { createCustomLogger } from "../../etc/logger.etc.js";
import Student from "../../dto/student/student.dto.js";

// Initialize logger
const logger = createCustomLogger({
  moduleFilename: path.parse(new URL(import.meta.url).pathname).name,
  logToFile: true,
  logLevel: process.env.INFO_LOG || "info",
  logRotation: true,
});

/**
 * Service for managing lessons.
 * Implements the `LessonServiceInterface` and provides methods for creating, retrieving, updating,
 * and deleting lessons, as well as validating lesson data.
 */
export default class LessonService implements LessonServiceInterface {
  private lessonRepository: LessonRepositoryInterface;
  private instructorService: InstructorServiceInterface;

  constructor() {
    this.lessonRepository = new LessonRepository();
    this.instructorService = new InstructorService();
  }

  /**
   * Creates a new lesson.
   * @param lessonData - The data for the new lesson.
   * @param dayOfTheWeek - The day of the week for the lesson (0 for Sunday, 6 for Saturday).
   * @returns A promise that resolves to the newly created lesson.
   * @throws {BadRequest} If the data or instructor availability is invalid.
   */
  async createLesson(
    lessonData: NewLesson,
    dayOfTheWeek: number
  ): Promise<Lesson> {
    logger.info("Starting to create a new lesson.");
    // Ensure dayOfTheWeek is a valid day
    if (isNaN(dayOfTheWeek) || dayOfTheWeek < 0 || dayOfTheWeek > 6) {
      logger.error("Invalid day of the week provided.");
      throw new createHttpError.BadRequest(
        "Invalid day of the week. Must be between 0 and 6."
      );
    }

    this.validateLessonData(lessonData);

    logger.info("Fetching instructor data for the lesson.");
    const instructorData: Instructor =
      await this.instructorService.getInstructorById(lessonData.instructorId); // must be valid otherwise it will throw an exception

    if (
      !lessonData.specialties.every((specialty) =>
        instructorData.specialties.includes(specialty)
      )
    ) {
      logger.error(
        `Instructor does not teach all required specialties: ${lessonData.specialties}`
      );
      throw new createHttpError.BadRequest(
        "The instructor is not teaching the entire swimming styles of this lesson"
      );
    }

    if (
      instructorData.availabilities[dayOfTheWeek] instanceof StartAndEndTime
    ) {
      logger.info("Validating instructor availability for the lesson.");
      const instStartTime =
        instructorData.availabilities[dayOfTheWeek].startTime;
      const instEndTime = instructorData.availabilities[dayOfTheWeek].endTime;
      if (
        compareTime(lessonData.startAndEndTime.startTime, instStartTime) < 0 || // Start time is earlier than available
        compareTime(lessonData.startAndEndTime.endTime, instEndTime) > 0 // End time is later than available
      ) {
        logger.error(
          `Instructor is unavailable for the requested time slot: ${JSON.stringify(
            lessonData.startAndEndTime
          )}`
        );
        // if the instructor is not teaching in those time slots
        throw new createHttpError.BadRequest(
          `The Instructor ${
            instructorData.name
          } is available only for ${instStartTime.toLocaleTimeString()} - ${instEndTime.toLocaleTimeString()} on ${
            Object.values(DaysOfWeek)[dayOfTheWeek]
          }`
        );
      }

      logger.info(
        `Checking for overlapping lessons for the instructor ${instructorData.instructorId}.`
      );
      const exisitngLessonsOfInstructor = await this.getLessonsOfInstrucorByDay(
        instructorData.instructorId!,
        lessonData.startAndEndTime.endTime
      );
      this.validateOverlappingLessonsForInstructor(
        lessonData,
        exisitngLessonsOfInstructor
      );

      logger.info(
        `Fetcing any exisitng lessons for checking appearnce of any students of the new lesson within them.`
      );
      const lowerBoundTime = new Date(lessonData.startAndEndTime.startTime);
      lowerBoundTime.setHours(lowerBoundTime.getHours() - 1);
      const upperBoundTime = new Date(lessonData.startAndEndTime.endTime);
      upperBoundTime.setHours(upperBoundTime.getHours() + 1);
      const existingLessonsInTimeRange: Lesson[] =
        await this.getAllLessonsWithinRange(lowerBoundTime, upperBoundTime);

      this.validateOverlappingLessonsForStudents(
        lessonData,
        existingLessonsInTimeRange
      );

      const lesson: Lesson = new Lesson(
        null, // lessonId will be assigned by the database
        lessonData.typeLesson,
        lessonData.specialties,
        lessonData.instructorId,
        lessonData.startAndEndTime,
        lessonData.students
      );

      logger.info("Creating lesson in the database.");
      const createdLesson = await this.lessonRepository.createLesson(lesson);
      logger.info(
        `Lesson created successfully with ID: ${createdLesson.lessonId}`
      );
      return createdLesson;
    }

    logger.error(
      `Instructor ${instructorData.name} is not available on the requested day.`
    );
    throw new createHttpError.BadRequest(
      `The Instructor ${instructorData.name} is not teaching on ${
        Object.values(DaysOfWeek)[dayOfTheWeek]
      }`
    );
  }

  /**
   * Retrieves a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson.
   * @returns A promise that resolves to the lesson.
   * @throws {NotFound} If no lesson is found with the given ID.
   */
  async getLessonById(lessonId: string): Promise<Lesson> {
    logger.info(`Fetching lesson with ID: ${lessonId}`);
    const lesson = await this.lessonRepository.getLessonById(lessonId);

    if (!lesson) {
      logger.error(`Lesson with ID ${lessonId} not found.`);
      throw new createHttpError.NotFound(
        `Lesson with ID ${lessonId} not found`
      );
    }
    logger.info(`Lesson with ID ${lessonId} retrieved successfully.`);
    return lesson;
  }

  /**
   * Retrieves all lessons within a specified date range.
   * @param start - The start date of the range.
   * @param end - The end date of the range.
   * @returns A promise that resolves to an array of lessons.
   * @throws {BadRequest} If the date range is invalid.
   */
  async getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]> {
    logger.info(`Fetching lessons within range: ${start} to ${end}`);
    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      logger.error("Invalid date range provided.");
      throw new createHttpError.BadRequest(
        "Invalid date format. Provide valid start and end dates."
      );
    }
    const lessons = await this.lessonRepository.getAllLessonsWithinRange(
      start,
      end
    );
    logger.info(
      `Retrieved ${lessons.length} lessons within the specified range.`
    );
    return lessons;
  }

  /**
   * Retrieves all lessons for an instructor on a specific day.
   * @param instructorId - The unique identifier of the instructor.
   * @param day - The specific day to filter lessons.
   * @returns A promise that resolves to an array of lessons.
   */
  async getLessonsOfInstrucorByDay(
    instructorId: string,
    day: Date
  ): Promise<Lesson[]> {
    logger.info(
      `Fetching lessons for instructor ${instructorId} on day: ${day}`
    );
    // Retrieve all lessons for the instructor
    const allLessons: Lesson[] =
      await this.lessonRepository.getInstructorLessons(instructorId);

    // Extract the day from the given Date object for filtering
    const targetDay = day.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Filter lessons by the specified day
    const filteredLessons = allLessons.filter((lesson: Lesson) => {
      const lessonDay = lesson.startAndEndTime.startTime.getDay();
      return lessonDay === targetDay;
    });

    logger.info(
      `Retrieved ${filteredLessons.length} lessons for instructor ${instructorId} on day: ${day}.`
    );
    return filteredLessons;
  }

  /**
   * Updates a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson.
   * @param lessonData - The updated lesson data.
   * @returns A promise that resolves to the updated lesson or `null` if not found.
   * @throws {NotFound} If no lesson is found with the given ID.
   */
  async updateLesson(
    lessonId: string,
    lessonData: Lesson
  ): Promise<Lesson | null> {
    const lesson = await this.getLessonById(lessonId);

    if (!lesson) {
      logger.error(`Lesson with ID : ${lessonId} is not found`);
      throw new createHttpError.NotFound(
        `Lesson with ID ${lessonId} not found`
      );
    }

    logger.info("Validating instructor availability for updated lesson.");
    this.validateLessonData(lessonData);

    const instructorData: Instructor =
      await this.instructorService.getInstructorById(lessonData.instructorId); // must be valid otherwise it will throw an exception

    if (
      !lessonData.specialties.every((specialty) =>
        instructorData.specialties.includes(specialty)
      )
    ) {
      logger.error("Instructor does not match required specialties.");
      throw new createHttpError.BadRequest(
        "The instructor is not teaching the entire swimming styles of this lesson"
      );
    }

    const dayOfTheWeek = lessonData.startAndEndTime.endTime.getDay(); // extracting the new day of the lesson (can be the same as before)

    if (
      instructorData.availabilities[dayOfTheWeek] instanceof StartAndEndTime
    ) {
      const instStartTime =
        instructorData.availabilities[dayOfTheWeek].startTime;
      const instEndTime = instructorData.availabilities[dayOfTheWeek].endTime;
      if (
        compareTime(lessonData.startAndEndTime.startTime, instStartTime) < 0 || // Start time is earlier than available
        compareTime(lessonData.startAndEndTime.endTime, instEndTime) > 0 // End time is later than available
      )
        // if the instructor is not teaching in those time slots
        throw new createHttpError.BadRequest(
          `The Instructor ${
            instructorData.name
          } is available only for ${instStartTime.toLocaleTimeString()} - ${instEndTime.toLocaleTimeString()} on ${
            Object.values(DaysOfWeek)[dayOfTheWeek]
          }`
        );

      logger.info(
        `Checking for overlapping lessons for the instructor ${instructorData.instructorId}.`
      );
      const exisitngLessonsOfInstructor = await this.getLessonsOfInstrucorByDay(
        instructorData.instructorId!,
        lessonData.startAndEndTime.endTime
      );
      this.validateOverlappingLessonsForInstructor(
        lessonData,
        exisitngLessonsOfInstructor
      );

      logger.info(
        `Fetcing any exisitng lessons for checking appearnce of any students of the new lesson within them.`
      );
      const lowerBoundTime = new Date(lessonData.startAndEndTime.startTime);
      lowerBoundTime.setHours(lowerBoundTime.getHours() - 1);
      const upperBoundTime = new Date(lessonData.startAndEndTime.endTime);
      upperBoundTime.setHours(upperBoundTime.getHours() + 1);
      const existingLessonsInTimeRange: Lesson[] =
        await this.getAllLessonsWithinRange(lowerBoundTime, upperBoundTime);

      this.validateOverlappingLessonsForStudents(
        lessonData,
        existingLessonsInTimeRange
      );

      const updatedLesson: Lesson = {
        instructorId: lessonData.instructorId,
        lessonId,
        specialties: [...lessonData.specialties],
        typeLesson: lessonData.typeLesson,
        startAndEndTime: lessonData.startAndEndTime,
        students: [...lessonData.students],
      };

      logger.info(
        `The lesson with ID ${lessonId} has been updated successfully!`
      );
      return this.lessonRepository.updateLesson(lessonId, updatedLesson);
    }

    throw new createHttpError.BadRequest(
      `The Instrucor ${instructorData.name} is not teaching on ${
        Object.values(DaysOfWeek)[dayOfTheWeek]
      }`
    );
  }

  /**
   * Deletes a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson to delete.
   * @returns A promise that resolves to `true` if the lesson was deleted successfully.
   */
  async deleteLesson(lessonId: string): Promise<boolean> {
    logger.info(`Deleting lesson with ID: ${lessonId}`);
    const result = await this.lessonRepository.deleteLesson(lessonId);
    logger.info(`Lesson with ID ${lessonId} deleted successfully.`);
    return result;
  }

  /**
   * Deletes all lessons with the specified instructorId.
   * @param instructorId - The unique identifier of the instructor whose lessons should be deleted.
   * @returns A promise that resolves to the number of lessons deleted.
   */
  async deleteLessonsByInstructorId(instructorId: string): Promise<number> {
    logger.info(`Deleting all lessons for instructor with ID: ${instructorId}`);

    // Validate instructor existence
    const instructorExists = await this.instructorService.getInstructorById(
      instructorId
    );
    if (!instructorExists) {
      logger.error(`Instructor with ID ${instructorId} not found.`);
      throw new createHttpError.NotFound(
        `Instructor with ID ${instructorId} not found`
      );
    }

    // Delete lessons
    const deletedCount =
      await this.lessonRepository.deleteLessonsByInstructorId(instructorId);

    logger.info(
      `Successfully deleted ${deletedCount} lessons for instructor with ID: ${instructorId}`
    );

    return deletedCount;
  }

  /**
   * Deletes a lesson by its ID.
   * @param lessonId - The unique identifier of the lesson to delete.
   * @returns A promise that resolves to `true` if the lesson was deleted successfully.
   */
  async deleteAllLessons(): Promise<boolean> {
    logger.info(`Deleting all lessons`);
    const result = await this.lessonRepository.deleteAllLessons();
    logger.info(`All lessons has been deleted successfully.`);
    return result;
  }

  /**
   * Validates lesson data.
   * Ensures all properties of the lesson are valid, including lesson type, duration, and student details.
   * @param lessonData - The lesson data to validate.
   * @throws {BadRequest} If any validation rule is violated.
   */
  validateLessonData = (lessonData: Lesson | NewLesson): void => {
    if (!Object.values(LessonType).includes(lessonData.typeLesson)) {
      throw new createHttpError.BadRequest(
        `Invalid specialty: ${
          lessonData.typeLesson
        }. Must be one of: ${Object.values(LessonType).join(", ")}`
      );
    }

    if (lessonData.specialties.length === 0)
      throw new createHttpError.BadRequest(
        `Lesson must contain at least one specialty of: ${Object.values(
          Swimming
        ).join(", ")}`
      );

    // Validate each specialty against the Swimming enum
    for (const specialty of lessonData.specialties) {
      if (!Object.values(Swimming).includes(specialty)) {
        throw new createHttpError.BadRequest(
          `Invalid specialty: ${specialty}. Must be one of: ${Object.values(
            Swimming
          ).join(", ")}`
        );
      }
    }

    // Validate that the converted objects are valid Dates
    if (
      isNaN(lessonData.startAndEndTime.startTime.getTime()) ||
      isNaN(lessonData.startAndEndTime.endTime.getTime())
    )
      throw new createHttpError.BadRequest("Invalid date parameter.");

    // Validate lesson duration based on type
    const startTime = lessonData.startAndEndTime.startTime.getTime();
    const endTime = lessonData.startAndEndTime.endTime.getTime();
    const durationInMinutes = (endTime - startTime) / (1000 * 60);

    if (
      (lessonData.typeLesson === LessonType.MIXED ||
        lessonData.typeLesson === LessonType.PUBLIC) &&
      durationInMinutes !== 60
    ) {
      throw new createHttpError.BadRequest(
        `Invalid duration for ${lessonData.typeLesson} lesson. It must last exactly 1 hour.`
      );
    }

    if (
      lessonData.typeLesson === LessonType.PRIVATE &&
      durationInMinutes !== 45
    ) {
      throw new createHttpError.BadRequest(
        `Invalid duration for ${lessonData.typeLesson} lesson. It must last exactly 45 minutes.`
      );
    }

    if (lessonData.students.length === 0 || lessonData.students.length > 30) {
      throw new createHttpError.BadRequest(
        "The number of students taking the lesson must be between 1 to 30."
      );
    }

    if (
      lessonData.students.length !== 1 &&
      lessonData.typeLesson === LessonType.PRIVATE
    ) {
      throw new createHttpError.BadRequest(
        "Private lesson must contain only sole student."
      );
    }

    const phoneNumbers = lessonData.students.map(
      (student) => student.phoneNumber
    );
    const uniquePhoneNumbers = new Set(phoneNumbers);

    if (phoneNumbers.length !== uniquePhoneNumbers.size) {
      throw new createHttpError.BadRequest(
        "Duplicate students with the same phone number are not allowed."
      );
    }

    lessonData.students.map((student) => {
      if (student.name.length === 0) {
        logger.warn(`A student has illegal name, which must be not empty`);
        throw new createHttpError.BadRequest(
          `A student has illegal name, which must be not empty`
        );
      }
      if (student.preferences.length === 0) {
        throw new createHttpError.BadRequest(
          "Every student's preferences must be at least one of the specialties that are being taught in the lesson."
        );
      }

      if (
        student.phoneNumber.length !== 10 ||
        !/^\d+$/.test(student.phoneNumber)
      ) {
        logger.warn(
          `The student ${student.name} has illegal phone number that must be 10 digits long and must contain only numbers`
        );
        throw new createHttpError.BadRequest(
          `The student ${student.name} has illegal phone number that must be 10 digits long`
        );
      }

      if (
        !student.preferences.every((preference) =>
          lessonData.specialties.includes(preference)
        )
      ) {
        throw new createHttpError.BadRequest(
          `The lesson is not answering the full requirements of the student which wanted ${Object.values(
            student.preferences
          ).join(", ")} while the lesson offers ${Object.values(
            lessonData.specialties
          ).join(", ")}`
        );
      }
    });
  };

  /**
   * Validates that the new lesson does not overlap with existing lessons of certain instructor.
   * @param targetLesson - The lesson being created/updated.
   * @param arrExistingLessons - Array of existing lessons to compare against.
   * @throws {BadRequest} If overlapping lessons are found.
   */
  validateOverlappingLessonsForInstructor = (
    targetLesson: Lesson | NewLesson,
    arrExistingLessons: Lesson[]
  ) => {
    const targetStart = targetLesson.startAndEndTime.startTime;
    const targetEnd = targetLesson.startAndEndTime.endTime;

    for (const existingLesson of arrExistingLessons) {
      const existingStart = existingLesson.startAndEndTime.startTime;
      const existingEnd = existingLesson.startAndEndTime.endTime;

      // Check if the time ranges overlap using compareTime
      const startComparison = compareTime(targetStart, existingEnd);
      const endComparison = compareTime(targetEnd, existingStart);

      const isOverlapping = startComparison < 0 && endComparison > 0;

      if (isOverlapping) {
        // Check if the targetLesson is a Lesson and if it's the same lesson
        if (
          "lessonId" in targetLesson && // Check if targetLesson has 'lessonId'
          targetLesson.lessonId === existingLesson.lessonId
        ) {
          continue; // Skip the comparison for the same lesson
        }

        throw new createHttpError.BadRequest(
          `Overlapping lessons detected between new lesson and existing lesson ${existingLesson.lessonId}`
        );
      }
    }
  };

  /**
   * Validates that the new lesson or exisitng lesson does not overlap with existing students in other available lessons.
   * @param targetLesson - The lesson being created/updated.
   * @param arrExistingLessons - Array of existing lessons to compare against.
   * @throws {BadRequest} If overlapping lessons are found.
   */
  validateOverlappingLessonsForStudents = (
    targetLesson: Lesson | NewLesson,
    arrExistingLessons: Lesson[]
  ) => {
    const targetStudentArr: Student[] = targetLesson.students;
    const targetStart = targetLesson.startAndEndTime.startTime;
    const targetEnd = targetLesson.startAndEndTime.endTime;
    arrExistingLessons.map((existingLesson: Lesson) => {
      // Check if the time ranges overlap using compareTime
      const existingStart = existingLesson.startAndEndTime.startTime;
      const existingEnd = existingLesson.startAndEndTime.endTime;

      const startComparison = compareTime(targetStart, existingEnd);
      const endComparison = compareTime(targetEnd, existingStart);

      const isOverlapping = startComparison < 0 && endComparison > 0;

      if (isOverlapping) {
        // Check if the targetLesson is a Lesson and if it's the same lesson
        // Determine if we need to skip comparison for the same lesson
        if (
          "lessonId" in targetLesson &&
          targetLesson.lessonId === existingLesson.lessonId
        ) {
          return; // Skip comparison for the same lesson
        }
        // Check if any student in targetLesson has the same phone number as a student in existingLesson
        const hasDuplicatePhoneNumber = targetStudentArr.some((targetStudent) =>
          existingLesson.students.some(
            (existingStudent) =>
              existingStudent.phoneNumber === targetStudent.phoneNumber
          )
        );

        if (hasDuplicatePhoneNumber) {
          throw new createHttpError.BadRequest(
            "One or more students in the target lesson have the same phone number as a student in an overlapping lesson."
          );
        }
      }
    });
  };
}
