import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory } from "../controller/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { findFarmer } from "../middlewares/findFarmer.js";
import { uploadProductImage } from "../utils/s3Upload.js";

const router = Router();

router.post("/", verifyJWT, findFarmer, uploadProductImage, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
//get by category
router.get("/category/:category", getProductsByCategory);
router.put("/:id", verifyJWT, findFarmer, updateProduct);
router.delete("/:id", verifyJWT, findFarmer, deleteProduct);

export default router;

