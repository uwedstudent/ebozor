const { Router } = require("express");
const { getWishList, AddWish } = require("../models/WishListModel");
const UserMiddleware = require("../middlewares/UserMiddleware");
const { findUserByUsername } = require("../models/UserModel");
const { cartProducts } = require("../models/CartModel");

const router = Router();

router.use(UserMiddleware);

router.get("/", async (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return 0;
  }
  let user = await findUserByUsername(req.user.username);
  let wishlist = await getWishList(user._id);
  const cart = await cartProducts(user._id);
  let isUserExists = req.user ? true : false;

  res.render("wish-list", {
    title: "Sevimlilar Ro'yxati | e-shop.uz",
    path: "/wish-list",
    cart: cart,
    wishlist,
    isUserExists,
  });
});

router.get("/:id", async (req, res) => {
  let user = await findUserByUsername(req.user.username);
  let wish = AddWish(user._id, req.params.id);

  res.redirect("/wish-list");
});

module.exports = {
  path: "/wish-list",
  router: router,
};
