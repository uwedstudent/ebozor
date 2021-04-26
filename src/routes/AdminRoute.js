const { Router } = require("express");
const fs = require("fs").promises;
const fsOld = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
const UserMiddleware = require("../middlewares/UserMiddleware");
const {
  CreateCategory,
  UpdateCategory,
  GetCategories,
  DeleteCategory,
} = require("../models/CategoryModel");
const {
  allProducts,
  addProduct,
  updateProduct,
} = require("../models/ProductModel");
const { cartProducts } = require("../models/CartModel");
const { findUserByUsername, getAllUsers } = require("../models/UserModel");

const {getAllOrders} = require("../models/OrdersModel");

const router = Router();

router.use(UserMiddleware);

router.use((req, res, next) => {
  if (req.user.username !== "admin") {
    res.redirect("/");
    return 0;
  }
  next();
});

router.get("/", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  let user = await findUserByUsername(req.user.username);
  let cart = await cartProducts(user._id);
  let isUserExists = req.user ? true : false;

  res.render("admin", {
    title: "Admin",
    path: "/admin",
    cart: cart,
    isUserExists
  });
});

router.get("/category", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  let categories = await GetCategories();
  
  let user = await findUserByUsername(req.user.username);
  let cart = await cartProducts(user._id);
  let isUserExists = req.user ? true : false;

  res.render("category_admin", {
    title: "Categories | Admin",
    path: "/admin",
    categories: categories,
    cart: cart,
    isUserExists
  });
});

router.post("/category", async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) throw new Error("Kategoriya nomi to'ldirilishi shart");
    let category = await CreateCategory(categoryName);
    res.redirect("/admin/category");
  } catch (e) {
    console.log(e + "");
  }
});

router.get("/category/:name", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  let category = await DeleteCategory(req.params.name);
  
  res.redirect("/admin/category");
});

router.post("/category/photo/:name", fileUpload(), async (req, res) => {
  try {
    let { name } = req.params;
    name = name.replace("categoryPhoto", "");
    const data = req.files.photo.data;
    let photoPath = path.join(
      __dirname,
      "..",
      "public",
      "img",
      "admin",
      "category",
      `${name}.jpg`
    );
    let file = await fs.writeFile(photoPath, data);
    let category = await UpdateCategory(name);
    res.send({
      ok: true,
    });
  } catch (e) {
    res.send({
      ok: false,
    });
  }
});

// product

router.get("/product", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  let categories = await GetCategories();
  let products = await allProducts();
  let isUserExists = req.user ? true : false;
  
  let user = await findUserByUsername(req.user.username);
  let cart = await cartProducts(user._id);

  res.render("product_admin", {
    title: "Products | Admin",
    path: "/admin",
    products: products,
    categories: categories,
    cart: cart,
    isUserExists
  });
});

router.post("/product", async (req, res) => {
  try {
    const {
      productName,
      productBrand,
      oldPrice,
      salePrice,
      category,
      description,
    } = req.body;
    if (!(productName && productBrand && oldPrice && category && description)) {
      throw new Error("Barcha maydonlar to'ldirilgan bo'lishi shart");
    }
    let product = await addProduct(
      productBrand,
      productName,
      category,
      oldPrice,
      salePrice,
      description
    );
    res.redirect("/admin/product");
  } catch (e) {
    let products = await allProducts();
    let cart = await cartProducts();

    if (String(e).includes("duplicate key error"))
      e = "Xato: Foydalanuvchi ro'yxatdan o'tgan";
    res.render("product_admin", {
      title: "Products | Admin",
      path: "/admin",
      products: products,
      error: e + "",
    });
  }
});

router.post("/product/photo/:id", fileUpload(), async (req, res) => {
  try {
    let { id } = req.params;
    id = id.replace("productPhoto", "");

    const data = req.files.photo.data;
    let photoPath = path.join(
      __dirname,
      "..",
      "public",
      "img",
      "admin",
      "product",
      `${id}.jpg`
    );
    let file = await fs.writeFile(photoPath, data);
    let product = await updateProduct(id);
    res.send({
      ok: true,
    });
  } catch (e) {
    res.send({
      ok: false,
    });
  }
});

router.get("/orders", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  let orders = await getAllOrders()
  let user = await findUserByUsername(req.user.username);
  let cart = await cartProducts(user._id);
  let isUserExists = req.user ? true : false;

  res.render("admin-orders", {
    title: "Buyurtmalar Admin | e-shop.uz",
    path: "/admin",
    cart: cart,
    orders: orders ,
    isUserExists 
  })
})

router.get("/users", async (req, res) => {
  if(!req.user) {
    res.redirect("/login")
    return 0
  }
  let user = await findUserByUsername(req.user.username);
  let cart = await cartProducts(user._id);
  let isUserExists = req.user ? true : false;
  let users = await getAllUsers();
  res.render("admin-users", {
    title: "Buyurtmalar Admin | e-shop.uz",
    path: "/admin",
    cart: cart,
    users: users,
    isUserExists
  })
})

module.exports = {
  path: "/admin",
  router: router,
};
