import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Truck,
    Shield,
    Star,
    FileText,
    Camera,
    AlertCircle,
    CheckCircle,
    XCircle,
    Leaf,
    Sun,
    Cloud,
    Wheat,
    Tractor,
    Shovel,
    Droplets,
    Package,
    DollarSign,
    X,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProfileCourier = () => {
    const [courierData, setCourierData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Add seasonal styling
    const [season, setSeason] = useState("summer");
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');

    // Determine season based on current month
    useEffect(() => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) setSeason("spring");
        else if (month >= 5 && month <= 7) setSeason("summer");
        else if (month >= 8 && month <= 10) setSeason("autumn");
        else setSeason("winter");
    }, []);

    // Season-based styling with farming theme
    const getSeasonalStyles = () => {
        switch (season) {
            case "spring":
                return {
                    primary: "from-green-500 to-emerald-400",
                    secondary: "bg-emerald-50",
                    accent: "text-emerald-600",
                    icon: <Leaf className="h-6 w-6 text-emerald-500" />,
                    name: "Spring Planting",
                    border: "border-emerald-100",
                    highlight: "bg-emerald-100",
                    button: "bg-emerald-600 hover:bg-emerald-700",
                    light: "text-emerald-500",
                    pattern:
                        "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                };
            case "summer":
                return {
                    primary: "from-green-600 to-yellow-500",
                    secondary: "bg-green-50",
                    accent: "text-green-600",
                    icon: <Sun className="h-6 w-6 text-yellow-500" />,
                    name: "Summer Harvest",
                    border: "border-green-100",
                    highlight: "bg-green-100",
                    button: "bg-green-600 hover:bg-green-700",
                    light: "text-green-500",
                    pattern:
                        "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316a34a' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                };
            case "autumn":
                return {
                    primary: "from-orange-500 to-amber-400",
                    secondary: "bg-amber-50",
                    accent: "text-amber-600",
                    icon: <Wheat className="h-6 w-6 text-amber-500" />,
                    name: "Autumn Harvest",
                    border: "border-amber-100",
                    highlight: "bg-amber-100",
                    button: "bg-amber-600 hover:bg-amber-700",
                    light: "text-amber-500",
                    pattern:
                        "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                };
            case "winter":
                return {
                    primary: "from-blue-500 to-indigo-400",
                    secondary: "bg-blue-50",
                    accent: "text-blue-600",
                    icon: <Cloud className="h-6 w-6 text-blue-500" />,
                    name: "Winter Rest",
                    border: "border-blue-100",
                    highlight: "bg-blue-100",
                    button: "bg-blue-600 hover:bg-blue-700",
                    light: "text-blue-500",
                    pattern:
                        "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                };
            default:
                return {
                    primary: "from-green-600 to-green-500",
                    secondary: "bg-green-50",
                    accent: "text-green-600",
                    icon: <Leaf className="h-6 w-6 text-green-500" />,
                    name: "Harvest Season",
                    border: "border-green-100",
                    highlight: "bg-green-100",
                    button: "bg-green-600 hover:bg-green-700",
                    light: "text-green-500",
                    pattern:
                        "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316a34a' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                };
        }
    };

    const seasonalStyle = getSeasonalStyles();

    useEffect(() => {
        const fetchCourierProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await fetch(
                    "http://localhost:3000/api/v1/auth",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                console.log("Courier data:", data.user);
                setCourierData(data.user);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchCourierProfile();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:3000/api/v1/courier/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };

        fetchOrders();
    }, []);

    const handleVerification = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/v1/order/deliver', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: selectedOrder._id,
                    randomNumber: verificationCode
                })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Order verified successfully!');
                setOrders(prevOrders => prevOrders.filter(order => order._id !== selectedOrder._id));
                setShowVerificationModal(false);
                setVerificationCode('');
                setSelectedOrder(null);
            } else {
                toast.error(data.message || 'Verification failed');
            }
        } catch (err) {
            toast.error('Failed to verify order');
        }
    };

    if (isLoading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${seasonalStyle.secondary}`}
                style={{ backgroundImage: seasonalStyle.pattern }}
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
                        Loading farm courier profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${seasonalStyle.secondary}`}
                style={{ backgroundImage: seasonalStyle.pattern }}
            >
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Error
                    </h3>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className={`mt-4 px-4 py-2 bg-gradient-to-r ${seasonalStyle.primary} text-white rounded-lg hover:opacity-90 transition-colors`}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!courierData) return null;

    // Fix for phone and location values
    const phoneNumber = courierData.profile?.phoneNumber || "Not provided";
    const location = courierData.profile?.location || "Not provided";

    return (
        <div
            className={`min-h-screen ${seasonalStyle.secondary} py-8 relative overflow-hidden`}
            style={{ backgroundImage: seasonalStyle.pattern }}
        >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <Tractor className="h-96 w-96 text-green-800" />
            </div>
            <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none">
                <Shovel className="h-96 w-96 text-green-800" />
            </div>
            <div className="absolute top-1/4 left-10 opacity-5 pointer-events-none">
                <Wheat className="h-64 w-64 text-green-800" />
            </div>
            <div className="absolute bottom-1/4 right-10 opacity-5 pointer-events-none">
                <Droplets className="h-64 w-64 text-green-800" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-center bg-white rounded-full py-2 px-6 shadow-md w-fit">
                        {seasonalStyle.icon}
                        <span className={`ml-2 font-medium ${seasonalStyle.accent}`}>
                            {seasonalStyle.name} Courier
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('/courier/map')}
                        className={`bg-white shadow-lg rounded-lg py-2.5 px-6 flex items-center space-x-3 hover:shadow-xl transition-all transform hover:scale-105 border ${seasonalStyle.border}`}
                    >
                        <div className={`p-2 ${seasonalStyle.highlight} rounded-full`}>
                            <MapPin className={`h-5 w-5 ${seasonalStyle.accent}`} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className={`font-medium ${seasonalStyle.accent}`}>
                                View Delivery Map
                            </span>
                            <span className="text-xs text-gray-500">
                                Find available orders
                            </span>
                        </div>
                    </button>
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
                    <div
                        className={`bg-gradient-to-r ${seasonalStyle.primary} h-48 relative`}
                    >
                        <div className="absolute inset-0 opacity-20">
                            {/* Farm-themed pattern overlay */}
                            <div className="absolute top-0 left-0 w-full h-full">
                                <div className="h-4 w-4 bg-white rounded-full absolute top-10 left-10 opacity-60"></div>
                                <div className="h-3 w-3 bg-white rounded-full absolute top-20 left-40 opacity-40"></div>
                                <div className="h-5 w-5 bg-white rounded-full absolute top-8 right-20 opacity-50"></div>
                                <div className="h-2 w-2 bg-white rounded-full absolute top-30 right-60 opacity-70"></div>
                                {/* Farm elements */}
                                <div className="absolute top-1/3 left-1/4 opacity-30">
                                    <Wheat className="h-10 w-10 text-white" />
                                </div>
                                <div className="absolute top-1/2 right-1/3 opacity-30">
                                    <Leaf className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                                    {courierData.profile?.profile ? (
                                        <img
                                            src={courierData.profile.profile}
                                            alt={courierData.fullName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className={`h-full w-full ${seasonalStyle.highlight} flex items-center justify-center`}
                                        >
                                            <User
                                                className={`h-16 w-16 ${seasonalStyle.light}`}
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    className={`absolute bottom-0 right-0 p-2 bg-gradient-to-r ${seasonalStyle.primary} rounded-full text-white hover:opacity-90 transition-opacity shadow-md`}
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-6 px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Basic Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                        {courierData.fullName || "Farm Courier"}
                                        {courierData.profile?.isVerified && (
                                            <span
                                                className={`ml-2 ${seasonalStyle.highlight} ${seasonalStyle.accent} text-xs px-2 py-1 rounded-full font-medium`}
                                            >
                                                Verified
                                            </span>
                                        )}
                                    </h1>
                                    <p
                                        className={`${seasonalStyle.accent} mt-1 font-medium`}
                                    >
                                        Farm Produce Delivery Partner
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        {courierData.profile?.description ||
                                            "Helping farmers deliver fresh produce to customers across the region."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className={`p-2 ${seasonalStyle.highlight} rounded-full flex-shrink-0`}
                                            >
                                                <Mail
                                                    className={`h-5 w-5 ${seasonalStyle.accent}`}
                                                />
                                            </div>
                                            <div className="flex flex-col mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Email
                                                </span>
                                                <span className="text-gray-700 font-medium break-all">
                                                    {courierData.email ||
                                                        "Not provided"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className={`p-2 ${seasonalStyle.highlight} rounded-full flex-shrink-0`}
                                            >
                                                <Phone
                                                    className={`h-5 w-5 ${seasonalStyle.accent}`}
                                                />
                                            </div>
                                            <div className="flex flex-col mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Phone
                                                </span>
                                                <span className="text-gray-700 font-medium">
                                                    {phoneNumber}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className={`p-2 ${seasonalStyle.highlight} rounded-full flex-shrink-0`}
                                            >
                                                <MapPin
                                                    className={`h-5 w-5 ${seasonalStyle.accent}`}
                                                />
                                            </div>
                                            <div className="flex flex-col mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Location
                                                </span>
                                                <span className="text-gray-700 font-medium">
                                                    {location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className={`p-2 ${seasonalStyle.highlight} rounded-full flex-shrink-0`}
                                            >
                                                <Truck
                                                    className={`h-5 w-5 ${seasonalStyle.accent}`}
                                                />
                                            </div>
                                            <div className="flex flex-col mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Vehicle Type
                                                </span>
                                                <span className="text-gray-700 font-medium">
                                                    {courierData.profile
                                                        ?.vehicleType ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className={`p-2 ${seasonalStyle.highlight} rounded-full flex-shrink-0`}
                                            >
                                                <Star
                                                    className={`h-5 w-5 ${seasonalStyle.accent}`}
                                                />
                                            </div>
                                            <div className="flex flex-col mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Rating
                                                </span>
                                                <span className="text-gray-700 font-medium">
                                                    {courierData.profile
                                                        ?.ratings ||
                                                        "No ratings yet"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div
                                                className={`p-2 ${seasonalStyle.highlight} rounded-full flex-shrink-0`}
                                            >
                                                <Shield
                                                    className={`h-5 w-5 ${seasonalStyle.accent}`}
                                                />
                                            </div>
                                            <div className="flex flex-col mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Verification Status
                                                </span>
                                                {courierData.profile
                                                    ?.isVerified ? (
                                                    <span className="text-green-600 flex items-center font-medium">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-600 flex items-center font-medium">
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Not Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div className="lg:col-span-1">
                                <div
                                    className={`${seasonalStyle.secondary} rounded-xl p-6 ${seasonalStyle.border} shadow-sm`}
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FileText
                                            className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                                        />
                                        Documents
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                            <p className="text-sm font-medium text-gray-600">
                                                License Number
                                            </p>
                                            <p className="text-gray-900 font-medium">
                                                {courierData.profile
                                                    ?.drivingLicenseNumber ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                            <p className="text-sm font-medium text-gray-600">
                                                ID Type
                                            </p>
                                            <p className="text-gray-900 font-medium">
                                                {courierData.profile
                                                    ?.identityVerification ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                            <p className="text-sm font-medium text-gray-600">
                                                Card Number
                                            </p>
                                            <p className="text-gray-900 font-medium">
                                                {courierData.profile
                                                    ?.cardNumber ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                                            <p className="text-sm font-medium text-gray-600">
                                                Date of Birth
                                            </p>
                                            <p className="text-gray-900 font-medium">
                                                {courierData.profile
                                                    ?.dateOfBirth
                                                    ? new Date(
                                                          courierData.profile.dateOfBirth
                                                      ).toLocaleDateString()
                                                    : "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Images */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FileText
                                className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                            />
                            License Document
                        </h3>
                        {courierData.profile?.licenseDocument ? (
                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img
                                    src={courierData.profile.licenseDocument}
                                    alt="License Document"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className={`w-full h-48 ${seasonalStyle.secondary} rounded-lg flex items-center justify-center ${seasonalStyle.border}`}
                            >
                                <div className="text-center">
                                    <FileText
                                        className={`h-10 w-10 mx-auto mb-2 ${seasonalStyle.accent}`}
                                    />
                                    <p className="text-gray-600">
                                        No license document uploaded
                                    </p>
                                    <button
                                        className={`mt-3 px-4 py-2 bg-gradient-to-r ${seasonalStyle.primary} text-white text-sm rounded-lg hover:opacity-90 transition-colors`}
                                    >
                                        Upload Document
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Shield
                                className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                            />
                            ID Proof
                        </h3>
                        {courierData.profile?.idProof ? (
                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img
                                    src={courierData.profile.idProof}
                                    alt="ID Proof"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className={`w-full h-48 ${seasonalStyle.secondary} rounded-lg flex items-center justify-center ${seasonalStyle.border}`}
                            >
                                <div className="text-center">
                                    <Shield
                                        className={`h-10 w-10 mx-auto mb-2 ${seasonalStyle.accent}`}
                                    />
                                    <p className="text-gray-600">
                                        No ID proof uploaded
                                    </p>
                                    <button
                                        className={`mt-3 px-4 py-2 bg-gradient-to-r ${seasonalStyle.primary} text-white text-sm rounded-lg hover:opacity-90 transition-colors`}
                                    >
                                        Upload Document
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Farm Delivery Areas */}
                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Tractor
                            className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                        />
                        Farm Delivery Areas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            "Local Farms",
                            "Urban Markets",
                            "Community Gardens",
                            "Farmers Markets",
                            "Rural Communities",
                            "Organic Farms",
                        ].map((area, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg ${seasonalStyle.secondary} ${seasonalStyle.border}`}
                            >
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-gray-700">
                                        {area}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Statistics */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Statistics */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Truck
                                className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                            />
                            Order Statistics
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                            >
                                <p className="text-sm text-gray-600 mb-1">
                                    Total Orders
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    {courierData.profile?.totalOrders || "0"}
                                </p>
                            </div>

                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                            >
                                <p className="text-sm text-gray-600 mb-1">
                                    Total Revenue
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                    ₹{courierData.profile?.totalRevenue || "0"}
                                </p>
                            </div>

                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                            >
                                <p className="text-sm text-gray-600 mb-1">
                                    Total Quantity
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    {courierData.profile?.totalQuantity || "0"}{" "}
                                    <span className="text-sm font-normal">
                                        units
                                    </span>
                                </p>
                            </div>

                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                            >
                                <p className="text-sm text-gray-600 mb-1">
                                    Pending Orders
                                </p>
                                <p className="text-xl font-bold text-amber-500">
                                    {courierData.profile?.pendingOrders || "0"}
                                </p>
                            </div>

                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                            >
                                <p className="text-sm text-gray-600 mb-1">
                                    Completed Orders
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                    {courierData.profile?.completedOrders ||
                                        "0"}
                                </p>
                            </div>

                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                            >
                                <p className="text-sm text-gray-600 mb-1">
                                    Canceled Orders
                                </p>
                                <p className="text-xl font-bold text-red-500">
                                    {courierData.profile?.canceledOrders || "0"}
                                </p>
                            </div>

                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                            >
                                <p className="text-sm text-gray-600 mb-1">
                                    Average Order
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                    ₹{courierData.profile?.averageOrder || "0"}
                                </p>
                            </div>

                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 ${seasonalStyle.border}`}
                            >
                                <p className="text-sm text-gray-600 mb-1">
                                    Highest Order
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                    ₹{courierData.profile?.highestOrder || "0"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Statistics */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FileText
                                className={`h-5 w-5 mr-2 ${seasonalStyle.accent}`}
                            />
                            Payment Statistics
                        </h3>

                        <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Cash Orders
                                        </p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {courierData.profile?.cashOrders ||
                                                "0"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Amount
                                        </p>
                                        <p className="text-xl font-bold text-green-600">
                                            ₹
                                            {courierData.profile?.cashAmount ||
                                                "0"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{
                                            width: `${
                                                courierData.profile
                                                    ?.cashPercentage || 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Online Orders
                                        </p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {courierData.profile
                                                ?.onlineOrders || "0"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Amount
                                        </p>
                                        <p className="text-xl font-bold text-green-600">
                                            ₹
                                            {courierData.profile
                                                ?.onlineAmount || "0"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{
                                            width: `${
                                                courierData.profile
                                                    ?.onlinePercentage || 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Pending Payments
                                        </p>
                                        <p className="text-xl font-bold text-amber-500">
                                            {courierData.profile
                                                ?.pendingPayments || "0"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Amount
                                        </p>
                                        <p className="text-xl font-bold text-amber-500">
                                            ₹
                                            {courierData.profile
                                                ?.pendingAmount || "0"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-amber-500 h-2.5 rounded-full"
                                        style={{
                                            width: `${
                                                courierData.profile
                                                    ?.pendingPercentage || 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div
                                className={`${seasonalStyle.secondary} rounded-lg p-4 mt-4 ${seasonalStyle.border}`}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-gray-800">
                                        Payment Success Rate
                                    </p>
                                    <p
                                        className={`font-bold ${seasonalStyle.accent}`}
                                    >
                                        {courierData.profile
                                            ?.paymentSuccessRate || "0"}
                                        %
                                    </p>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`bg-gradient-to-r ${seasonalStyle.primary} h-2.5 rounded-full`}
                                        style={{
                                            width: `${
                                                courierData.profile
                                                    ?.paymentSuccessRate || 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className={`bg-gradient-to-r ${seasonalStyle.primary} p-6`}>
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <Package className="h-6 w-6 mr-2" />
                                My Deliveries
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {orders
                                    .filter(order => order.status !== "completed")
                                    .map((order) => (
                                        <div
                                            key={order._id}
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowVerificationModal(true);
                                            }}
                                            className={`p-4 rounded-lg border ${seasonalStyle.border} cursor-pointer hover:shadow-md transition-shadow`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`font-medium ${seasonalStyle.accent}`}>
                                                    Order #{order._id.slice(-6)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-sm ${
                                                    order.status === 'completed'
                                                        ? 'bg-green-100 text-green-600'
                                                        : `${seasonalStyle.highlight} ${seasonalStyle.accent}`
                                                }`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <Package className={`h-4 w-4 mr-2 ${seasonalStyle.accent}`} />
                                                    <span className="text-gray-600">Quantity: {order.quantity}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className={`h-4 w-4 mr-2 ${seasonalStyle.accent}`} />
                                                    <span className="text-gray-600">{order.location}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <DollarSign className={`h-4 w-4 mr-2 ${seasonalStyle.accent}`} />
                                                    <span className="text-gray-600">₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                                                </div>
                                                <div className="flex items-center mt-2">
                                                    <span className={`text-sm ${
                                                        order.paymentStatus === 'completed' 
                                                            ? 'text-green-600' 
                                                            : 'text-amber-600'
                                                    }`}>
                                                        Payment: {order.paymentStatus} ({order.paymentMethod})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-2xl font-bold ${seasonalStyle.accent}`}>
                                Verify Delivery
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowVerificationModal(false);
                                    setVerificationCode('');
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className={`w-full px-4 py-2 border ${seasonalStyle.border} rounded-md focus:ring-2 focus:ring-opacity-50 focus:ring-current ${seasonalStyle.accent}`}
                                    placeholder="Enter the 6-digit code"
                                />
                            </div>

                            <button
                                onClick={handleVerification}
                                className={`w-full py-2 px-4 rounded-md text-white bg-gradient-to-r ${seasonalStyle.primary} hover:opacity-90 transition-opacity`}
                            >
                                Verify Delivery
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCourier;
