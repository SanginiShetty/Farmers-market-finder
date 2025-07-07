import express from "express";
import { upload } from "../utils/s3Upload.js";
import {
    deleteCourier,
    getCourierById,
    getCouriers,
    getCourierOrders,
    makeVerify,
    updateCourier,
} from "../controller/courier.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const courierRouter = express.Router();


courierRouter.get("/orders", verifyJWT, getCourierOrders);
courierRouter.get("/", getCouriers);

courierRouter.get("/:id", getCourierById);

courierRouter.put("/:id", upload, updateCourier);

courierRouter.patch("/:id/verify", verifyJWT, makeVerify);
courierRouter.delete("/:id", deleteCourier);

export { courierRouter };
