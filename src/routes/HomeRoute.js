const { Router } = require("express");
const UserMiddleware = require("../middlewares/UserMiddleware");
const { cartProducts } = require("../models/CartModel");
const { GetCategories } = require("../models/CategoryModel");
const { findUserByUsername } = require("../models/UserModel");
const { verifyJWTTOken } = require("../modules/jwt");

const router = Router();

router.use(UserMiddleware);

router.get("/", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  let user = await findUserByUsername(req.user.username);
  const cart = await cartProducts(user._id);
  let isUserExists = req.user ? true : false;
  const categories = await GetCategories();
  res.render("index", {
    title: "eShop | Do'kon",
    path: "/",
    categories: categories,
    cart: cart,
    isUserExists
  });
});

module.exports = {
  path: "/",
  router: router,
};
