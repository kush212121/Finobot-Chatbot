import mongoose from "mongoose";

const newOrgSchema = mongoose.Schema({
  orgName: { type: String, required: true, min: 6, max: 300 },
  address: { type: String, required: true, min: 0, max: 1000 },
  directorName: { type: String, required: true, min: 6, max: 300 },
  email: { type: String, required: true },
  firstNumber: { type: Number, required: true },
  secondNumber: { type: Number },
  password: { type: String, required: true, min: 6 },
});

export default mongoose.model("NewOrg", newOrgSchema);
