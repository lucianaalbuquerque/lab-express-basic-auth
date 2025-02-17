const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: String
});

const User = model("User", userSchema);

module.exports = User;
