const { validationResult } = require("express-validator");
const course = require("../models/course.model");
const { HTTP_STATUS } = require("../utils/appConstant");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res, next) => {
  const { limit, page } = req.query;
  const skip = (page - 1) * limit;
  const courses = await course
    .find({}, { __v: 0 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));
  res.json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      courses,
    },
  });
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const requiredCourse = await course.findById({ _id: courseId });
  if (!requiredCourse) {
    const error = new AppError("Course not found", 404, HTTP_STATUS.FAIL);
    return next(error);
  }
  return res.json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      course: requiredCourse,
    },
  });
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const { title, price } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError("Invalid input data", 400, HTTP_STATUS.FAIL);
    return next(error);
  }
  const newCourse = new course({ title: title, price: price });
  await newCourse.save();
  res.status(201).json({ status: HTTP_STATUS.SUCCESS, data: { newCourse } });
});

const updateCourse = asyncWrapper(async (req, res, next) => {
  const { title, price } = req.body;
  const courseId = req.params.courseId;
  const updatedCourse = await course.findByIdAndUpdate(
    { _id: courseId },
    { $set: { title: title, price: price } },
  );
  if (!updatedCourse) {
    const error = new AppError("Course not found", 404, HTTP_STATUS.FAIL);
    return next(error);
  }

  res.json({
    status: HTTP_STATUS.SUCCESS,
    data: { updatedCourse: updatedCourse },
  });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const deletedCourse = await course.deleteOne({ _id: courseId });
  if (!deletedCourse) {
    const error = new AppError("Course not found", 404, HTTP_STATUS.FAIL);
    return next(error);
  }
  res.json({ status: HTTP_STATUS.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
