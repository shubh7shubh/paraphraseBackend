const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const authCheck = async (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    if (!req.headers.authorization) throw new Error("Failed to authorize", 401);
    const decoded = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    if (!decoded) throw new Error("Invalid authorization token", 401);

    const id = decoded.id;
    const user = await UserModel.findById(id).select("_id");
    if (user) {
      req.bearerId = id;
      req.role = "USER";

      return next();
    } else {
      throw new Error("Invalid user", 401);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = authCheck;
