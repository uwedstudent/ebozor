const bcrypt = require("bcrypt");

function generateHash(password) {
  let salt = bcrypt.genSaltSync(10);
  let crypt = bcrypt.hashSync(password, salt);
  return crypt;
}

function confirmHash(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  generateHash,
  confirmHash,
};
