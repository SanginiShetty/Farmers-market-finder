import { Customer } from "../models/customer.model.js";

// Add a product to the wishlist
export const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    try {
        const customer = await Customer.findOne({ user: userId });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        if (!customer.wishlist.includes(productId)) {
            customer.wishlist.push(productId);
            await customer.save();
        }

        res.status(200).json({
            message: "Product added to wishlist",
            wishlist: customer.wishlist,
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding product to wishlist",
            error,
        });
    }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    try {
        const customer = await Customer.findOne({ user: userId });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        customer.wishlist = customer.wishlist.filter(
            (id) => id.toString() !== productId
        );
        await customer.save();

        res.status(200).json({
            message: "Product removed from wishlist",
            wishlist: customer.wishlist,
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error removing product from wishlist",
            error,
        });
    }
};

export const getWishlist = async (req, res) => {
    const userId = req.user._id;

    try {
        const customer = await Customer.findOne({ user: userId }).populate("wishlist");
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ 
            message: "Wishlist retrieved successfully",
            wishlist: customer.wishlist,
            status: "success",
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving wishlist", error });
    }
};
