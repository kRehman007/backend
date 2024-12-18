const { model, Schema } = require("mongoose");

const ratingSchema = new Schema({
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  created_by: { type: Schema.Types.ObjectId, ref: "user", required: true },
  course_name: { type: Schema.Types.ObjectId, ref: "course", required: true },
});

const ratingModel = new model("rating", ratingSchema);
module.exports = ratingModel;
