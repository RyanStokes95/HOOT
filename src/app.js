import express from "express";

/*
 - Creates and exports the Express application instance without binding to a port.
 - Used by server.js (runtime) and by tests (Supertest/Jest).
*/

const app = express();

app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

export default app;

