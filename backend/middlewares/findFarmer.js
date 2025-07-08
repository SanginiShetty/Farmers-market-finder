import { Farmer } from "../models/farmer.model.js";
import { User } from "../models/user.model.js";

export const findFarmer = async (req, res, next) => {
    console.log("req.user", req.user._id);
    const farmer = await Farmer.findOne({ user: req.user._id });
    if (!farmer) return next(new Error("Farmer not found"));
    req.farmer = farmer;
    next();
};