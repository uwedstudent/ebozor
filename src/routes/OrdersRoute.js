const { Router } = require("express");
const UserMiddleware = require("../middlewares/UserMiddleware");
const { deleteProduct } = require("../models/CartModel");
const { newOrder } = require("../models/OrdersModel");
const { findUserByUsername } = require("../models/UserModel");
const {getProduct} = require("../models/ProductModel")

const router = Router();

router.use(UserMiddleware);

router.post("/", async (req, res) => {
  try {
    let user = await findUserByUsername(req.user.username);
    console.log(req.body);
    req.body.forEach(async (el) => {
      let order = await newOrder(
        user.id,
        el.id,
        el.count,
        el.fullName,
        el.city,
        el.zipPostal,
        el.price,
        el.paymentMethod
      );
      // console.log(el._id)
      // const product = await getProduct(el._id);
      let cleanCart =  await deleteProduct(user._id, el.id)
      console.log(cleanCart)
    });
    res.send({
      ok: true,
    });
  } catch (e) {
    console.log(e);
    res.send({
      ok: false,
    });
  }
});

module.exports = {
  path: "/order",
  router: router,
};
