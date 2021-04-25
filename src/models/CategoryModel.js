const { Schema } = require("mongoose");
const client = require("../modules/mongo");

const CategorySchema = new Schema({
  category_name: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: Boolean,
    required: true,
  },
});

async function CategoryModel() {
  let db = await client();
  return await db.model("categories", CategorySchema);
}

async function CreateCategory(name) {
  let db = await CategoryModel();
  return await db.create({
    category_name: name,
    photo: false,
  });
}

async function UpdateCategory(name) {
  let db = await CategoryModel();
  return await db.updateOne({ category_name: name }, { photo: true });
}

async function GetCategories() {
  let db = await CategoryModel();
  return await db.find();
}

async function DeleteCategory(name) {
  let db = await CategoryModel();
  return await db.deleteOne({ category_name: name });
}

module.exports = {
  CreateCategory,
  UpdateCategory,
  GetCategories,
  DeleteCategory,
};
