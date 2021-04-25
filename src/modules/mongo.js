const mongoose = require("mongoose");

async function client() {
  return await mongoose.connect(
    "mongodb+srv://zoirov:najottalim@najottalim.eyyxz.mongodb.net/eshop",
    {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: true,
    }
  );
}

module.exports = client;
