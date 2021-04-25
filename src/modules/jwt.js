const { sign, verify } = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const SECRET_WORD = process.env.SECRET_WORD;

function generateJWTToken(data) {
  return sign(data, SECRET_WORD);
}

function verifyJWTTOken(token) {
  try {
    return verify(token, SECRET_WORD);
  } catch (e) {
    return false;
  }
}

module.exports = {
  generateJWTToken,
  verifyJWTTOken,
};
