const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A blog must have a name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "A blog must have a Lastname"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "A blog must have a username"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "A blog must have a password"],
  },
  email: {
    type: String,
    required: [true, "A blog must have a email"],
  },
  role: {
    type: String,
    enum: {
      values: ["Admin", "Moderator", "Guest"],
      message: "Role is either: Admin, Moderator, Guest",
    },
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
