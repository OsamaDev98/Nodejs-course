const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { USER_ROLE } = require("../utils/appConstant");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: [3, "First name must be at least 3 characters long"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: [3, "Last name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: isEmail,
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.MANAGER],
    default: USER_ROLE.USER,
  },
  avatar: {
    type: String,
    default: "uploads/profile.jpg",
  },
});

module.exports = mongoose.model("user", userSchema);
