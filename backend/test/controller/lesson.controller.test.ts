import request from "supertest";
import { connect, disconnect } from "../utils/test-db-utils.js";
import app from "../../src/app.js";
import NewLesson from "../../src/dto/lesson/new-lesson.dto.js";
import Lesson from "../../src/dto/lesson/lesson.dto.js";
import { LessonType } from "../../src/utils/lesson-enum.utils.js";
import { Swimming } from "../../src/utils/swimming-enum.utils.js";
import StartAndEndTime from "../../src/dto/instructor/start-and-end-time.dto.js";
import Student from "../../src/dto/student/student.dto.js";

// Mock data for Instructor and Lesson
const newInstructor = {
  name: "John Doe",
  specialties: ["BACK_STROKE", "CHEST"],
  availabilities: [
    -1,
    -1,
    { startTime: "2025-01-16T09:00:00Z", endTime: "2025-01-16T17:00:00Z" },
    -1,
    -1,
    -1,
    -1,
  ],
};

let instructorId: string;
let newLesson: NewLesson = new NewLesson(
  LessonType.PUBLIC,
  "",
  [Swimming.BACK_STROKE],
  new StartAndEndTime(
    new Date("2025-01-14T10:00:00Z"),
    new Date("2025-01-14T11:00:00Z")
  ),
  [
    {
      name: "Jane Doe",
      preferences: ["BACK_STROKE"],
      phoneNumber: "0502452651",
    } as Student,
  ]
);

describe("Lesson Controller Integration Tests", () => {
  beforeAll(async () => {
    // Add a delay to ensure database operations complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Connect to a test database
    await connect();
  });

  beforeEach(async () => {
    // Create an instructor and set instructorId for the lesson tests
    const response = await request(app).post("/instructor").send(newInstructor);
    expect(response.body).toHaveProperty("instructorId");
    expect(response.body.instructorId).toBeDefined(); // Add verification
    instructorId = response.body.instructorId;
    newLesson.instructorId = instructorId;
  });

  afterEach(async () => {
    //clearing lessons craeation between each test and test
    await request(app).delete("/lesson").expect(200);
    await request(app).delete("/instructor").expect(200);
    newLesson.instructorId = ""; // Clearing the delted instructor
  });

  afterAll(async () => {
    // Disconnect from the test database
    await disconnect();
  });

  it("should create a new lesson", async () => {
    const response = await request(app)
      .post("/lesson")
      .query({ day: 2 })
      .send(newLesson)
      .expect(201);

    const resBody: Lesson = response.body;

    expect(resBody).toHaveProperty("lessonId");
    expect(resBody.typeLesson).toBe(newLesson.typeLesson);
    expect(resBody.specialties).toEqual(newLesson.specialties);
    // Convert string dates to Date objects for comparison
    const receivedStartTime = new Date(resBody.startAndEndTime.startTime);
    const receivedEndTime = new Date(resBody.startAndEndTime.endTime);

    expect(receivedStartTime.toISOString()).toBe(
      newLesson.startAndEndTime.startTime.toISOString()
    );
    expect(receivedEndTime.toISOString()).toBe(
      newLesson.startAndEndTime.endTime.toISOString()
    );

    expect(resBody.students).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Jane Doe",
          preferences: ["BACK_STROKE"],
          phoneNumber: "0502452651",
        }),
      ])
    );
  });

  it("should retrieve a lesson by ID", async () => {
    // Create a lesson to retrieve
    const createResponse = await request(app)
      .post("/lesson")
      .query({ day: 2 })
      .send(newLesson)
      .expect(201);

    expect(createResponse.body).toHaveProperty("lessonId");
    expect(createResponse.body.lessonId).toBeDefined();
    const lessonId = createResponse.body.lessonId;

    const response = await request(app).get(`/lesson/${lessonId}`).expect(200);

    expect(response.body).toHaveProperty("lessonId", lessonId);
    expect(response.body.typeLesson).toBe(newLesson.typeLesson);
    expect(response.body.specialties).toEqual(newLesson.specialties);
  });

  it("should retrieve all lessons within a date range", async () => {
    const response = await request(app)
      .get("/lesson")
      .query({
        start: "2025-01-01T00:00:00Z",
        end: "2025-01-31T23:59:59Z",
      })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((lesson: any) => {
      expect(lesson).toHaveProperty("lessonId");
      expect(
        new Date(lesson.startAndEndTime.startTime) >
          new Date("2025-01-01T00:00:00Z")
      ).toBeTruthy();
      expect(
        new Date(lesson.startAndEndTime.endTime) <
          new Date("2025-01-31T23:59:59Z")
      ).toBeTruthy();
    });
  });

  it("should retrieve lessons for an instructor on a specific day", async () => {
    const response = await request(app)
      .get(`/lesson/instructor/${instructorId}/day`)
      .query({ day: "2025-01-15" })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((lesson: any) => {
      expect(lesson.instructorId).toBe(instructorId);
      expect(new Date(lesson.startAndEndTime.startTime).toDateString()).toBe(
        new Date("2025-01-15").toDateString()
      );
    });
  });

  it("should update a lesson by ID", async () => {
    // Create a lesson to update
    const createResponse = await request(app)
      .post("/lesson")
      .query({ day: 2 })
      .send(newLesson)
      .expect(201);

    const createdLesson: Lesson = createResponse.body;
    const lessonId = createResponse.body.lessonId;

    const updatedLesson: Lesson = new Lesson(
      lessonId,
      createdLesson.typeLesson,
      createdLesson.specialties,
      createdLesson.instructorId,
      createdLesson.startAndEndTime,
      [
        ...createdLesson.students,
        {
          name: "John Smith",
          preferences: ["BACK_STROKE"] as Swimming[],
          phoneNumber: "0502452743",
        },
      ]
    );

    const response = await request(app)
      .put(`/lesson/${lessonId}`)
      .send(updatedLesson)
      .expect(200);

    expect(response.body).toHaveProperty("lessonId", lessonId);
    expect(response.body.typeLesson).toBe("PUBLIC");
    expect(response.body.students).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "John Smith" })])
    );
  });

  it("should delete a lesson by ID", async () => {
    // Create a lesson to delete
    const createResponse = await request(app)
      .post("/lesson")
      .query({ day: 2 })
      .send(newLesson)
      .expect(201);

    expect(createResponse.body).toHaveProperty("lessonId");
    expect(createResponse.body.lessonId).toBeDefined();
    const lessonId = createResponse.body.lessonId;

    const deleteResponse = await request(app)
      .delete(`/lesson/${lessonId}`)
      .expect(200);

    expect(deleteResponse.body.message).toBe("Lesson deleted successfully");
  });

  it("should delete all lessons", async () => {
    const response = await request(app).delete("/lesson").expect(200);
    expect(response.body.message).toBe("All lessons deleted successfully");
  });
});
