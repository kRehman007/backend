const courseModel = require("../models/course-model");
const upload = require("../config/multer_config");

const adminForm = async (req, res) => {
  console.log(req.body);
  const {
    name,
    bio,
    title,
    subtitle,
    price,
    description,
    category,
    faqs,
    highlights,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "File is required" });
  }

  try {
    await courseModel.create({
      instructor_name: name,
      instructor_bio: bio,
      course_title: title,
      course_sub_title: subtitle,
      course_desc: description,
      course_price: Number(price),
      course_category: category,
      instructor_image: req.file.buffer,
      highlights: JSON.parse(highlights),
      faqs: JSON.parse(faqs),
    });
    return res.status(201).json({ message: "Course added successfully" });
  } catch (error) {
    console.log("Error in course adding", error);
    return res.status(500).json({ message: "Failed to add course" });
  }
};

module.exports = {
  adminForm,
};
