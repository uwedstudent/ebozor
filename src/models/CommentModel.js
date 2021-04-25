const client = require("../modules/mongo");
const { Schema } = require("mongoose");
const moment = require("moment");
const CommentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mark: {
    type: Number,
    required: true,
  },
  reviewTitle: {
    type: String,
    required: true,
  },
  reviewBody: {
    type: String,
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

async function CommentModel() {
  let db = await client();
  return await db.model("comments", CommentSchema);
}

async function newComment(
  name,
  email,
  mark,
  reviewTitle,
  reviewBody,
  product_id
) {
  let time = new Date();
  let date = moment(time).locale("uz-latn").format("LLLL");
  let db = await CommentModel();
  return await db.create({
    name,
    email,
    mark,
    reviewTitle,
    reviewBody,
    product_id,
    time: date,
  });
}

async function getComments(product_id) {
  let db = await CommentModel();
  return await db.find({ product_id: product_id });
}

async function getAllComments() {
  let db = await CommentModel();
  return await db.find();
}

module.exports = {
  newComment,
  getComments,
  getAllComments
};
