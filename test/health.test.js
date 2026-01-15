import request from "supertest";
import app from "../src/app.js";

/*
 - Health check integration test.
 - Verifies the Express app responds correctly without opening a network port
*/

//Describe used for grouping related tests
//Describe,it and expect are jest functions

describe("GET /health", () => {
  it("returns 200 and ok=true", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});

