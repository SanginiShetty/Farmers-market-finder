import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: { type: Number, required: true },
        location: { type: String, required: true },
        unit: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        category: {
            type: String,
            enum: ["vegetables", "fruits", "nuts", "dairy", "non-veg", "other"],
            required: true,
        },
        stock: { type: Number, required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            required: true,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
