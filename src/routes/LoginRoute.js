const { Router } = require("express");
const { findUser } = require("../models/UserModel");
const { confirmHash } = require("../modules/hash");
const Joi = require("joi");
const AuthMiddleware = require("../middlewares/AuthMiddleware");
const { generateJWTToken } = require("../modules/jwt");
const { GetProducts } = require("../models/CartModel");


const router = Router();

router.use(AuthMiddleware);

const LoginValidation = Joi.object({
  email: Joi.string().required().error(new Error("Login is incorrect")),
  password: Joi.string()
    .required()
    .error(new Error("Password is incorrect"))
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

router.get("/", async (req, res) => {
  console.log("login get")
  res.render("login", {
    title: "Kirish | e-shop.uz",
    path: "/login",
  });
});

router.post("/", async (req, res) => {
  console.log("login post")
  try {
    const { email, password } = await LoginValidation.validateAsync(req.body);
    let user = await findUser(email);
    if (!user) throw new Error("Foydalanuvchi topilmadi");
    let isTrust = await confirmHash(password, user.password);
    if (!isTrust) throw new Error("Parol xato kiritilgan");
    let token = await generateJWTToken({
      _id: user._id,
      username: user.username,
      gender: user.gender,
    });
    res.cookie("token", token).redirect("/");
  } catch (e) {
    let cart = await GetProducts();
    res.render("login", {
      title: "Kirish | e-shop.uz",
      error: e + "",
      path: "/login",
      cart: cart,
    });
  }
});

module.exports = {
  path: "/login",
  router: router,
};
