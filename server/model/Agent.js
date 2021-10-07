import mongoose from "mongoose";

const agentSchema = mongoose.Schema({
  name: { type: String, required: true, min: 0, max: 300 },
  email: { type: String, required: true },
  password: { type: String, required: true, min: 6 },
  orgId: { type: String, required: true },
});

export default mongoose.model("Agent", agentSchema);
