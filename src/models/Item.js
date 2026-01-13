// Item model to test DB integration

import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

// Collection name will be 'items'
export default mongoose.model("Item", itemSchema);

//Test