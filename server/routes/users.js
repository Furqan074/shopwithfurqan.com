import express from "express";
const router = express.Router();
import {
  register,
  login,
  recover,
  profile,
  reset,
  getSingleProduct,
  getCollectionProducts,
  checkout,
  getCustomerOrders,
  search,
} from "../controller/userController.js";
import isTrueUser from "../middlewares/userAuth.js";
import rateLimiter from "../middlewares/rateLimiter.js";

router.get("/", (req, res) =>
  res.send("If you are seeing this everything is working fine!")
);
router.get("/products/:name", getSingleProduct);
router.get("/collection/:name", getCollectionProducts);
router.get("/orders", isTrueUser, getCustomerOrders);
router.get("/search", search);

router.post("/register", rateLimiter, register);
router.post("/login", rateLimiter, login);
router.post("/recover", rateLimiter, recover);
router.post("/checkout", checkout);

router.patch("/reset/:token", reset);
router.patch("/profile", isTrueUser, rateLimiter, profile);

export default router;
