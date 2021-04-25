const { Router, response } = require("express");
const { getProducts, Products } = require("../models/ProductModel");
const { cartProducts } = require("../models/CartModel");
const UserMiddleware = require("../middlewares/UserMiddleware");
const { findUserByUsername } = require("../models/UserModel");
const { getAllComments } = require("../models/CommentModel")

const router = Router()

router.use(UserMiddleware);

router.get("/:category", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  let pageSize;
  let currentPage;
  if (!(req.query.currentPage && req.query.pageSize)) {
    currentPage = 1;
    pageSize = 4;
  } else {
    pageSize = req.query.pageSize;
    currentPage = req.query.currentPage;
  }

  pageSize -= 0;
  currentPage -= 0;
  let products = await getProducts(pageSize, currentPage, req.params.category);
  let nextPage = req.currentPage + 1;
  let prevPage = req.currentPage - 1;
  let cPage = currentPage;
  let allProducts = await Products(req.params.category);
  let pageCount;
  if (allProducts.length % pageSize !== 0) {
    pageCount = Math.floor(allProducts.length / pageSize) + 1;
  } else {
    pageCount = Math.floor(allProducts.length / pageSize);
  }

  let user = await findUserByUsername(req.user.username);
  let cart = await cartProducts(user._id);

  let isUserExists = req.user ? true : false;

  let comments = await getAllComments();
  console.log(comments)
  res.render("shop", {
    products: products,
    path: "/shop",
    title: "e-shop | Do'kon",
    nextPage,
    prevPage,
    cPage,
    pageCount,
    categoryName: req.params.category,
    pageSize: pageSize,
    cart: cart,
    comments,
    isUserExists
  });
});

module.exports = {
  path: "/shop",
  router: router,
};
