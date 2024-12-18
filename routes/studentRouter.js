const express = require("express");
const router = express.Router();
const StudentModel = require("../models/student-model");
require("dotenv").config();
const nodemailer = require("nodemailer");
const courseModel = require("../models/course-model");
const mongoose = require("mongoose");
const ratingModel = require("../models/rating-model");
const userModel = require("../models/user-model");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASS,
  },
});

router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, city, country, courseId } = req.body;
    const existinguser = await userModel.findOne({ email });
    if (!existinguser) {
      return res.status(401).json({ message: "Enter valid email" });
    }
    // Check if the student exists by email
    const { course_title } = await courseModel.findOne({ _id: courseId });
    console.log("std", course_title);
    const student = await StudentModel.findOne({ email });

    if (student) {
      // Check if the course is already enrolled
      if (
        !student.subjects.some((subject) => subject.toString() === courseId)
      ) {
        student.subjects.push(courseId); // Add new course to subjects
        await student.save(); // Save updated document
        await sendEnrollmentEmail(fullName, email, course_title);
        return res.status(200).json({
          message: "Course successfully added to your enrollment.",
        });
      } else {
        return res.status(200).json({
          message: "You are already enrolled in this course.",
        });
      }
    } else {
      // Create a new student if not already enrolled
      await StudentModel.create({
        fullName,
        email,
        phone,
        city,
        country,
        subjects: [courseId], // Add course as an array
      });
      await sendEnrollmentEmail(fullName, email, course_title);
      return res
        .status(201)
        .json({ message: "You are successfully enrolled." });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Failed to enroll. Please try again later." });
  }
});

router.get("/total-students", async (req, res) => {
  const total = await StudentModel.find({});
  return res.status(200).json({ total });
});
const sendEnrollmentEmail = async (fullName, email, course_title) => {
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email, // Send email to the enrolled user
    subject: "Enrollment Confirmation",
    text: `Dear ${fullName},\n\nYou have successfully enrolled in the ${course_title} course.\n\nThank you for joining us!\n\nBest regards,\nThe Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Enrollment email sent successfully.");
  } catch (error) {
    console.error("Failed to send enrollment email:", error);
  }
};

router.get("/total/:id", async (req, res) => {
  try {
    const courseId = new mongoose.Types.ObjectId(req.params.id);

    // Fetch all students and populate the subjects
    const students = await StudentModel.find({}).populate("subjects");
    console.log("std", students);
    // Filter the students based on the course ID in their subjects
    const totalStudents = students.filter((student) => {
      return student.subjects.some((subject) => subject._id.equals(courseId)); // Use .equals for ObjectId comparison
    });

    console.log("Total students in the course:", totalStudents.length);
    return res.status(200).json({ totalStudents: totalStudents.length });
  } catch (error) {
    return res.json(500).json({ error: "failed to fetch error" });
  }
});

module.exports = router;
