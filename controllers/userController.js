const { none } = require("../config/multer_config");
const userModel = require("../models/user-model");

const userSignUp = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    const createdUser = await userModel.create({
      fullname,
      username,
      email,
      password,
      role:
        email === "kashisial2327@gmail.com" && password === "123456"
          ? "admin"
          : "user",
    });
    res.status(201).json({ message: "You are  successfully signed up..." });
  } catch (error) {
    console.log("Error in signingup...", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    }
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
    res.status(201).json({
      user,
      message: "you are successfully logged in",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: `${error}` });
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
