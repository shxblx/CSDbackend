import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  items: [
    {
      firstName: { type: String, required: true, trim: true },
      phone: { type: Number, required: true },
      notes: { type: String, trim: true },
    },
  ],
});

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;
