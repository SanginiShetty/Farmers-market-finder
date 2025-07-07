import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const farmerSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        location: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        farmName: {
            type: String,
            require: true
        },
        profile: {
            type: String,
            required: false
        },
        idProof: {
            type: String,
            required: true
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }],
        ratings: {
            type: Number,
            default: 0
        },
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }],
        farmType: {
            type: String,
            enum: ["nonveg", "Veg", "both"],
            required: true
        }
    },
    {
        timestamps: true
    }
);
farmerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


farmerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
farmerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            fullName: this.fullName,
            mobile: this.mobile,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

farmerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};
export const Farmer = mongoose.model("Farmer", farmerSchema);
