import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controller/wishlist.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/", verifyJWT, addToWishlist);

wishlistRouter.delete("/", verifyJWT, removeFromWishlist);

wishlistRouter.get("/", verifyJWT, getWishlist);

export { wishlistRouter };
