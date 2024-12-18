const { Schema, model } = require("mongoose");

const StudentSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: "course", required: true }],
});

const StudentModel = new model("student", StudentSchema);
module.exports = StudentModel;
