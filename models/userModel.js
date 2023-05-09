const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "A user must have a lastname"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "A user must have a username"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 5,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not the same",
    },
  },

  email: {
    type: String,
    required: [true, "Please provide a valid email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: {
      values: ["User", "Admin", "Moderator", "Guest"],
      message: "Role is either: Admin, Moderator, Guest",
      default: "User",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
