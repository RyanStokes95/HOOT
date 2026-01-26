/**
 * Author: Ryan Stokes
 * File: items.js
 * Last Modified: 2026-01-25
 */

import { Router } from "express";
import Item from "../models/Item.js";

const router = Router();

//Item test routes to create item then find the item

router.post("/", async (req, res) => {
  const item = await Item.create({ name: req.body.name });
  res.status(201).json(item);
});

router.get("/", async (_req, res) => {
  const items = await Item.find();
  res.json(items);
});

export default router;
