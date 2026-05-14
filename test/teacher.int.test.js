import request from "supertest";
import app from "../src/app.js";

describe("Teacher Create Class", () => {
  it("creates a class for a logged-in teacher", async () => {
    const agent = request.agent(app);

    //Register and log in a teacher to get an authenticated session for testing the create class endpoint.
    await agent
      .post("/api/auth/register-teacher")
      .send({
        name: "Test Teacher",
        email: "teacher@example.com",
        password: "password123",
        teacherCode: "TEACHER2024"
      });

    await agent
      .post("/api/auth/login")
      .send({
        email: "teacher@example.com",
        password: "password123"
      });

    // Create a class using the authenticated session and verify the response contains the expected properties and values.  
    const classCreationRes = await agent
      .post("/api/teacher/create-class")
      .send({
        name: "Test Class"
      });

    console.log(classCreationRes.status, classCreationRes.body);

    expect(classCreationRes.status).toBe(201);
    expect(classCreationRes.body).toHaveProperty("name", "Test Class");
    expect(classCreationRes.body).toHaveProperty("teacher");
    expect(classCreationRes.body).toHaveProperty("classCode");
    expect(classCreationRes.body.classCode).toHaveLength(6);
  });
});