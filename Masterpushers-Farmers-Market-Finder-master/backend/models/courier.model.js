import mongoose from "mongoose";

const courierSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        profile: {
            type: String,
            required: false,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        ratings: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        vehicleType: {
            type: String,
            enum: ["Bike", "Scooter", "Car"],
            required: true,
        },
        licenseDocument: {
            type: String,
            required: true,
        },
        drivingLicenseNumber: {
            type: String,
            required: true,
        },
        identityVerification: {
            type: String,
            enum: ["Aadhar Card", "PAN Card", "Ration Card"],
            required: true,
        },
        cardNumber: {
            type: String,
            required: false,
        },
        idProof: {
            type: String,
            required: false,
        },
        dateOfBirth: {
            type: Date,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Courier = mongoose.model("Courier", courierSchema);