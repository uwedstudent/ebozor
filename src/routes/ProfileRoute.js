const { Router } = require("express");
const UserMiddleware = require("../middlewares/UserMiddleware");
const { findUserByUsername } = require("../models/UserModel");
const { cartProducts } = require("../models/CartModel");
const { getOrders } = require("../models/OrdersModel");
const path = require("path");
const fsOld = require("fs");
const fs = require("fs").promises;
const router = Router();
let FileUpload = require("express-fileupload");

router.use(UserMiddleware);

router.get("/", UserMiddleware, async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  const user = await findUserByUsername(req.user.username);
  const cart = await cartProducts(user._id);
  const orders = await getOrders(user._id);
  let avatarSrc = path.join(
    __dirname,
    "..",
    "public",
    "img",
    "users",
    `${req.user._id}.jpg`
  );
  let isExists = await fsOld.existsSync(avatarSrc);
  let isUserExists = req.user ? true : false;

  res.render("profile", {
    title: "Profile",
    path: "/profile",
    user: user,
    cart: cart,
    orders: orders,
    isExists: isExists,
    isUserExists
  });
});

router.post("/", FileUpload(), async (req, res) => {
  try {
    let avatarSrc = path.join(
      __dirname,
      "..",
      "public",
      "img",
      "users",
      `${req.user._id}.jpg`
    );
    let avatar = await fs.writeFile(
      avatarSrc,
      req.files.photo.data
    );
    res.send({
      ok: true,
    });
  } catch (e) {
    res.send({
      ok: false,
    });
  }
});

module.exports = {
  path: "/profile",
  router: router,
};
