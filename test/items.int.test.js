import request from "supertest";
import app from "../src/app.js";

/* 
  Integration test for Items API
  
  Uses items.js and item.js

  Creates a sample item and retrieves it to verify MongoDB integration and API functionality.
*/


describe("Items API (Mongo integration)", () => {
  // Create
  it("creates and retrieves an item", async () => {
    const createRes = await request(app)
      .post("/api/items")
      .send({ name: "Sample Item" });

    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe("Sample Item");

    // Retrieve
    const listRes = await request(app).get("/api/items");
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].name).toBe("Sample Item");
  });
});
