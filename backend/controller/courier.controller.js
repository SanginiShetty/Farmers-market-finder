import { Courier } from "../models/courier.model.js";
import { Order } from "../models/order.model.js";
export const getCouriers = async (req, res) => {
    try {
        const couriers = await Courier.find().populate("user");
        res.status(200).json({ success: true, data: couriers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCourierById = async (req, res) => {
    try {
        const courier = await Courier.findById(req.params.id);
        if (!courier)
            return res
                .status(404)
                .json({ success: false, message: "Courier not found" });
        res.status(200).json({ success: true, data: courier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCourier = async (req, res) => {
    try {
        const {
            fullName,
            location,
            description,
            phoneNumber,
            identityVerification,
            drivingLicenseNumber,
            licenseDocument,
            vehicleType,
        } = req.body;

        // Check for required fields
        if (
            !identityVerification ||
            !drivingLicenseNumber ||
            !licenseDocument ||
            !vehicleType
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields: identityVerification, drivingLicenseNumber, licenseDocument, vehicleType",
            });
        }

        let profile = req.body.profile;

        if (req.file) {
            const uploadResult = req.file.location;
            profile = uploadResult.Location;
        }

        const courier = await Courier.findByIdAndUpdate(
            req.params.id,
            {
                fullName,
                location,
                description,
                phoneNumber,
                profile,
                identityVerification,
                drivingLicenseNumber,
                licenseDocument,
                vehicleType,
            },
            { new: true }
        );

        if (!courier)
            return res
                .status(404)
                .json({ success: false, message: "Courier not found" });
        res.status(200).json({ success: true, data: courier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const makeVerify = async (req, res) => {
    try {
        const courier = await Courier.findById(req.params.id);
        if (!courier)
            return res
                .status(404)
                .json({ success: false, message: "Courier not found" });

        courier.isVerified = !courier.isVerified;
        await courier.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, data: courier });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteCourier = async (req, res) => {
    try {
        const courier = await Courier.findByIdAndDelete(req.params.id);
        if (!courier)
            return res
                .status(404)
                .json({ success: false, message: "Courier not found" });
        res.status(200).json({
            success: true,
            message: "Courier deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCourierOrders = async (req, res) => {
    console.log("hi");
    try {
        const courier = await Courier.findOne({ user: req.user._id });
        const orders = await Order.find({ courier: courier._id });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
