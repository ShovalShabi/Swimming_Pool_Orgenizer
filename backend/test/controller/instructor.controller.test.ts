import request from "supertest";
import { connect, disconnect } from "../utils/test-db-utils.js";
import app from "../../src/app.js";

// Mock data
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

describe("Instructor Controller Integration Tests", () => {
  beforeAll(async () => {
    // Connect to a test database
    await connect();
  });

  afterAll(async () => {
    // Disconnect from the test database
    await disconnect();
  });

  it("should create a new instructor", async () => {
    const response = await request(app)
      .post("/instructor")
      .send(newInstructor)
      .expect(201);

    expect(response.body).toHaveProperty("instructorId");
    expect(response.body.name).toBe(newInstructor.name);
    expect(response.body.specialties).toEqual(newInstructor.specialties);
  });

  it("should retrieve all instructors", async () => {
    const response = await request(app).get("/instructor").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should retrieve instructors by specialties", async () => {
    const response = await request(app)
      .get("/instructor/specialties")
      .query({ specialties: ["BACK_STROKE"] })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((instructor: any) => {
      expect(instructor.specialties).toContain("BACK_STROKE");
    });
  });

  it("should retrieve instructors by availability", async () => {
    const response = await request(app)
      .get("/instructor/availability")
      .query({
        day: 2,
        startTime: "2025-01-16T09:00:00Z",
        endTime: "2025-01-16T17:00:00Z",
      })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((instructor: any) => {
      expect(instructor.availabilities[2]).toHaveProperty("startTime");
      expect(instructor.availabilities[2]).toHaveProperty("endTime");
    });
  });

  it("should delete an instructor by ID", async () => {
    // Create an instructor to delete
    const createResponse = await request(app)
      .post("/instructor")
      .send(newInstructor);
    const instructorId = createResponse.body.instructorId;

    const deleteResponse = await request(app)
      .delete(`/instructor/${instructorId}`)
      .expect(200);

    expect(deleteResponse.body.message).toBe("Instructor deleted successfully");
  });

  it("should delete all instructors", async () => {
    const response = await request(app).delete("/instructor").expect(200);
    expect(response.body.message).toBe("All instructors deleted successfully");
  });
});
