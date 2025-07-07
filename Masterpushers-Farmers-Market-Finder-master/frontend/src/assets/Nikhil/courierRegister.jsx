import React, { useState, useRef } from "react";
import {
    User,
    Mail,
    Phone,
    Lock,
    CheckCircle,
    FileImage,
    Bike,
    IdCard,
    Calendar,
    MapPin,
    Navigation,
    Building,
    MapPinned,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CourierRegistrationPage = () => {
    const fileInputRef = useRef(null);
    const profileInputRef = useRef(null);
    const licenseInputRef = useRef(null);
    const idProofInputRef = useRef(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [locationMethod, setLocationMethod] = useState("manual");
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        profilePhoto: null,
        vehicleType: "Bike", // bike, scooter, car
        licenseNumber: "",
        dateOfBirth: "",
        address: "",
        city: "",
        district: "",
        idType: "Aadhar Card", // aadhar, pan, or ration
        idNumber: "",
        idProof: null,
        licenseProof: null, // New field for license document
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Color theme for couriers - Orange theme
    const theme = {
        primary: "#FF9800",
        light: "#FFB74D",
        secondary: "#795548",
        accent: "#FFA726",
        backgroundLight: "#FFF3E0",
    };

    // Vehicle type options
    const vehicleTypes = [
        { value: "Bike", label: "Bike" },
        { value: "Scooter", label: "Scooter" },
        { value: "Car", label: "Car" },
    ];

    // Add ID type options
    const idTypes = [
        { value: "Aadhar Card", label: "Aadhar Card" },
        { value: "PAN Card", label: "PAN Card" },
        { value: "Ration Card", label: "Ration Card" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLocationMethodChange = (method) => {
        setLocationMethod(method);
        setLocationError("");

        if (method === "live") {
            setFormData((prev) => ({
                ...prev,
                address: "",
                city: "",
                district: "",
            }));
        } else if (method === "manual") {
            setFormData((prev) => ({ ...prev, city: "", district: "" }));
        } else if (method === "cityDistrict") {
            setFormData((prev) => ({ ...prev, address: "" }));
        }
    };

    const handleGetLiveLocation = () => {
        setIsGettingLocation(true);
        setLocationError("");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
                    setFormData((prev) => ({
                        ...prev,
                        address: location,
                    }));
                    setIsGettingLocation(false);
                },
                (error) => {
                    setLocationError(
                        "Unable to retrieve your location. Please try another method."
                    );
                    setIsGettingLocation(false);
                    console.error("Error getting location:", error);
                }
            );
        } else {
            setLocationError(
                "Geolocation is not supported by your browser. Please try another method."
            );
            setIsGettingLocation(false);
        }
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (file) {
            try {
                switch (fileType) {
                    case "profile":
                        setFormData((prev) => ({
                            ...prev,
                            profilePhoto: file,
                        }));
                        // Show preview for profile photo
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setProfilePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                        break;
                    case "licenseProof":
                        setFormData((prev) => ({
                            ...prev,
                            licenseProof: file,
                        }));
                        break;
                    case "idProof":
                        setFormData((prev) => ({
                            ...prev,
                            idProof: file,
                        }));
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error("File handling error:", error);
                setErrors((prev) => ({
                    ...prev,
                    [fileType]: "Error handling file. Please try again.",
                }));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            displayName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            profilePhoto: null,
            licenseNumber: "",
            licenseProof: null,
            idType: "PAN Card",
            idNumber: "",
            idProof: null,
            dateOfBirth: "",
            vehicleType: "Bike",
            address: "",
            city: "",
            district: "",
        });
        setProfilePreview(null);
        // Safely reset file inputs
        try {
            if (profileInputRef.current) {
                profileInputRef.current.value = "";
            }
            if (licenseInputRef.current) {
                licenseInputRef.current.value = "";
            }
            if (idProofInputRef.current) {
                idProofInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error resetting file inputs:", error);
        }
    };

    const validateForm = () => {
        let formErrors = {};

        // Required fields validation
        if (!formData.displayName.trim()) {
            formErrors.displayName = "Full name is required";
        }

        if (!formData.email.trim()) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = "Invalid email address";
        }

        if (!formData.phoneNumber.trim()) {
            formErrors.phoneNumber = "Phone number is required";
        }

        if (!formData.licenseNumber.trim()) {
            formErrors.licenseNumber = "Driving license number is required";
        }

        if (!formData.licenseProof) {
            formErrors.licenseProof = "License document is required";
        }

        if (!formData.idType) {
            formErrors.idType = "Identity verification type is required";
        }

        if (!formData.idNumber.trim()) {
            formErrors.idNumber = "ID number is required";
        }

        if (!formData.idProof) {
            formErrors.idProof = "ID proof document is required";
        }

        if (!formData.dateOfBirth) {
            formErrors.dateOfBirth = "Date of birth is required";
        }

        if (!formData.password) {
            formErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            formErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const prepareFormData = () => {
        const formDataToSend = new FormData();

        // Add basic fields
        const basicFields = {
            fullName: formData.displayName,
            email: formData.email,
            password: formData.password,
            role: "courier",
            phoneNumber: formData.phoneNumber,
            drivingLicenseNumber: formData.licenseNumber,
            vehicleType: formData.vehicleType,
            cardNumber: formData.idNumber,
            identityVerification: formData.idType,
        };

        Object.entries(basicFields).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        // Add date of birth
        const formattedDate = new Date(formData.dateOfBirth)
            .toISOString()
            .split("T")[0];
        formDataToSend.append("dateOfBirth", formattedDate);

        // Add location
        const location =
            locationMethod === "cityDistrict"
                ? `${formData.city}, ${formData.district}`
                : formData.address;
        formDataToSend.append("location", location);

        // Add description
        formDataToSend.append(
            "description",
            "Professional courier service provider"
        );

        return formDataToSend;
    };

    const appendFilesToFormData = (formDataToSend) => {
        const files = {
            profile: formData.profilePhoto,
            licenseDocument: formData.licenseProof,
            idProof: formData.idProof,
        };

        Object.entries(files).forEach(([key, file]) => {
            if (file) {
                formDataToSend.append(key, file);
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formDataToSend = prepareFormData();
            appendFilesToFormData(formDataToSend);

            const response = await fetch(
                "http://localhost:3000/api/v1/auth/signup",
                {
                    method: "POST",
                    body: formDataToSend,
                    headers: { Accept: "application/json" }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Registration failed. Please try again."
                );
            }

            // Store token and user role in localStorage
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("userRole", JSON.stringify(data.user.role));

            toast.success("Registration successful!");
            resetForm();
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(
                error.message || "Registration failed. Please try again."
            );
            setErrors((prev) => ({
                ...prev,
                submit:
                    error.message || "Registration failed. Please try again.",
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add error display component
    const ErrorMessage = ({ message }) => (
        <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
        >
            <span className="block sm:inline">{message}</span>
        </div>
    );

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ backgroundColor: theme.backgroundLight }}
        >
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h2
                        className="text-5xl font-bold mb-3"
                        style={{ color: theme.primary }}
                    >
                        Farm Connect
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Create Your Courier Account
                    </p>
                </div>

                {/* Profile Photo Upload */}
                <div className="mb-8 flex flex-col items-center">
                    <div
                        className="w-32 h-32 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4"
                        style={{ borderColor: theme.light }}
                    >
                        {profilePreview ? (
                            <img
                                src={profilePreview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="h-16 w-16 text-gray-400" />
                        )}
                    </div>
                    <input
                        type="file"
                        ref={profileInputRef}
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "profile")}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => profileInputRef.current?.click()}
                        className="py-2 px-4 rounded-lg text-base flex items-center justify-center transition duration-300 bg-white border"
                        style={{
                            borderColor: theme.light,
                            color: theme.primary,
                        }}
                    >
                        <FileImage className="mr-2 h-5 w-5" />
                        {profilePreview
                            ? "Change Profile Photo"
                            : "Add Profile Photo"}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="relative">
                        <User className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="text"
                            name="displayName"
                            placeholder="Full Name"
                            value={formData.displayName}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.displayName ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.displayName
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.displayName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.displayName}
                            </p>
                        )}
                    </div>

                    {/* Vehicle Type Selection */}
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-medium">
                            Vehicle Type
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {vehicleTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            vehicleType: type.value,
                                        }))
                                    }
                                    className={`p-3 rounded-xl border-2 transition duration-300 ${
                                        formData.vehicleType === type.value
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-orange-200"
                                    }`}
                                >
                                    <Bike
                                        className={`h-6 w-6 mx-auto mb-2 ${
                                            formData.vehicleType === type.value
                                                ? "text-orange-500"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span
                                        className={`block text-sm font-medium ${
                                            formData.vehicleType === type.value
                                                ? "text-orange-700"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.email ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.email
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.phoneNumber ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.phoneNumber
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>

                    {/* License Information Section */}
                    <div
                        className="space-y-4 p-6 border-2 rounded-xl"
                        style={{ borderColor: theme.light }}
                    >
                        <h3 className="text-lg font-semibold text-gray-700">
                            License Information
                        </h3>

                        <div className="relative">
                            <IdCard className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                            <input
                                type="text"
                                name="licenseNumber"
                                placeholder="Driving License Number"
                                value={formData.licenseNumber}
                                onChange={handleChange}
                                className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                    errors.licenseNumber ? "border-red-500" : ""
                                }`}
                                style={{
                                    borderColor: errors.licenseNumber
                                        ? undefined
                                        : theme.light,
                                }}
                                required
                            />
                            {errors.licenseNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.licenseNumber}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Upload License Document
                            </label>
                            <input
                                type="file"
                                ref={licenseInputRef}
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                    handleFileChange(e, "licenseProof")
                                }
                                className="w-full"
                            />
                            {errors.licenseProof && (
                                <p className="text-red-500 text-sm">
                                    {errors.licenseProof}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ID Proof Section */}
                    <div
                        className="space-y-4 p-6 border-2 rounded-xl"
                        style={{ borderColor: theme.light }}
                    >
                        <h3 className="text-lg font-semibold text-gray-700">
                            Identity Verification
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {idTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            idType: type.value,
                                        }))
                                    }
                                    className={`p-4 rounded-xl border-2 transition duration-300 ${
                                        formData.idType === type.value
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-orange-200"
                                    }`}
                                >
                                    <span className="text-sm font-medium">
                                        {type.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <IdCard className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                            <input
                                type="text"
                                name="idNumber"
                                placeholder={`Enter ${
                                    idTypes.find(
                                        (t) => t.value === formData.idType
                                    )?.label
                                } Number`}
                                value={formData.idNumber}
                                onChange={handleChange}
                                className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                    errors.idNumber ? "border-red-500" : ""
                                }`}
                                style={{
                                    borderColor: errors.idNumber
                                        ? undefined
                                        : theme.light,
                                }}
                                required
                            />
                            {errors.idNumber && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.idNumber}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-gray-700 font-medium">
                                Upload ID Proof
                            </label>
                            <input
                                type="file"
                                ref={idProofInputRef}
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, "idProof")}
                                className="w-full"
                            />
                            {errors.idProof && (
                                <p className="text-red-500 text-sm">
                                    {errors.idProof}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div
                        className="space-y-4 p-6 border-2 rounded-xl"
                        style={{ borderColor: theme.light }}
                    >
                        <div className="font-semibold flex items-center text-lg text-gray-700">
                            <MapPinned className="mr-2 h-6 w-6" />
                            Service Location
                        </div>

                        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                            <button
                                type="button"
                                onClick={() =>
                                    handleLocationMethodChange("manual")
                                }
                                className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300`}
                                style={{
                                    backgroundColor:
                                        locationMethod === "manual"
                                            ? theme.primary
                                            : "white",
                                    color:
                                        locationMethod === "manual"
                                            ? "white"
                                            : "rgb(55, 65, 81)",
                                    border:
                                        locationMethod === "manual"
                                            ? "none"
                                            : `1px solid ${theme.light}`,
                                }}
                            >
                                <MapPin className="mr-2 h-5 w-5" />
                                Enter Address
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleLocationMethodChange("live")
                                }
                                className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300`}
                                style={{
                                    backgroundColor:
                                        locationMethod === "live"
                                            ? theme.primary
                                            : "white",
                                    color:
                                        locationMethod === "live"
                                            ? "white"
                                            : "rgb(55, 65, 81)",
                                    border:
                                        locationMethod === "live"
                                            ? "none"
                                            : `1px solid ${theme.light}`,
                                }}
                            >
                                <Navigation className="mr-2 h-5 w-5" />
                                Live Location
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleLocationMethodChange("cityDistrict")
                                }
                                className={`flex-1 py-3 px-4 rounded-lg text-base flex items-center justify-center transition duration-300`}
                                style={{
                                    backgroundColor:
                                        locationMethod === "cityDistrict"
                                            ? theme.primary
                                            : "white",
                                    color:
                                        locationMethod === "cityDistrict"
                                            ? "white"
                                            : "rgb(55, 65, 81)",
                                    border:
                                        locationMethod === "cityDistrict"
                                            ? "none"
                                            : `1px solid ${theme.light}`,
                                }}
                            >
                                <Building className="mr-2 h-5 w-5" />
                                City/District
                            </button>
                        </div>

                        <div className="mt-4">
                            {locationMethod === "manual" && (
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                                    <textarea
                                        name="address"
                                        placeholder="Enter Your Service Area Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none resize-none ${
                                            errors.address
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        style={{
                                            borderColor: errors.address
                                                ? undefined
                                                : theme.light,
                                            minHeight: "100px",
                                        }}
                                        required={locationMethod === "manual"}
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                            )}

                            {locationMethod === "live" && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleGetLiveLocation}
                                        disabled={isGettingLocation}
                                        className="w-full bg-white py-4 px-4 rounded-xl transition duration-300 flex items-center justify-center text-lg border"
                                        style={{
                                            borderColor: theme.light,
                                            color: theme.primary,
                                        }}
                                    >
                                        <Navigation className="mr-3 h-6 w-6" />
                                        {isGettingLocation
                                            ? "Getting Location..."
                                            : "Get Current Location"}
                                    </button>

                                    {formData.address &&
                                        locationMethod === "live" && (
                                            <div
                                                className="mt-4 p-4 bg-white rounded-xl border"
                                                style={{
                                                    borderColor: theme.light,
                                                }}
                                            >
                                                <p className="text-base text-gray-700">
                                                    <span className="font-medium">
                                                        Location captured:
                                                    </span>{" "}
                                                    {formData.address}
                                                </p>
                                            </div>
                                        )}

                                    {locationError && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {locationError}
                                        </p>
                                    )}
                                </div>
                            )}

                            {locationMethod === "cityDistrict" && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Building className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none"
                                            style={{ borderColor: theme.light }}
                                            required={
                                                locationMethod ===
                                                "cityDistrict"
                                            }
                                        />
                                    </div>

                                    <div className="relative">
                                        <MapPinned className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                                        <input
                                            type="text"
                                            name="district"
                                            placeholder="District"
                                            value={formData.district}
                                            onChange={handleChange}
                                            className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none"
                                            style={{ borderColor: theme.light }}
                                            required={
                                                locationMethod ===
                                                "cityDistrict"
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Courier Information */}
                    <div className="relative">
                        <Calendar className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="date"
                            name="dateOfBirth"
                            placeholder="Date of Birth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.dateOfBirth ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.dateOfBirth
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.dateOfBirth && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.dateOfBirth}
                            </p>
                        )}
                    </div>

                    {/* Password Fields */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.password ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.password
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.confirmPassword ? "border-red-500" : ""
                            }`}
                            style={{
                                borderColor: errors.confirmPassword
                                    ? undefined
                                    : theme.light,
                            }}
                            required
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {errors.submit && <ErrorMessage message={errors.submit} />}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-white py-4 rounded-xl transition duration-300 flex items-center justify-center text-lg font-medium mt-6 shadow-md ${
                            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        style={{ backgroundColor: theme.primary }}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Registering...
                            </div>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-6 w-6" />
                                Register
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-600 text-lg">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="ml-2 hover:underline font-medium"
                            style={{ color: theme.primary }}
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CourierRegistrationPage;
