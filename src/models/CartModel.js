const client = require("../modules/mongo");
const { Schema } = require("mongoose");

const CartSchema = new Schema({
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
});

async function CartModel() {
  let CartModel = await client();
  return await await CartModel.model("cart", CartSchema);
}

async function AddProduct(product_id, user_id) {
  let db = await CartModel();
  let isExists = await db.find({ product_id: product_id, user_id: user_id });
  if (isExists.length > 0) {
    return await db.updateOne(
      { product_id: product_id },
      { count: isExists[0].count + 1 }
    );
  }
  return await db.create({
    product_id: product_id,
    user_id: user_id,
    count: 1,
  });
}

async function GetProducts() {
  let db = await CartModel();
  return await db.find();
}

async function cartProducts(id) {
  let db = await CartModel();
  return await db.aggregate([
    {
      $match: {
        user_id: id,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product_id",
        foreignField: "_id",
        as: "products",
      },
    },
  ]);
}

async function updateCart(user_id, product_id, count) {
  let db = await CartModel();
  return await db.updateOne(
    { product_id: product_id, user_id: user_id },
    { count: count }
  );
}

async function deleteProduct(user_id, product_id) {
  let db = await CartModel();
  return await db.findOneAndDelete({
    user_id: user_id,
    product_id: product_id,
  });
}

module.exports = {
  AddProduct,
  GetProducts,
  cartProducts,
  updateCart,
  deleteProduct,
};
