const client = require("../modules/mongo");
const {Schema} = require("mongoose");

const WishListSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

async function WishListModel() {
    let db = await client();
    return await db.model("wishlist", WishListSchema);
}

async function AddWish(user_id, product_id) {
    let db = await WishListModel();
    let wishlist = await db.find({user_id, product_id});
    if(wishlist.length == 0) {
        return await db.create({
            user_id,
            product_id
        });
    }  
}

async function getWishList(user_id) {
    let db = await WishListModel();
    return await db.aggregate([
        {
            $match: {
                "user_id": user_id
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "product"
            }
        }
    ])
}

module.exports = {
    AddWish,
    getWishList
}