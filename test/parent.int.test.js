import request from "supertest";
import app from "../src/app.js";

describe("Teacher Create Class", () => {
  it("creates a class for a logged-in teacher", async () => {
    const teacherAgent = request.agent(app);
    const parentAgent = request.agent(app);

    //Register and log in a teacher to get an authenticated session for testing the create class endpoint.
    await teacherAgent
      .post("/api/auth/register-teacher")
      .send({
        name: "Test Teacher",
        email: "teacher@example.com",
        password: "password123",
        teacherCode: "TEACHER2024"
      });

    await teacherAgent
      .post("/api/auth/login")
      .send({
        email: "teacher@example.com",
        password: "password123"
      });

    // Create a class using the authenticated session and verify the response contains the expected properties and values.  
    const classResponse = await teacherAgent
      .post("/api/teacher/create-class")
      .send({
        name: "Test Class"
      });

    const classCode = classResponse.body.classCode;
        
    await parentAgent
      .post("/api/auth/register-parent")
      .send({
        name: "Test Parent",
        email: "parent@example.com",
        password: "password123"
      });

    await parentAgent
      .post("/api/auth/login")
      .send({
        email: "parent@example.com",
        password: "password123"
      });

    const joinResponse = await parentAgent
      .post("/api/parent/join-class")
      .send({
        classCode: classCode,
        name: "Test Student"
      });

    console.log(joinResponse.status, joinResponse.body);
    console.log(classResponse.status, classResponse.body);

    expect(joinResponse.status).toBe(200);
    expect(joinResponse.body).toHaveProperty("message", "Successfully joined class.");
  });  
});