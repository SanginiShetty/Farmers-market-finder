import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        profile: {
            type: String,
            required: false
        },
        location: {
            type: String,
            required: true
        },
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }],
        wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }]
    },
    {
        timestamps: true
    }
);

export const Customer = mongoose.model("Customer", customerSchema);