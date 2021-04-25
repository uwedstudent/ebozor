const { verifyJWTTOken } = require("../modules/jwt");

module.exports = async function (req, res, next) {
  let token = req.cookies?.token;
  token = verifyJWTTOken(token);
  console.log(token, "auth");
  if (token) {
    req.user = token;
  }
  next();
};
