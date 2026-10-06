const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const userAllowed = require("../middlewares/userAllowed");
const { USER_ROLE } = require("../utils/appConstant");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `user-${req.body.firstName}-${Date.now()}` + "-" + file.originalname,
    );
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files are allowed!"), false);
    }
  },
});

const {
  getAllUsers,
  registerUser,
  loginUser,
  removeUser,
} = require("../controllers/users.controller");
const AppError = require("../utils/appError");

router.route("/").get(verifyToken, getAllUsers);
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router
  .route("/:id")
  .delete(
    verifyToken,
    userAllowed([USER_ROLE.ADMIN, USER_ROLE.MANAGER]),
    removeUser,
  );

module.exports = router;
