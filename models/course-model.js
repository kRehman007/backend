const { Schema, model } = require("mongoose");

const CourseSchema = new Schema({
  instructor_name: String,
  instructor_bio: String,
  course_title: String,
  course_sub_title: String,
  course_price: Number,
  course_desc: String,
  course_category: String,
  instructor_image: Buffer,
  highlights: [String],
  faqs: [
    {
      question: String,
      answer: String,
    },
  ],
});

const courseModel = new model("course", CourseSchema);

module.exports = courseModel;
