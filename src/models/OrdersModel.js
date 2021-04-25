const client = require("../modules/mongo");
const { Schema } = require("mongoose");
const moment = require("moment");

const OrderSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipPostal: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
});

async function OrderModel() {
  let db = await client();
  return await db.model("orders", OrderSchema);
}

async function newOrder(user_id, product_id, count, fullName, city, zipPostal, price, paymentMethod) {
  let db = await OrderModel();
  let time = new Date();
  let date = moment(time).locale("uz-latn").format("LLLL");
  return await db.create({
    user_id,
    product_id,
    count,
    fullName,
    city,
    zipPostal,
    price,
    paymentMethod,
    time: date,
  });
}

async function getAllOrders() {
  let db = await OrderModel();
  return await db.find();
}

async function getOrders(user_id) {
  let db = await OrderModel();
  return await db.aggregate([
    {
      $match: {
        user_id: user_id,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "_id",
        as: "product",
      },
    },
  ]);
}

module.exports = {
  newOrder,
  getAllOrders,
  getOrders,
};
