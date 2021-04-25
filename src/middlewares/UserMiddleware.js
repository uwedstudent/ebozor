const { verifyJWTTOken } = require("../modules/jwt");
const { GetProducts } = require("../models/CartModel")

async function UserMiddleware(request, response, next) {
  let token = request.cookies?.token;
  token = verifyJWTTOken(token);
  if (token) {
    request.user = token;
  } 
  next();
}

module.exports = UserMiddleware;
