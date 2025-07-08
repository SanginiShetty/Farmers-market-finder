import express from "express";
import { getFarmerDashboardOrders, getFarmersFromLocation } from "../controller/farmar.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const farmerRouter = express.Router();

farmerRouter.get("/dashboard", verifyJWT, getFarmerDashboardOrders);

farmerRouter.get("/location", getFarmersFromLocation);

export { farmerRouter };
