import { Router } from "express";
import {
    orderAssign,
    orderProducts,
    getOrders,
    getCustomerOrders,
    deliveryVerification,
} from "../controller/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
// import { findFarmer } from "../middlewares/findFarmer.js";
const orderRouter = Router();

orderRouter.post("/", verifyJWT, orderProducts);

orderRouter.put("/:orderId/assign", verifyJWT, orderAssign);

orderRouter.get("/",  getOrders);

orderRouter.get("/customer", verifyJWT, getCustomerOrders);

orderRouter.post("/deliver", deliveryVerification);


export { orderRouter };
