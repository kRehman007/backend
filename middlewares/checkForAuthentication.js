const { ValidateToken } = require("../utils/createAndValidateToken");

function checkForAuthentication(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return res.status(401).json({ msg: "Authentication token required" });
    }

    try {
      const payload = ValidateToken(tokenCookieValue);
      req.user = payload;
    } catch (error) {
      console.log("token authentication failed");
      return res.status(500).json({ msg: `${error}` });
    }

    next();
  };
}

module.exports = {
  checkForAuthentication,
};
