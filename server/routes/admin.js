import express from "express";
const router = express.Router();
import isAdmin from "../middlewares/adminAuth.js";
import {
  adminLogin,
  getAllCustomer,
  deleteCustomer,
  createCategory,
  getAllCategories,
  deleteCategory,
  createProduct,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  deleteOrder,
  getAllBanner,
  createBanner,
  deleteBanner,
  updateBanner,
  updateCategory,
  updateOrder,
  updateProduct,
  getSingleProduct,
  deleteProductReview,
  createSale,
  updateSale,
  getFlashSale,
  Dashboard,
} from "../controller/adminController.js";

// GET requests
router.get("/", Dashboard);
router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.get("/customers", isAdmin, getAllCustomer);
router.get("/orders", isAdmin, getAllOrders);
router.get("/categories", getAllCategories);
router.get("/banners", getAllBanner);
router.get("/sale", getFlashSale);

// POST requests
router.post("/login", adminLogin);
router.post("/products/create", isAdmin, createProduct);
router.post("/categories/create", isAdmin, createCategory);
router.post("/banners/create", isAdmin, createBanner);
router.post("/sale/create", isAdmin, createSale);

// PATCH requests
router.patch("/banners/update/:id", isAdmin, updateBanner);
router.patch("/categories/update/:id", isAdmin, updateCategory);
router.patch("/orders/update/:id", isAdmin, updateOrder);
router.patch("/products/update/:id", isAdmin, updateProduct);
router.patch("/sale/update/:id", isAdmin, updateSale);

// DELETE requests
router.delete("/customers/:id", isAdmin, deleteCustomer);
router.delete("/categories", isAdmin, deleteCategory);
router.delete("/orders", isAdmin, deleteOrder);
router.delete("/products", isAdmin, deleteProduct);
router.delete("/product/:id/reviews/:reviewId", isAdmin, deleteProductReview);
router.delete("/banners", isAdmin, deleteBanner);

export default router;
