const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  orgName: { type: String, required: true, min: 6 },
  startDate: { type: Date, default: Date.now },
  password: { type: String, required: true, max: 1024, min: 6 },
});

module.exports = mongoose.model("Org", orgSchema);

//name, address, company reg no(hq ), name of the director, first contact, second contact, email,
