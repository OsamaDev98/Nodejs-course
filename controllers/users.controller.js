const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const { HTTP_STATUS } = require("../utils/appConstant");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");
const saltRounds = 10;

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const { limit, page } = req.query;
  const options = {
    // limit: parseInt(limit) || 4,
    limit: parseInt(limit),
    // page: parseInt(page) || 1,
    page: parseInt(page),
    skip: (parseInt(page) - 1) * parseInt(limit),
  };

  const users = await User.find({}, { __v: 0, password: 0 })
    .limit(options.limit)
    .skip(options.skip);

  res.json({ status: HTTP_STATUS.SUCCESS, data: users });
});

const registerUser = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role, avatar } = req.body;

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = new AppError("User already exists", 400, HTTP_STATUS.FAIL);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    firstName,
    lastName,
    email,
    role,
    password: hashedPassword,
    avatar: req.file ? req.file.path : undefined,
  });

  const token = generateJWT({
    userId: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });

  await newUser.save();

  res.status(201).json({
    status: HTTP_STATUS.SUCCESS,
    data: { user: newUser, token },
  });
});

const loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new AppError(
      "Email and password are required",
      400,
      HTTP_STATUS.FAIL,
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new AppError("User not found", 401, HTTP_STATUS.FAIL);
    return next(error);
  }
  const isPasswordValid = user
    ? await bcrypt.compare(password, user.password)
    : false;

  const token = generateJWT({
    userId: user._id,
    email: user.email,
    role: user.role,
  });
  isPasswordValid
    ? res.json({ status: HTTP_STATUS.SUCCESS, data: { user, token } })
    : next(new AppError("Invalid email or password", 401, HTTP_STATUS.FAIL));
});

const removeUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    const error = new AppError("User ID is required", 400, HTTP_STATUS.FAIL);
    return next(error);
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const error = new AppError("User not found", 404, HTTP_STATUS.FAIL);
    return next(error);
  }
  res.json({
    status: HTTP_STATUS.SUCCESS,
    message: "User deleted successfully",
  });
});

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  removeUser,
};
