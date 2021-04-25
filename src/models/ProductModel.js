const { Schema } = require("mongoose");
const client = require("../modules/mongo");

const ProductSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  oldPrice: {
    type: String,
    required: true,
  },
  salePrice: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: Boolean,
    required: true,
  },
});

async function ProductModel() {
  let db = await client();
  return await db.model("products", ProductSchema);
}

async function updateProduct(id) {
  let db = await ProductModel();
  return await db.updateOne({ _id: id }, { photo: true });
}

// addProduct
async function addProduct(
  brand,
  model,
  category,
  oldPrice,
  salePrice = null,
  description
) {
  let db = await ProductModel();
  let data = salePrice
    ? { photo: false, brand, model, category, oldPrice, description, salePrice }
    : { photo: false, brand, model, category, oldPrice, description };
  let product = await db.create(data);
  return product;
}

async function Products(category) {
  let db = await ProductModel();
  return await db.find({ category: category });
}

// Pagination

async function getProducts(pageSize, currentPage, category) {
  let db = await ProductModel();
  return await db
    .find({ category: category })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize);
}

async function getProduct(id) {
  let db = await ProductModel();
  return await db.findOne({ _id: id });
}

async function allProducts() {
  let db = await ProductModel();
  return await db.find();
}

module.exports = {
  addProduct,
  getProducts,
  allProducts,
  getProduct,
  Products,
  updateProduct,
};
