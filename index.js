const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const port = process.env.PORT;
const url = process.env.MONGO_URL;
const { HTTP_STATUS } = require("./utils/appConstant");

mongoose.connect(url).then(() => {
  console.log("Mongodb server started!");
});

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from the "uploads" directory

const coursesRoutes = require("./routes/courses.routes");
const usersRoutes = require("./routes/users.routes");

// Use the courses routes for all requests starting with "/"
app.use("/api/courses", coursesRoutes);

// Use the users routes for all requests starting with "/"
app.use("/api/users", usersRoutes);

app.all("/*splat", (req, res, next) => {
  res
    .status(404)
    .json({ status: HTTP_STATUS.FAIL, message: "This resource is not found." });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: HTTP_STATUS.ERROR,
    message: err.message,
    code: err.statusCode,
    statusText: err.statusText,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
