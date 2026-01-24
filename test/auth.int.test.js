import request from "supertest";
import app from "../src/app.js";

// Integration test for Parent Registration and Login

// Uses authController.js and User model

// Creates a new user and then logs in with that user to verify authentication functionality.

describe("Parent Login/Registration Integration Test", () => {
    // Register a new user
    it("Registers a new user", async () => {
        const createRes = await request(app)
            .post("/api/auth/register-parent")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });
        
        // Used for debugging    
        console.log(createRes.status, createRes.body);
        
        // Expect response status 201 and correct user details being returned
        expect(createRes.status).toBe(201);
        expect(createRes.body).toHaveProperty("message", "Parent registered successfully");
        expect(createRes.body).toHaveProperty("user.name", "Test User");
        expect(createRes.body).toHaveProperty("user.email", "test@example.com");
        expect(createRes.body).toHaveProperty("user.role", "parent");
    });

    // Log in with the registered user
    it("Logs in a registered user", async () => {
        const createRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });
        
        // Used for debugging    
        console.log(createRes.status, createRes.body);    
        
        // Expect response status 200 and correct user details being returned
        expect(createRes.status).toBe(200);
        expect(createRes.body).toHaveProperty("message", "Login successful");
        expect(createRes.body).toHaveProperty("user.email", "test@example.com");
        expect(createRes.body).toHaveProperty("user.role", "parent");
    });
});

describe("Teacher Login/Registration Integration Test", () => {
    // Register a new teacher
    it("Registers a new teacher", async () => {
        const createRes = await request(app)
            .post("/api/auth/register-teacher")
            .send({
                name: "Test Teacher",
                email: "teacher@example.com",
                password: "password123",
                teacherCode: "TEACHER2024"
            });

        // Used for debugging
        console.log(createRes.status, createRes.body);

        // Expect response status 201 and correct user details being returned
        expect(createRes.status).toBe(201);
        expect(createRes.body).toHaveProperty("message", "Teacher registered successfully");
        expect(createRes.body).toHaveProperty("user.name", "Test Teacher");
        expect(createRes.body).toHaveProperty("user.email", "teacher@example.com");
        expect(createRes.body).toHaveProperty("user.role", "teacher");
    });

    // Log in with the registered teacher
    it("Logs in a registered teacher", async () => {
        const createRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "teacher@example.com",
                password: "password123"
            });

        // Used for debugging
        console.log(createRes.status, createRes.body);

        // Expect response status 200 and correct user details being returned
        expect(createRes.status).toBe(200);
        expect(createRes.body).toHaveProperty("message", "Login successful");
        expect(createRes.body).toHaveProperty("user.email", "teacher@example.com");
        expect(createRes.body).toHaveProperty("user.role", "teacher");
    });
});