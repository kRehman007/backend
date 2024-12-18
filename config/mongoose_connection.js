require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Mongo_DB Connected"))
  .catch((error) => console.log("Connection error", error));

module.exports = mongoose.connection;
