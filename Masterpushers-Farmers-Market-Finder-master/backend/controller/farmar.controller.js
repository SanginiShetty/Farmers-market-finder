import { Farmer } from "../models/farmer.model.js";
import { Order } from "../models/order.model.js";

export const getFarmerDashboardOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const farmer = await Farmer.findOne({ user: userId });
        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        const orders = await Order.find({ farmer: farmer._id });
        if (orders.length === 0) {
            return res
                .status(200)
                .json({ message: "No orders found", stats: {} });
        }

        const totalOrders = orders.length;
        const totalAmount = orders.reduce(
            (acc, order) => acc + order.totalAmount,
            0
        );
        const totalQuantity = orders.reduce(
            (acc, order) => acc + order.quantity,
            0
        );

        const pendingOrders = orders.filter(
            (order) => order.status === "pending"
        ).length;
        const completedOrders = orders.filter(
            (order) => order.status === "completed"
        ).length;
        const canceledOrders = orders.filter(
            (order) => order.status === "canceled"
        ).length;

        const pendingPayments = orders.filter(
            (order) => order.paymentStatus === "pending"
        ).length;
        const completedPayments = orders.filter(
            (order) => order.paymentStatus === "completed"
        ).length;
        const failedPayments = orders.filter(
            (order) => order.paymentStatus === "failed"
        ).length;

        const cashOrders = orders.filter(
            (order) => order.paymentMethod === "cash"
        ).length;
        const onlineOrders = orders.filter(
            (order) => order.paymentMethod === "online"
        ).length;

        const averageOrderValue = totalOrders ? totalAmount / totalOrders : 0;
        const averageOrderQuantity = totalOrders
            ? totalQuantity / totalOrders
            : 0;

        const highestOrderAmount = Math.max(
            ...orders.map((order) => order.totalAmount)
        );
        const lowestOrderAmount = Math.min(
            ...orders.map((order) => order.totalAmount)
        );

        const productCount = {};
        orders.forEach((order) => {
            productCount[order.product] =
                (productCount[order.product] || 0) + order.quantity;
        });
        const mostOrderedProduct = Object.keys(productCount).reduce(
            (a, b) => (productCount[a] > productCount[b] ? a : b),
            ""
        );

        const revenueFromCash = orders
            .filter(
                (order) =>
                    order.paymentMethod === "cash" &&
                    order.status === "completed"
            )
            .reduce((acc, order) => acc + order.totalAmount, 0);
        const revenueFromOnline = orders
            .filter(
                (order) =>
                    order.paymentMethod === "online" &&
                    order.status === "completed"
            )
            .reduce((acc, order) => acc + order.totalAmount, 0);
        const pendingRevenue = orders
            .filter((order) => order.status === "pending")
            .reduce((acc, order) => acc + order.totalAmount, 0);

        const recentOrders = orders.slice(-5); // Get the last 5 orders

        res.status(200).json({
            totalOrders,
            totalAmount,
            totalQuantity,
            pendingOrders,
            completedOrders,
            canceledOrders,
            pendingPayments,
            completedPayments,
            failedPayments,
            cashOrders,
            onlineOrders,
            averageOrderValue,
            averageOrderQuantity,
            highestOrderAmount,
            lowestOrderAmount,
            mostOrderedProduct,
            revenueFromCash,
            revenueFromOnline,
            pendingRevenue,
            recentOrders, // Include recent orders in the response
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message,
        });
    }
};

export const getFarmersFromLocation = async (req, res) => {
    const { city, state } = req.query;
    try {
        // Check if at least one search parameter is provided
        if (!city && !state) {
            return res.status(400).json({
                message: "Please provide either city or state",
            });
        }

        let searchQuery = {};

        // Build the search query based on provided parameters
        if (city && state) {
            // Search for both city and state
            searchQuery.location = {
                $regex: new RegExp(`${city}.*${state}|${state}.*${city}`, "i"),
            };
        } else if (city) {
            // Search for city only
            searchQuery.location = { $regex: new RegExp(city, "i") };
        } else if (state) {
            // Search for state only
            searchQuery.location = { $regex: new RegExp(state, "i") };
        }

        const farmers = await Farmer.find(searchQuery);

        res.status(200).json({
            farmers,
            count: farmers.length,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching farmers",
            error: error.message,
        });
    }
};
