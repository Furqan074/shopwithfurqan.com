import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
import Customers from "../modals/customer.js";

const isTrueUser = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({
        success: false,
        message: "unauthorized request",
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, JWT_SECRET);

    const existingCustomer = await Customers.findOne({
      _id: decodedToken.customerId,
    });

    if (existingCustomer) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "unauthorized request",
      });
    }
  } catch (error) {
    if (error.message === "invalid token") {
      console.log("unauthorized or specious request made " + error);
      return res.status(403).json({
        success: false,
        message: "unauthorized request",
      });
    }
  }
};

export default isTrueUser;
