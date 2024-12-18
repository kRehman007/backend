const courseModel = require("../models/course-model");

const handleCourses = async (req, res) => {
  try {
    const AllCourses = await courseModel.find({});
    const formattedCourses = AllCourses.map((course) => ({
      ...course._doc,
      instructor_image: course.instructor_image
        ? `data:image/jpeg;base64,${course.instructor_image.toString("base64")}`
        : null,
    }));
    if (!AllCourses.length) {
      return res.status(404).json({ msg: "No courses found" });
    }
    return res.status(200).json({ courses: formattedCourses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { handleCourses };
