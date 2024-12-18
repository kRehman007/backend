const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function createTokenForUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
    fullname: user.fullname,
    username: user.username,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function ValidateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  ValidateToken,
};
