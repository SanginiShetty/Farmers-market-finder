import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "./routers/user.routes.js";
import { ampcRouter } from "./routers/ampc.routes.js";
import { courierRouter } from "./routers/courier.routes.js";
import productRouter from "./routers/product.routes.js";
import { paymentRouter } from "./routers/payment.routes.js";
import { orderRouter } from "./routers/order.routes.js";
import axios from "axios";
import { farmerRouter } from "./routers/farmer.routes.js";
import { wishlistRouter } from "./routers/wishlist.routes.js";

dotenv.config({
    path: "./.env",
});

const app = express({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
});

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/ampc", ampcRouter);
app.use("/api/v1/courier", courierRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/farmer", farmerRouter);
app.use("/api/v1/wishlist", wishlistRouter);



const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY);

app.post("/api/directions", async (req, res) => {
    const { origin, destination } = req.body;
    console.log("Received request for directions:");
    console.log("Origin:", origin);
    console.log("Destination:", destination);

    try {
        const googleMapsUrl = `https://routes.googleapis.com/directions/v2:computeRoutes`;
        const requestBody = {
            origin: { address: origin.address },
            destination: { address: destination.address },
            travelMode: "WALK"
        };
        console.log(requestBody);

        const response = await axios.post(googleMapsUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline'
            }
        });
        

        console.log("Response from Google Maps API:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching directions:", error.message);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
        }
        res.status(500).json({ error: "Failed to fetch directions" });
    }
});

export { app };
