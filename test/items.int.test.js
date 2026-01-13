import request from "supertest";
import app from "../src/app.js";

describe("Items API (Mongo integration)", () => {
  it("creates and retrieves an item", async () => {
    const createRes = await request(app)
      .post("/api/items")
      .send({ name: "Sample Item" });

    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe("Sample Item");

    const listRes = await request(app).get("/api/items");
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].name).toBe("Sample Item");
  });
});
