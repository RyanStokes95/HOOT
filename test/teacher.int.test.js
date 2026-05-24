/**
 * Author: Ryan Stokes
 * File: teacher.int.test.js
 * Last Modified: 2026-05-20
 */

import request from "supertest";
import app from "../src/app.js";

describe("Teacher Create Class, Add Subject, Edit Subject, and Delete Subject", () => {
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

    // Teacher API endpoints to test: create class, add subject, edit subject, delete subject.
    const classCreationRes = await agent
      .post("/api/teacher/create-class")
      .send({
        name: "Test Class"
      });

    const subjectAddRes = await agent
      .post("/api/teacher/add-subject")
      .send({
        subject: "Math"
      });

      // Store the subject ID returned from the add subject response to use in the edit and delete tests.
      const subjectId = subjectAddRes.body._id;

      const subjectUpdateRes = await agent
      .put("/api/teacher/edit-subject")
      .send({
        subjectId: subjectId,
        name: "English"
      });

      const deleteSubjectRes = await agent
      .delete("/api/teacher/delete-subject")
      .send({
        subjectId: subjectId
      });

    console.log(classCreationRes.status, classCreationRes.body);
    console.log(subjectAddRes.status, subjectAddRes.body);
    console.log(subjectUpdateRes.status, subjectUpdateRes.body);
    console.log(deleteSubjectRes.status, deleteSubjectRes.body);

    expect(classCreationRes.status).toBe(201);
    expect(classCreationRes.body).toHaveProperty("name", "Test Class");
    expect(classCreationRes.body).toHaveProperty("teacher");
    expect(classCreationRes.body).toHaveProperty("classCode");
    expect(classCreationRes.body.classCode).toHaveLength(6);
    expect(subjectAddRes.status).toBe(200);
    expect(subjectAddRes.body).toHaveProperty("subject", "Math");
    expect(subjectUpdateRes.status).toBe(200);
    expect(subjectUpdateRes.body).toHaveProperty("subject", "English");
    expect(deleteSubjectRes.status).toBe(200);
    expect(deleteSubjectRes.body).toHaveProperty("message", "Subject deleted.");
  });
});