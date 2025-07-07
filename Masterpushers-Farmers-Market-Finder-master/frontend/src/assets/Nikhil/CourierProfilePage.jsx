import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    Truck,
    Edit,
    Camera,
    Clock,
    FileText,
    FileImage,
    ShoppingBag,
    BarChart3,
    Bike,
    Shield,
    Award,
    Package,
    AlertCircle,
    Leaf,
    Sun,
    Cloud,
    Wheat,
    Droplets,
    Sprout,
} from "lucide-react";

const CourierProfilePage = () => {
    const [courier, setCourier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        // ... existing dashboard stats
    });
    // Add seasonal styling
    const [season, setSeason] = useState("summer");

    // Determine season based on current month
    useEffect(() => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) setSeason("spring");
        else if (month >= 5 && month <= 7) setSeason("summer");
        else if (month >= 8 && month <= 10) setSeason("autumn");
        else setSeason("winter");
    }, []);

    // Season-based styling
    const getSeasonalStyles = () => {
        switch (season) {
            case "spring":
                return {
                    primary: "from-green-500 to-emerald-400",
                    secondary: "bg-emerald-50",
                    accent: "text-emerald-600",
                    icon: <Sprout className="h-6 w-6 text-emerald-500" />,
                    name: "Spring",
                    border: "border-emerald-100",
                    highlight: "bg-emerald-100",
                    button: "bg-emerald-600 hover:bg-emerald-700",
                    light: "text-emerald-500",
                };
            case "summer":
                return {
                    primary: "from-green-600 to-yellow-500",
                    secondary: "bg-green-50",
                    accent: "text-green-600",
                    icon: <Sun className="h-6 w-6 text-yellow-500" />,
                    name: "Summer",
                    border: "border-green-100",
                    highlight: "bg-green-100",
                    button: "bg-green-600 hover:bg-green-700",
                    light: "text-green-500",
                };
            case "autumn":
                return {
                    primary: "from-orange-500 to-amber-400",
                    secondary: "bg-amber-50",
                    accent: "text-amber-600",
                    icon: <Wheat className="h-6 w-6 text-amber-500" />,
                    name: "Autumn",
                    border: "border-amber-100",
                    highlight: "bg-amber-100",
                    button: "bg-amber-600 hover:bg-amber-700",
                    light: "text-amber-500",
                };
            case "winter":
                return {
                    primary: "from-blue-500 to-indigo-400",
                    secondary: "bg-blue-50",
                    accent: "text-blue-600",
                    icon: <Cloud className="h-6 w-6 text-blue-500" />,
                    name: "Winter",
                    border: "border-blue-100",
                    highlight: "bg-blue-100",
                    button: "bg-blue-600 hover:bg-blue-700",
                    light: "text-blue-500",
                };
            default:
                return {
                    primary: "from-green-600 to-green-500",
                    secondary: "bg-green-50",
                    accent: "text-green-600",
                    icon: <Leaf className="h-6 w-6 text-green-500" />,
                    name: "Harvest",
                    border: "border-green-100",
                    highlight: "bg-green-100",
                    button: "bg-green-600 hover:bg-green-700",
                    light: "text-green-500",
                };
        }
    };

    const seasonalStyle = getSeasonalStyles();

    useEffect(() => {
        const fetchCourierData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                const userRole = localStorage.getItem("userRole");
                if (userRole !== "courier") {
                    throw new Error("Unauthorized: Not a courier account");
                }

                const API_URL =
                    process.env.REACT_APP_API_URL || "http://localhost:3000";
                const response = await fetch(`${API_URL}/api/v1/auth`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                        Pragma: "no-cache",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message || "Failed to fetch courier data"
                    );
                }

                const data = await response.json();
                console.log("API Response:", data);

                // Transform the API response into our courier state structure
                setCourier({
                    displayName: data.user.profile.fullName,
                    email: data.user.email,
                    phoneNumber: data.user.profile.phoneNumber,
                    address: data.user.profile.location,
                    description: data.user.profile.description,
                    memberSince: new Date(
                        data.user.createdAt
                    ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    }),
                    profileImage: data.user.profile.profile,
                    vehicleType: data.user.profile.vehicleType,
                    rating: data.user.profile.ratings,
                    totalDeliveries: 0,
                    verifiedStatus: data.user.profile.isVerified,
                    documents: {
                        licenseDocument: data.user.profile.licenseDocument,
                        drivingLicenseNumber:
                            data.user.profile.drivingLicenseNumber,
                        identityType: data.user.profile.identityVerification,
                        cardNumber: data.user.profile.cardNumber,
                        idProof: data.user.profile.idProof,
                    },
                    dateOfBirth: data.user.profile.dateOfBirth
                        ? new Date(
                              data.user.profile.dateOfBirth
                          ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                          })
                        : "Not provided",
                });

                setIsLoading(false);
            } catch (err) {
                console.error("Error details:", {
                    message: err.message,
                    stack: err.stack,
                });
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchCourierData();
    }, []);

    useEffect(() => {
        console.log("LocalStorage items:", {
            token: localStorage.getItem("token"),
            userRole: localStorage.getItem("userRole"),
            user: localStorage.getItem("user"),
        });
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div
                className={`min-h-screen ${seasonalStyle.secondary} flex items-center justify-center`}
            >
                <div className="text-center">
                    <div className="relative">
                        <div
                            className={`animate-spin rounded-full h-16 w-16 border-b-2 border-${
                                seasonalStyle.accent.split("-")[1]
                            } mx-auto`}
                        ></div>
                        <Truck
                            className={`absolute top-4 left-6 h-8 w-8 ${seasonalStyle.accent}`}
                        />
                    </div>
                    <p className={`mt-6 ${seasonalStyle.accent} font-medium`}>
                        Loading courier profile...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div
                className={`min-h-screen ${seasonalStyle.secondary} flex items-center justify-center p-4`}
            >
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="text-center text-red-500 mb-4">
                        <AlertCircle className="h-12 w-12 mx-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-center mb-2">
                        Error Loading Profile
                    </h2>
                    <p className="text-gray-600 text-center mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className={`w-full bg-gradient-to-r ${seasonalStyle.primary} text-white py-2 rounded-lg`}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // If no courier data
    if (!courier) {
        return null;
    }

    // Sample recent activities
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: "delivery",
            orderNumber: "ORD-001",
            location: "Sector 12, Mumbai",
            date: "2025-03-07",
            status: "completed",
            customerName: "John Doe",
        },
        {
            id: 2,
            type: "pickup",
            orderNumber: "ORD-002",
            location: "Andheri East",
            date: "2025-03-07",
            status: "in-progress",
            vendorName: "Fresh Farms",
        },
        {
            id: 3,
            type: "verification",
            documentType: "Vehicle Insurance",
            date: "2025-03-06",
            status: "pending",
        },
        {
            id: 4,
            type: "rating",
            orderNumber: "ORD-003",
            rating: 5,
            date: "2025-03-05",
            customerName: "Sarah Smith",
            feedback: "Very professional and on-time delivery",
        },
    ]);

    // Delivery statistics
    const [deliveryStats, setDeliveryStats] = useState([
        { label: "On-Time Delivery", value: "98%", status: "up" },
        { label: "Customer Rating", value: "4.8/5", status: "up" },
        { label: "Total Distance", value: "1,234 km", status: "up" },
        { label: "Active Hours", value: "180 hrs", status: "up" },
    ]);

    // Functions to render activity icons
    const getActivityIcon = (type) => {
        switch (type) {
            case "delivery":
                return <Truck className="h-6 w-6 text-green-600" />;
            case "pickup":
                return <Package className="h-6 w-6 text-blue-500" />;
            case "verification":
                return <Shield className="h-6 w-6 text-amber-500" />;
            case "rating":
                return <Star className="h-6 w-6 text-purple-500" />;
            default:
                return <Clock className="h-6 w-6 text-gray-500" />;
        }
    };

    // Handle profile image upload
    const handleProfileImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                setCourier({ ...courier, profileImage: event.target.result });
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className={`min-h-screen ${seasonalStyle.secondary} py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}
        >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <Truck className="h-96 w-96 text-green-800" />
            </div>
            <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none">
                <Package className="h-96 w-96 text-green-800" />
            </div>
            <div className="absolute top-1/4 left-10 opacity-5 pointer-events-none">
                <Bike className="h-64 w-64 text-green-800" />
            </div>
            <div className="absolute bottom-1/4 right-10 opacity-5 pointer-events-none">
                <Shield className="h-64 w-64 text-green-800" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Season indicator */}
                <div className="flex items-center justify-center mb-6 bg-white rounded-full py-2 px-6 shadow-md w-fit mx-auto">
                    {seasonalStyle.icon}
                    <span
                        className={`ml-2 font-medium ${seasonalStyle.accent}`}
                    >
                        {seasonalStyle.name} Season Courier
                    </span>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6 border border-gray-100">
                    <div
                        className={`bg-gradient-to-r ${seasonalStyle.primary} h-40 relative`}
                    >
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full">
                                <div className="h-4 w-4 bg-white rounded-full absolute top-10 left-10 opacity-60"></div>
                                <div className="h-3 w-3 bg-white rounded-full absolute top-20 left-40 opacity-40"></div>
                                <div className="h-5 w-5 bg-white rounded-full absolute top-8 right-20 opacity-50"></div>
                                <div className="h-2 w-2 bg-white rounded-full absolute top-30 right-60 opacity-70"></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-16 left-8 flex items-end">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                                    {courier.profileImage ? (
                                        <img
                                            src={courier.profileImage}
                                            alt={courier.displayName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className={`h-full w-full ${seasonalStyle.highlight} flex items-center justify-center`}
                                        >
                                            <User
                                                className={`h-16 w-16 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="profile-upload"
                                    className={`absolute bottom-0 right-0 ${seasonalStyle.highlight} p-2 rounded-full cursor-pointer border-2 border-white shadow-md hover:opacity-90 transition-colors`}
                                >
                                    <Camera
                                        className={`h-4 w-4 ${seasonalStyle.accent}`}
                                    />
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                    />
                                </label>
                            </div>
                            <div className="mb-3 ml-4">
                                <h1 className="text-2xl font-bold text-white flex items-center">
                                    {courier.displayName}
                                    {courier.verifiedStatus && (
                                        <span className="ml-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                                            Verified
                                        </span>
                                    )}
                                </h1>
                                <p className="text-white/80">
                                    Courier • Member since {courier.memberSince}
                                </p>
                            </div>
                        </div>
                        <div className="absolute right-6 top-6">
                            <button
                                className={`bg-white/20 hover:bg-white/30 transition rounded-lg px-4 py-2 text-white font-medium backdrop-blur-sm flex items-center`}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="pt-20 pb-6 px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div
                                            className={`p-2 ${seasonalStyle.highlight} rounded-full mr-3`}
                                        >
                                            <Mail
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <span className="text-gray-800">
                                            {courier.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div
                                            className={`p-2 ${seasonalStyle.highlight} rounded-full mr-3`}
                                        >
                                            <Phone
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <span className="text-gray-800">
                                            {courier.phoneNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-start">
                                        <div
                                            className={`p-2 ${seasonalStyle.highlight} rounded-full mr-3 mt-1`}
                                        >
                                            <MapPin
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <div>
                                            <span className="text-gray-800 block">
                                                {courier.address}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div
                                            className={`p-2 ${seasonalStyle.highlight} rounded-full mr-3`}
                                        >
                                            <Bike
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <span className="text-gray-800">
                                            Vehicle Type: {courier.vehicleType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div
                                    className={`${seasonalStyle.secondary} rounded-xl p-4 ${seasonalStyle.border}`}
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-gray-700">
                                            Courier Stats
                                        </h3>
                                        <Award
                                            className={`h-5 w-5 ${seasonalStyle.accent}`}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Rating
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {courier.rating}/5.0
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Deliveries
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {courier.totalDeliveries}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Verification
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {courier.verifiedStatus
                                                    ? "Verified"
                                                    : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Documents & Verification */}
                    <div className="col-span-1">
                        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Shield
                                    className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                                />
                                Documents & Verification
                            </h2>

                            <div className="space-y-4">
                                <div
                                    className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                                >
                                    <h3 className="font-medium text-gray-700 mb-2">
                                        Driving License
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Number:{" "}
                                        {courier.documents.drivingLicenseNumber}
                                    </p>
                                    <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={
                                                courier.documents
                                                    .licenseDocument
                                            }
                                            alt="License"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div
                                    className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                                >
                                    <h3 className="font-medium text-gray-700 mb-2">
                                        Identity Verification
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Type: {courier.documents.identityType}
                                        <br />
                                        Number: {courier.documents.cardNumber}
                                    </p>
                                    <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={courier.documents.idProof}
                                            alt="ID Proof"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Stats */}
                        <div className="bg-white shadow-lg rounded-xl p-6 mt-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <BarChart3
                                    className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                                />
                                Delivery Statistics
                            </h2>

                            <div className="space-y-4">
                                {deliveryStats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                {stat.label}
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {stat.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Recent Activity */}
                    <div className="col-span-2">
                        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Clock
                                    className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                                />
                                Recent Activity
                            </h2>

                            <div className="space-y-6">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex">
                                        <div className="mr-4">
                                            <div
                                                className={`${seasonalStyle.highlight} p-3 rounded-full`}
                                            >
                                                {getActivityIcon(activity.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 border-b border-gray-100 pb-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-lg text-gray-800">
                                                        {activity.type ===
                                                            "delivery" &&
                                                            `Delivered Order ${activity.orderNumber}`}
                                                        {activity.type ===
                                                            "pickup" &&
                                                            `Pickup from ${activity.vendorName}`}
                                                        {activity.type ===
                                                            "verification" &&
                                                            `Document Verification`}
                                                        {activity.type ===
                                                            "rating" &&
                                                            `New Rating Received`}
                                                    </h3>
                                                    <p className="text-gray-600 mt-1">
                                                        {activity.type ===
                                                            "delivery" &&
                                                            `Delivered to ${activity.customerName} at ${activity.location}`}
                                                        {activity.type ===
                                                            "pickup" &&
                                                            `Pickup location: ${activity.location}`}
                                                        {activity.type ===
                                                            "verification" &&
                                                            `${activity.documentType} verification`}
                                                        {activity.type ===
                                                            "rating" &&
                                                            `${activity.customerName} gave ${activity.rating} stars`}
                                                    </p>
                                                    {activity.feedback && (
                                                        <p className="text-gray-500 text-sm mt-2 italic">
                                                            "{activity.feedback}
                                                            "
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(
                                                            activity.date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    {activity.status && (
                                                        <span
                                                            className={`text-xs px-2 py-1 mt-2 rounded-full ${
                                                                activity.status ===
                                                                "completed"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : activity.status ===
                                                                      "in-progress"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            }`}
                                                        >
                                                            {activity.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                activity.status
                                                                    .slice(1)
                                                                    .replace(
                                                                        "-",
                                                                        " "
                                                                    )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full mt-4 ${seasonalStyle.secondary} hover:opacity-90 ${seasonalStyle.accent} transition py-3 rounded-lg font-medium`}
                            >
                                View All Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourierProfilePage;
