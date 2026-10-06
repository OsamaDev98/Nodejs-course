const express = require("express");
const { validationSchema } = require("../middlewares/validationSchema");

const router = express.Router();

const coursesController = require("../controllers/courses.controller");

// Get all courses
router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(validationSchema(), coursesController.createCourse);

router
  .route("/:courseId")
  .get(coursesController.getSingleCourse)
  .patch(coursesController.updateCourse)
  .delete(coursesController.deleteCourse);

module.exports = router;
