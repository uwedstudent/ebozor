const { Router } = require("express");
const Joi = require("joi");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const { addUser } = require("../models/UserModel");
const { generateHash } = require("../modules/hash");
const { generateJWTToken } = require("../modules/jwt");
const router = Router();
const { cartProducts } = require("../models/CartModel");
const { findUserByUsername } = require("../models/UserModel");

const RegistrationValidation = new Joi.object({
  username: Joi.string()
    .required()
    .min(5)
    .max(32)
    .alphanum()
    .error(new Error("Login xato kiritilgan yoki kiritilmagan")),
  password: Joi.string()
    .required()
    .min(6)
    .max(32)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .error(new Error("Mahfiy so'z hato kiritilgan yoki kiritilmagan")),
  email: Joi.string()
    .required()
    .error(
      new Error("Elektron pochta manzili hato kiritilgan yoki kiritilmagan")
    ),
  gender: Joi.string()
    .min(4)
    .max(5)
    .required()
    .error(new Error("Hamma maydonlar to'ldirilgan bo'lishi shart")),
});

router.use(AuthMiddleware);
router.use(async (req, res, next) => {
  if (req.user) {
    res.redirect("/");
    return 0;
  }
  next();
});

router.get("/", async (req, res) => {
  let cart = [];
  let isUserExists = req.user ? true : false;

  res.render("signup", {
    title: "Registratsiya | e-shop.uz",
    path: "/signup",
    cart: cart,
    isUserExists
  });
});

router.post("/", async (req, res) => {
  try {
    const {
      username,
      email,
      gender,
      password,
    } = await RegistrationValidation.validateAsync(req.body);
    let user = await addUser(username, email, gender, generateHash(password));
    console.log(user);
    let token = generateJWTToken({
      _id: user._id,
      username: user.username,
      gender: user.gender,
    });
    res.cookie("token", token).redirect("/");
  } catch (e) {
    console.log(e);
    if (String(e).includes("duplicate key error"))
      e = "Xato: Foydalanuvchi ro'yxatdan o'tgan";
    res.render("signup", {
      title: "Registratsiya | e-shop.uz",
      path: "/signup",
      error: e + "",
    });
  }
});

module.exports = {
  path: "/signup",
  router: router,
};
