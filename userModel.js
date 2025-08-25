const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    unique: true 
  },
  password: String,
  role: { 
    type: String, 
    enum: ["admin", "user"], 
    default: "user" 
  },
  Logintype: { 
    type: String, 
    enum: ["admin", "user", "business", "political"], 
    default: "user" 
  }
});

module.exports = mongoose.model("User", UserSchema);
