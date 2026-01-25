import request, { agent } from "supertest";
import app from "../src/app.js";

// Integration test for Parent Registration and Login

// Uses authController.js and User model

// Creates a new user and then logs in with that user to verify authentication functionality.

describe("Parent Auth Flow Integration Test", () => {
    // Register a new user
    it("Registers a new parent, logs the parent in, checks for a session, logs out the parent and checks for no session", async () => {
        const agent = request.agent(app);
        const loginRes = await agent
            .post("/api/auth/register-parent")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });
        
        // Used for debugging    
        console.log(loginRes.status, loginRes.body);
        
        // Expect response status 201 and correct user details being returned
        expect(loginRes.status).toBe(201);
        expect(loginRes.body).toHaveProperty("message", "Parent registered successfully");
        expect(loginRes.body).toHaveProperty("user.name", "Test User");
        expect(loginRes.body).toHaveProperty("user.email", "test@example.com");
        expect(loginRes.body).toHaveProperty("user.role", "parent");

        const registerRes = await agent
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });
        
        // Used for debugging    
        console.log(registerRes.status, registerRes.body);    
        
        // Expect response status 200 and correct user details being returned
        expect(registerRes.status).toBe(200);
        expect(registerRes.body).toHaveProperty("message", "Login successful");
        expect(registerRes.body).toHaveProperty("user.email", "test@example.com");
        expect(registerRes.body).toHaveProperty("user.role", "parent");

        const sessionRes = await agent
            .get("/api/auth/me");

        // Used for debugging
        console.log(sessionRes.status, sessionRes.body);

        // Expect response status 200 and correct user details being returned
        expect(sessionRes.status).toBe(200);
        expect(sessionRes.body).toHaveProperty("user.email", "test@example.com");
        expect(sessionRes.body).toHaveProperty("user.role", "parent");

        const logoutRes = await agent
            .post("/api/auth/logout");

        // Used for debugging
        console.log(logoutRes.status, logoutRes.body);

        // Expect response status 200 and logout message
        expect(logoutRes.status).toBe(200);
        expect(logoutRes.body).toHaveProperty("message", "Logout successful");

        const destroyCheckRes = await agent
            .get("/api/auth/me");

        // Used for debugging
        console.log(destroyCheckRes.status, destroyCheckRes.body);

        // Expect response status 401 Unauthorized after logout
        expect(destroyCheckRes.status).toBe(401);
    });
});

describe("Teacher Auth Flow Integration Test", () => {
    // Register a new teacher
    it("Registers a new teacher, logs the teacher in, checks for a session, logs out the teacher and checks for no session", async () => {
        const agent = request.agent(app);
        const registerRes = await agent
            .post("/api/auth/register-teacher")
            .send({
                name: "Test Teacher",
                email: "teacher@example.com",
                password: "password123",
                teacherCode: "TEACHER2024"
            });

        // Used for debugging
        console.log(registerRes.status, registerRes.body);

        // Expect response status 201 and correct user details being returned
        expect(registerRes.status).toBe(201);
        expect(registerRes.body).toHaveProperty("message", "Teacher registered successfully");
        expect(registerRes.body).toHaveProperty("user.name", "Test Teacher");
        expect(registerRes.body).toHaveProperty("user.email", "teacher@example.com");
        expect(registerRes.body).toHaveProperty("user.role", "teacher");

        const loginRes = await agent
            .post("/api/auth/login")
            .send({
                email: "teacher@example.com",
                password: "password123"
            });

        // Used for debugging
        console.log(loginRes.status, loginRes.body);

        // Expect response status 200 and correct user details being returned
        expect(loginRes.status).toBe(200);
        expect(loginRes.body).toHaveProperty("message", "Login successful");
        expect(loginRes.body).toHaveProperty("user.email", "teacher@example.com");
        expect(loginRes.body).toHaveProperty("user.role", "teacher");

        const sessionRes = await agent
            .get("/api/auth/me");

        // Used for debugging
        console.log(sessionRes.status, sessionRes.body);
        // Expect response status 200 and correct user details being returned
        expect(sessionRes.status).toBe(200);
        expect(sessionRes.body).toHaveProperty("user.email", "teacher@example.com");
        expect(sessionRes.body).toHaveProperty("user.role", "teacher");

        const logoutRes = await agent
            .post("/api/auth/logout");

        // Used for debugging
        console.log(logoutRes.status, logoutRes.body);

        // Expect response status 200 and logout message
        expect(logoutRes.status).toBe(200);
        expect(logoutRes.body).toHaveProperty("message", "Logout successful");

        const checkDestroyRes = await agent
            .get("/api/auth/me");

        // Used for debugging
        console.log(checkDestroyRes.status, checkDestroyRes.body);

        // Expect response status 401 Unauthorized after logout
        expect(checkDestroyRes.status).toBe(401);

    });
});