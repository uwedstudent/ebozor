const { Router } = require("express");
const { cartProducts } = require("../models/CartModel");
const { findUserByUsername } = require("../models/UserModel");
const UserMiddleware = require("../middlewares/UserMiddleware");
const { getProduct } = require("../models/ProductModel");
const { newComment, getComments } = require("../models/CommentModel");

const fsOld = require("fs");
const path = require("path");

const router = Router();

router.use(UserMiddleware);

router.get("/:id", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  const user = await findUserByUsername(req.user.username);
  const cart = await cartProducts(user._id);
  const product = await getProduct(req.params.id);
  const comments = await getComments(req.params.id);

  let averageRate = 0;

  comments.forEach((comment) => {
    averageRate += comment.mark;
  });

  averageRate = Math.floor(averageRate / comments.length);

  let isUserExists = req.user ? true : false;
  let photoPath = path.join(__dirname, "..", "public", "img", "admin", "product", `${req.params.id}.jpg`)
  let hasProductPhoto = fsOld.existsSync(photoPath);
console.log(hasProductPhoto)
  res.render("shop-details", {
    title: "e-shop | Mahsulot",
    path: "/shop-details",
    cart: cart,
    product: product,
    comments: comments,
    averageRate,
    isUserExists,
    hasProductPhoto
  });
});

router.post("/:id", async (req, res) => {
  try {
    const product_id = req.params.id;
    const { name, email, mark, reviewTitle, reviewBody } = req.body;
    let comment = await newComment(
      name,
      email,
      mark,
      reviewTitle,
      reviewBody,
      product_id
    );
    res.redirect(`/shop-details/${product_id}`);
  } catch (e) {
    console.log(e);
    const comments = await getComments(req.params.id);

    let averageRate = 0;

    comments.forEach((comment) => {
      averageRate += comment.mark;
    });

    averageRate = Math.floor(averageRate / comments.length);

    const user = await findUserByUsername(req.user.username);
    const cart = await cartProducts(user._id);
    const product = await getProduct(req.params.id);
    res.render("shop-details", {
      title: "e-shop | Mahsulot",
      path: "/shop-details",
      error: e + "",
      cart: cart,
      product: product,
      comments,
      averageRate,
    });
  }
});

module.exports = {
  path: "/shop-details",
  router: router,
};
