import express from "express";
import itemsRouter from "./routes/items.js";

/*
 - Creates and exports the Express application instance without binding to a port.
 - Used by server.js (runtime) and by tests (Supertest/Jest).
*/

const app = express();

// Middleware
// Needed to parse JSON bodies
app.use(express.json());

// Routes mounted on express app
// Infrastructure testing endpoint

app.get("/", (req, res) => res.status(200).json({ status: "running" }));

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

//API endpoints

app.use("/api/items", itemsRouter);

export default app;

