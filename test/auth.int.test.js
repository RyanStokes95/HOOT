import request from "supertest";
import app from "../src/app.js";

describe("User Login/Registration Integration Test", () => {
    it("Registers a new user", async () => {
        const createRes = await request(app)
            .post("/api/auth/register-parent")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        console.log(createRes.status, createRes.body);

        expect(createRes.status).toBe(201);
        expect(createRes.body).toHaveProperty("message", "Parent registered successfully");
        expect(createRes.body).toHaveProperty("user.name", "Test User");
        expect(createRes.body).toHaveProperty("user.email", "test@example.com");
        expect(createRes.body).toHaveProperty("user.role", "parent");
    });

    it("Logs in a registered user", async () => {
        const createRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        console.log(createRes.status, createRes.body);    

        expect(createRes.status).toBe(200);
        expect(createRes.body).toHaveProperty("message", "Login successful");
        expect(createRes.body).toHaveProperty("user.email", "test@example.com");
        expect(createRes.body).toHaveProperty("user.role", "parent");
    });
});

