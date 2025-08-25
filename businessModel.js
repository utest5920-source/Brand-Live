const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  name: String,
  address: String,
  political_details: String
});

module.exports = mongoose.model("Business", BusinessSchema);
