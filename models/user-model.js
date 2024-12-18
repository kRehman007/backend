const { Schema, model } = require("mongoose");
const crypto = require("crypto");
const { createTokenForUser } = require("../utils/createAndValidateToken");

const userSchema = new Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  salt: String,
  password: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  const salt = crypto.randomBytes(16).toString("hex");
  const hashPassword = crypto
    .createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    console.log("user", user);
    if (!user) throw new Error("user not found");

    const userProvidedHash = crypto
      .createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");
    if (userProvidedHash !== user.password) {
      throw new Error("Incorrect password");
    }
    const token = createTokenForUser(user);
    return token;
  }
);

const userModel = new model("user", userSchema);
module.exports = userModel;
