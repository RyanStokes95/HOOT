import request from "supertest";
import app from "../src/app.js";

/* 
  Integration test for Items API
  
  Uses items.js and item.js

  Creates a sample item and retrieves it to verify MongoDB integration and API functionality.
*/


describe("Items API (Mongo integration)", () => {
  // Create the test item and send to DB
  it("creates and retrieves an item", async () => {
    // Supertest request to create an item
    const createRes = await request(app)
      .post("/api/items")
      .send({ name: "Sample Item" });

    // Used for debugging  
    console.log(createRes.status, createRes.body);  
    
    // Expect response status 201 and correct name being returned  
    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe("Sample Item");

    // Retrieve the list of items
    const listRes = await request(app).get("/api/items");
    // Expect response status 200 and one item with correct name
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].name).toBe("Sample Item");
  });
});
