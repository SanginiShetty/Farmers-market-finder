import { Courier } from "../models/courier.model.js";
import { Customer } from "../models/customer.model.js";
import { Farmer } from "../models/farmer.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        // Generate access token and refresh token
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        return res.status(500).json({
            message:
                "Something went wrong while generating referesh and access token",
        });
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // Extract base user data and role-specific data
    const { fullName, email, password, role, phoneNumber, location } = req.body;

    // Check if all common fields are provided
    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({
            success: false,
            message:
                "Registration failed. Please provide all required information.",
            error: "Missing required fields: Full Name, Email, and Password are mandatory",
        });
    }

    // Validate role
    if (!["customer", "farmer", "courier", "admin"].includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Registration failed. Invalid role provided.",
            error: "Role must be one of: customer, farmer, courier",
        });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(409).json({
            success: false,
            message: "Registration failed. Account already exists.",
            error: "An account with this email is already registered",
        });
    }

    // Handle profile image upload if provided
    let profileImageUrl = null;
    if (req.files) {
        console.log(req.files.profile);
        profileImageUrl = req.files.profile[0].location;
        console.log("profileImageUrl", profileImageUrl);
    }

    // Create the base user account
    const user = await User.create({ fullName, email, password, role });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Registration failed. Please try again.",
            error: "User creation unsuccessful",
        });
    }

    // Create role-specific profile
    let roleProfile;

    try {
        if (role === "customer") {
            // Validate customer-specific fields
            if (!phoneNumber || !location) {
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({
                    success: false,
                    message:
                        "Registration failed. Missing customer information.",
                    error: "Phone number and location are required for customer registration",
                });
            }

            roleProfile = await Customer.create({
                user: user._id,
                fullName,
                phoneNumber,
                profile: profileImageUrl,
                location,
                orders: [],
                wishlist: [],
            });
        } else if (role === "farmer") {
            const { location, description, farmName, farmType } = req.body;

            let documentsUrl = null;
            if (req.files) {
                if (req.files.idProof) {
                    documentsUrl = req.files.idProof[0].location;
                }
            }

            if (!location || !description || !farmName || !farmType) {
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({
                    success: false,
                    message: "Registration failed. Missing farmer information.",
                    error: "Farm location and description are required for farmer registration",
                });
            }

            roleProfile = await Farmer.create({
                user: user._id,
                email: email,
                fullName,
                location,
                description,
                farmName,
                farmType,
                profile: profileImageUrl,
                idProof: documentsUrl,
                products: [],
                ratings: 0,
                reviews: [],
            });
        } else if (role === "courier") {
            const {
                description,
                drivingLicenseNumber,
                vehicleType,
                identityVerification,
                cardNumber,
                dateOfBirth,
            } = req.body;

            // Validate courier-specific fields
            if (
                !phoneNumber ||
                !location ||
                !drivingLicenseNumber ||
                !vehicleType ||
                !identityVerification ||
                !cardNumber ||
                !dateOfBirth
            ) {
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({
                    success: false,
                    message:
                        "Registration failed. Missing courier information.",
                    error: "Phone number and location are required for courier registration",
                });
            }

            // Handle document uploads
            let licenseDocumentUrl = null;
            let idProofUrl = null;

            if (req.files) {
                if (req.files.licenseDocument) {
                    licenseDocumentUrl = req.files.licenseDocument[0].location; // Assuming you're using multer for file uploads
                }
                if (req.files.idProof) {
                    idProofUrl = req.files.idProof[0].location; // Assuming you're using multer for file uploads
                }
            }

            roleProfile = await Courier.create({
                user: user._id,
                fullName,
                location,
                description: description || "",
                profile: profileImageUrl,
                licenseDocument: licenseDocumentUrl,
                idProof: idProofUrl,
                drivingLicenseNumber,
                vehicleType,
                identityVerification,
                cardNumber,
                dateOfBirth,
                phoneNumber,
                isVerified: false,
                ratings: 0,
                reviews: [],
            });
        }

        if (role != "admin") {
            if (!roleProfile) {
                await User.findByIdAndDelete(user._id);
                return res.status(400).json({
                    success: false,
                    message:
                        "Registration failed. Could not create role profile.",
                    error: "Role profile creation unsuccessful",
                });
            }
        }
    } catch (error) {
        // Clean up user if role profile creation fails
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
            success: false,
            message: "Registration failed. Please try again.",
            error: error.message || "Role profile creation unsuccessful",
        });
    }

    // Generate access token and refresh token
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    // Remove sensitive fields before sending response
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;

    // Add role profile information to response
    userData.profile = roleProfile;

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(201)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json({
            success: true,
            message: `Registration successful! Welcome to our platform as a ${role}!`,
            user: userData,
            accessToken,
        });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by email or username
    let user;
    if (email) {
        user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }
    }

    // Check if password is correct
    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
    }

    // Generate access token and refresh token
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    // Remove sensitive fields before sending response
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json({
            message: "User logged in successfully",
            user: userData,
            accessToken,
        });
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json({
            message: "User logged out successfully",
        });
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;

    // Fetch the user to get their role
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            error: "The requested user account does not exist",
        });
    }

    // Extract common updateable fields
    const { fullName, email } = req.body;

    // Prepare updates for base user
    const userUpdates = {};
    if (fullName?.trim()) userUpdates.fullName = fullName;
    if (email?.trim()) {
        // Check if new email is already in use by another user
        const emailExists = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: userId }, // Exclude current user
        });

        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
                error: "This email is already registered to another account",
            });
        }
        userUpdates.email = email.toLowerCase();
    }

    let profileImageUrl = null;
    if (req.file) {
        profileImageUrl = req.file.location; // Correct way to get S3 URL
    }

    // Prepare role-specific updates
    let roleUpdates = {};
    let roleModel, roleDocument;

    // Determine which role model to use and prepare updates
    switch (user.role) {
        case "customer":
            roleModel = Customer;
            roleDocument = await Customer.findOne({ user: userId });

            // Extract customer-specific fields
            const { phoneNumber, location } = req.body;

            if (phoneNumber?.trim()) roleUpdates.phoneNumber = phoneNumber;
            if (location?.trim()) roleUpdates.location = location;
            if (profileImageUrl) roleUpdates.profile = profileImageUrl;
            break;

        case "farmer":
            roleModel = Farmer;
            roleDocument = await Farmer.findOne({ user: userId });
            // Extract farmer-specific fields
            const {
                location: farmerLocation,
                description: farmDescription,
                farmName,
                farmType,
            } = req.body;



            if (farmerLocation?.trim()) roleUpdates.location = farmerLocation;
            if (farmDescription?.trim())
                roleUpdates.description = farmDescription;
            if (farmName?.trim()) roleUpdates.farmName = farmName;
            if (farmType?.trim()) roleUpdates.farmType = farmType;
            if (profileImageUrl) roleUpdates.profile = profileImageUrl;
            break;

        case "courier":
            roleModel = Courier;
            roleDocument = await Courier.findOne({ user: userId });

            // Extract courier-specific fields
            const { courierPhoneNumber, courierLocation, description } =
                req.body;

            if (courierPhoneNumber?.trim())
                roleUpdates.phoneNumber = courierPhoneNumber;
            if (courierLocation?.trim()) roleUpdates.location = courierLocation;
            if (description?.trim()) roleUpdates.description = description;
            if (profileImageUrl) roleUpdates.profile = profileImageUrl;
            break;

        default:
            return res.status(400).json({
                success: false,
                message: "Invalid user role",
                error: "Cannot update profile for this user role",
            });
    }

    if (!roleDocument) {
        return res.status(404).json({
            success: false,
            message: "Profile not found",
            error: `${user.role} profile does not exist for this user`,
        });
    }

    try {
        // Update base user if there are changes
        let updatedUser = user;
        if (Object.keys(userUpdates).length > 0) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: userUpdates },
                { new: true }
            ).select("-password -refreshToken");
        }

        // Update role profile if there are changes
        let updatedRoleProfile = roleDocument;
        if (Object.keys(roleUpdates).length > 0) {
            updatedRoleProfile = await roleModel.findByIdAndUpdate(
                roleDocument._id,
                { $set: roleUpdates },
                { new: true }
            );
        }

        // Return the updated user and profile info
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
            profile: updatedRoleProfile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message || "An unexpected error occurred",
        });
    }
});


const getUser = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    let roleProfile;
    if (user.role === "customer") {
        roleProfile = await Customer.findOne({ user: userId });
    } else if (user.role === "farmer") {
        roleProfile = await Farmer.findOne({ user: userId });
    } else if (user.role === "courier") {
        roleProfile = await Courier.findOne({ user: userId });
    }
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;
    userData.profile = roleProfile;
    return res.status(200).json({ user: userData });
});

export { registerUser, loginUser, logoutUser, updateUserProfile, getUser };
