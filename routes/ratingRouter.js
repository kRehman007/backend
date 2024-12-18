const ratingModel = require("../models/rating-model");
const express = require("express");
const { route } = require("./adminRouter");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { comment, rating, userID, courseID } = req.body;
    await ratingModel.create({
      comment,
      rating,
      created_by: userID,
      course_name: courseID,
    });
    return res
      .status(200)
      .json({ message: "Thnkeew for sharing your thoughts" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.get("/:courseID", async (req, res) => {
  try {
    const { courseID } = req.params;
    const result = await ratingModel
      .find({ course_name: courseID })
      .populate("created_by", "username email");
    const avgRating =
      result.reduce((sum, rating) => sum + rating.rating, 0) / result.length;
    const comments = result?.map((rating) => ({
      text: rating.comment,
      created_by: rating.created_by.username,
    }));

    return res.status(200).json({ avgRating, comments });
  } catch (error) {
    return res.status(500).json({ message: "failed to fetch rating..." });
  }
});

module.exports = router;
