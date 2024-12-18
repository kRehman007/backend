const express = require("express");
const router = express.Router();
const { handleCourses } = require("../controllers/courseController");

router.get("/", handleCourses);

module.exports = router;
