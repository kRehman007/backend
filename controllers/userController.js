require("dotenv").config();
require("../config/multer_config");
const userModel = require("../models/user-model");

const userSignUp = async (req, res) => {
  const { fullname, username, email, password } = req.body;
  console.log(email === process.env.ADMIN_EMAIL);
  console.log("email", email);
  console.log(process.env.ADMIN_EMAIL);

  try {
    await userModel.create({
      fullname,
      username,
      email,
      password,
      role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
    });
    res.status(201).json({ message: "You are  successfully signed up..." });
  } catch (error) {
    console.log("Error in signingup...", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

const userLogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await userModel.matchPasswordAndGenerateToken(
      email,
      password
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const userData = await userModel.findOne({ email });
    let user = {
      fullname: userData.fullname,
      username: userData.username,
      role: userData.role,
      email: userData.email,
    };
    res.status(200).json({
      user,
      message: "you are successfully logged in",
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid email or password." });
  }
};

const userLogOut = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "You logged out Successfullu" });
  } catch (error) {
    res.status(500).json({ erorr: "Failed to logout" });
  }
};
module.exports = {
  userSignUp,
  userLogIn,
  userLogOut,
};
