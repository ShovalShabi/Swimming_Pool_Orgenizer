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

export default class LessonService implements LessonServiceInterface {
  private lessonRepository: LessonRepositoryInterface;
  private instructorService: InstructorServiceInterface;

  constructor() {
    this.lessonRepository = new LessonRepository();
    this.instructorService = new InstructorService();
  }

  async createLesson(
    lessonData: NewLesson,
    dayOfTheWeek: number
  ): Promise<Lesson> {
    // Ensure dayOfTheWeek is a valid day
    if (isNaN(dayOfTheWeek) || dayOfTheWeek < 0 || dayOfTheWeek > 6)
      throw new createHttpError.BadRequest(
        "Invalid day of the week. Must be between 0 and 6."
      );

    this.validateLessonData(lessonData);

    const instructorData: Instructor =
      await this.instructorService.getInstructorById(lessonData.instructorId); // must be valid otherwise it will throw an exception

    if (
      lessonData.specialties.every((specialty) =>
        instructorData.specialties.includes(specialty)
      )
    ) {
      throw new createHttpError.BadRequest(
        "The instructor is not teaching the entire swimming styles of this lesson"
      );
    }

    if (
      instructorData.availabilities[dayOfTheWeek] instanceof StartAndEndTime
    ) {
      const instStartTime =
        instructorData.availabilities[dayOfTheWeek].startTime;
      const instEndTime = instructorData.availabilities[dayOfTheWeek].endTime;
      if (
        !(
          lessonData.startAndEndTime.startTime >= instStartTime &&
          lessonData.startAndEndTime.endTime <= instEndTime
        )
      )
        // if the instructor is not teaching in those time slots
        throw new createHttpError.BadRequest(
          `The Instructor ${
            instructorData.name
          } is available only for ${instStartTime.getHours()}:${instStartTime.getMinutes()} - ${instEndTime.getHours()}:${instEndTime.getMinutes()} on ${
            Object.values(DaysOfWeek)[dayOfTheWeek]
          }`
        );

      const exisitngLessons = await this.getLessonsOfInstrucorByDay(
        instructorData.instructorId!,
        lessonData.startAndEndTime.endTime
      );
      this.validateOverlapingLessons(lessonData, exisitngLessons);

      return this.lessonRepository.createLesson(lessonData);
    }

    return this.lessonRepository.createLesson(lessonData);
  }

  async getLessonById(lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.getLessonById(lessonId);

    if (!lesson)
      throw new createHttpError.NotFound(
        `Instructor with ID ${lessonId} not found`
      );
    return lesson;
  }

  async getAllLessonsWithinRange(start: Date, end: Date): Promise<Lesson[]> {
    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new createHttpError.BadRequest(
        "Invalid date format. Provide valid start and end dates."
      );
    }
    return this.lessonRepository.getAllLessonsWithinRange(start, end);
  }

  async getLessonsOfInstrucorByDay(
    instructorId: string,
    day: Date
  ): Promise<Lesson[]> {
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

    return filteredLessons;
  }

  async updateLesson(lessonId: string, lessonData: Lesson): Promise<boolean> {
    const lesson = await this.getLessonById(lessonId);

    if (!lesson) {
      throw new createHttpError.NotFound(
        `Lesson with ID ${lessonId} not found`
      );
    }

    this.validateLessonData(lessonData);

    const instructorData: Instructor =
      await this.instructorService.getInstructorById(lessonData.instructorId); // must be valid otherwise it will throw an exception

    if (
      lessonData.specialties.every((specialty) =>
        instructorData.specialties.includes(specialty)
      )
    ) {
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
        !(
          lessonData.startAndEndTime.startTime >= instStartTime &&
          lessonData.startAndEndTime.endTime <= instEndTime
        )
      )
        // if the instructor is not teaching in those time slots
        throw new createHttpError.BadRequest(
          `The Instructor ${
            instructorData.name
          } is available only for ${instStartTime.getHours()}:${instStartTime.getMinutes()} - ${instEndTime.getHours()}:${instEndTime.getMinutes()} on ${
            Object.values(DaysOfWeek)[dayOfTheWeek]
          }`
        );

      const exisitngLessons = await this.getLessonsOfInstrucorByDay(
        instructorData.instructorId!,
        lessonData.startAndEndTime.endTime
      );
      this.validateOverlapingLessons(lessonData, exisitngLessons);
    }

    const updatedLesson: Lesson = {
      instructorId: lessonData.instructorId,
      lessonId,
      specialties: [...lessonData.specialties],
      typeLesson: lessonData.typeLesson,
      startAndEndTime: lessonData.startAndEndTime,
      students: [...lessonData.students],
    };

    return this.lessonRepository.updateLesson(lessonId, updatedLesson);
  }

  async deleteLesson(lessonId: string): Promise<boolean> {
    return this.lessonRepository.deleteLesson(lessonId);
  }

  async deleteAllLessons(): Promise<boolean> {
    return this.lessonRepository.deleteAllLessons();
  }

  validateLessonData = (lessonData: Lesson | NewLesson): void => {
    if (!Object.values(LessonType).includes(lessonData.typeLesson)) {
      throw new createHttpError.BadRequest(
        `Invalid specialty: ${
          lessonData.typeLesson
        }. Must be one of: ${Object.values(Swimming).join(", ")}`
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

    if (lessonData.students.length === 0 || lessonData.students.length > 30) {
      throw new createHttpError.BadRequest(
        "The number of students taking the lesson must be between 1 to 30."
      );
    }
  };

  validateOverlapingLessons = (
    targetLesson: Lesson | NewLesson,
    arrExistingLessons: Lesson[]
  ) => {
    const targetStart = targetLesson.startAndEndTime.startTime.getTime();
    const targetEnd = targetLesson.startAndEndTime.endTime.getTime();

    const violations: boolean[] = []; // Collect all violation messages

    arrExistingLessons.forEach((existingLesson) => {
      const existingStart = existingLesson.startAndEndTime.startTime.getTime();
      const existingEnd = existingLesson.startAndEndTime.endTime.getTime();

      // Check if time ranges overlap
      const isOverlapping =
        targetStart < existingEnd && targetEnd > existingStart;

      if (isOverlapping) {
        // Rule 1: Private lesson cannot overlap another private lesson
        if (
          targetLesson.typeLesson === LessonType.PRIVATE &&
          existingLesson.typeLesson === LessonType.PRIVATE
        ) {
          violations.push(true);
        }

        // Rule 2: Public and Mixed can overlap each other
        if (
          (targetLesson.typeLesson === LessonType.PUBLIC &&
            existingLesson.typeLesson === LessonType.MIXED) ||
          (targetLesson.typeLesson === LessonType.MIXED &&
            existingLesson.typeLesson === LessonType.PUBLIC)
        ) {
          // Overlap allowed, skip to the next check
          return;
        }

        // Rule 3: Private lessons cannot overlap public or mixed lessons unless the existing one is mixed
        if (
          (targetLesson.typeLesson === LessonType.PRIVATE &&
            existingLesson.typeLesson !== LessonType.MIXED) ||
          (existingLesson.typeLesson === LessonType.PRIVATE &&
            targetLesson.typeLesson !== LessonType.MIXED)
        ) {
          violations.push(true);
        }
      }
    });

    // Throw an exception if there are any violations
    if (violations.length > 0) {
      throw new Error(
        `Overlapping lessons detected: \n${violations.join("\n")}`
      );
    }
  };
}
