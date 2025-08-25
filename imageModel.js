const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  path: String,
  frame: String,
  logo_placement: String,
  text: String
});

module.exports = mongoose.model("Image", ImageSchema);
