const { Router } = require("express");
const UserMiddleware = require("../middlewares/UserMiddleware");
const {
  GetProducts,
  AddProduct,
  cartProducts,
  updateCart,
  deleteProduct,
} = require("../models/CartModel");
const { getProduct } = require("../models/ProductModel");
const { findUser, findUserByUsername } = require("../models/UserModel");

const router = Router();

router.use(UserMiddleware);

router.get("/", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  const user = await findUserByUsername(req.user.username);
  const products = await cartProducts(user._id);
  let isUserExists = req.user ? true : false;

  res.render("cart", {
    title: "Savatcha",
    path: "/cart",
    products: products,
    cart: products,
    isUserExists
  });
});

router.get("/:categoryName", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  if (req.params.categoryName === "delete") {
    let { product_id, user_id } = req.query;
    let product = await deleteProduct(user_id, product_id);
    res.redirect("/cart");
    return 0;
  }
  const { product_id } = req.query;
  const { categoryName } = req.params;
  let product = await getProduct(product_id);
  await AddProduct(product_id, req.user._id);
  res.redirect(`/shop/${categoryName}`);
});

router.post("/update", async (req, res) => {
  try {
    const user = await findUserByUsername(req.user.username);

    req.body.forEach(async (el) => {
      let cart = await updateCart(user._id, el.id, el.count);
    });
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
  path: "/cart",
  router: router,
};
