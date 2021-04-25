const { Schema } = require("mongoose");
const client = require("../modules/mongo");

const UserSchema = new Schema({
  email: {
    required: true,
    unique: true,
    type: String,
    index: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

async function UserModel() {
  let db = await client();
  return await db.model("users", UserSchema);
}

async function addUser(username, email, gender, password) {
  let db = await UserModel();
  return await db.create({
    username,
    email,
    gender,
    password,
  });
}

async function findUser(login) {
  let db = await UserModel();
  let obj = { email: login };
  let user = await db.findOne(obj);
  return user;
}

async function findUserByUsername(username) {
  let db = await UserModel();
  return await db.findOne({ username: username });
}

async function getAllUsers() {
  let db = await UserModel();
  return await db.find()
}

module.exports = {
  addUser,
  findUser,
  findUserByUsername,
  getAllUsers
};
