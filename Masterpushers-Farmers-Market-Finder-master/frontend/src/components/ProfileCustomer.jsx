import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
    Heart,
    Camera,
    AlertCircle,
    Leaf,
    Tractor,
    Apple,
    Wheat,
    Sun,
    Cloud,
    Droplets,
    Sprout,
} from "lucide-react";

const ProfileCustomer = () => {
    const [customerData, setCustomerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [season, setSeason] = useState("summer"); // spring, summer, autumn, winter
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    useEffect(() => {
        // Determine season based on current month
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) setSeason("spring");
        else if (month >= 5 && month <= 7) setSeason("summer");
        else if (month >= 8 && month <= 10) setSeason("autumn");
        else setSeason("winter");

        const fetchCustomerProfile = async () => {
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
                setCustomerData(data.user);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        const fetchCustomerOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await fetch(
                    "http://localhost:3000/api/v1/order/customer",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch order data");
                }

                const data = await response.json();
                setOrders(data.orders || []);
                setOrdersLoading(false);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setOrdersError(err.message);
                setOrdersLoading(false);
            }
        };

        fetchCustomerProfile();
        fetchCustomerOrders();
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
                };
            case "summer":
                return {
                    primary: "from-green-600 to-yellow-500",
                    secondary: "bg-green-50",
                    accent: "text-green-600",
                    icon: <Sun className="h-6 w-6 text-yellow-500" />,
                    name: "Summer",
                };
            case "autumn":
                return {
                    primary: "from-orange-500 to-amber-400",
                    secondary: "bg-amber-50",
                    accent: "text-amber-600",
                    icon: <Wheat className="h-6 w-6 text-amber-500" />,
                    name: "Autumn",
                };
            case "winter":
                return {
                    primary: "from-blue-500 to-indigo-400",
                    secondary: "bg-blue-50",
                    accent: "text-blue-600",
                    icon: <Cloud className="h-6 w-6 text-blue-500" />,
                    name: "Winter",
                };
            default:
                return {
                    primary: "from-green-600 to-green-500",
                    secondary: "bg-green-50",
                    accent: "text-green-600",
                    icon: <Leaf className="h-6 w-6 text-green-500" />,
                    name: "Harvest",
                };
        }
    };

    const seasonalStyle = getSeasonalStyles();

    // Helper function to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Helper function to get status badge styling
    const getStatusBadgeStyle = (status, type = "status") => {
        if (type === "status") {
            switch (status) {
                case "completed":
                    return "bg-green-100 text-green-800";
                case "delivering":
                    return "bg-blue-100 text-blue-800";
                case "pending":
                    return "bg-amber-100 text-amber-800";
                case "cancelled":
                    return "bg-red-100 text-red-800";
                default:
                    return "bg-gray-100 text-gray-800";
            }
        } else if (type === "payment") {
            switch (status) {
                case "completed":
                    return "bg-green-100 text-green-800";
                case "pending":
                    return "bg-amber-100 text-amber-800";
                case "failed":
                    return "bg-red-100 text-red-800";
                default:
                    return "bg-gray-100 text-gray-800";
            }
        }
    };

    // Add a function to handle order click and show popup
    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    // Add a function to close the modal
    const closeOrderModal = () => {
        setShowOrderModal(false);
        setSelectedOrder(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
                        <Sprout className="absolute top-4 left-6 h-8 w-8 text-green-600" />
                    </div>
                    <p className="mt-6 text-green-800 font-medium">
                        Harvesting your profile data...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-100 max-w-md">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Something went wrong
                    </h3>
                    <p className="text-gray-600 mt-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!customerData) return null;

    return (
        <div
            className={`min-h-screen ${seasonalStyle.secondary} py-8 relative overflow-hidden`}
        >
            {/* Decorative farm elements */}
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <Wheat className="h-96 w-96 text-green-800" />
            </div>
            <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none">
                <Apple className="h-96 w-96 text-green-800" />
            </div>
            <div className="absolute top-1/4 left-10 opacity-5 pointer-events-none">
                <Tractor className="h-64 w-64 text-green-800" />
            </div>
            <div className="absolute bottom-1/4 right-10 opacity-5 pointer-events-none">
                <Leaf className="h-64 w-64 text-green-800" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Season indicator */}
                <div className="flex items-center justify-center mb-6 bg-white rounded-full py-2 px-6 shadow-md w-fit mx-auto">
                    {seasonalStyle.icon}
                    <span
                        className={`ml-2 font-medium ${seasonalStyle.accent}`}
                    >
                        {seasonalStyle.name} Season
                    </span>
                </div>

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
                    <div
                        className={`bg-gradient-to-r ${seasonalStyle.primary} h-48 relative`}
                    >
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full">
                                <div className="h-4 w-4 bg-white rounded-full absolute top-10 left-10 opacity-60"></div>
                                <div className="h-3 w-3 bg-white rounded-full absolute top-20 left-40 opacity-40"></div>
                                <div className="h-5 w-5 bg-white rounded-full absolute top-8 right-20 opacity-50"></div>
                                <div className="h-2 w-2 bg-white rounded-full absolute top-30 right-60 opacity-70"></div>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <Leaf className="h-6 w-6 text-white opacity-70" />
                            <Tractor className="h-6 w-6 text-white opacity-70" />
                        </div>
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                                    {customerData.profile?.profile ? (
                                        <img
                                            src={customerData.profile.profile}
                                            alt={customerData.fullName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-full w-full p-4 text-gray-400" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full text-white hover:bg-green-600 shadow-md transition-all transform hover:scale-105">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-6 px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-green-900">
                                        {customerData.fullName}
                                    </h1>
                                    <div className="flex items-center mt-1 text-green-700">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <p>
                                            Farm supporter since{" "}
                                            {new Date(
                                                customerData.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`space-y-4 ${seasonalStyle.secondary} p-5 rounded-xl border border-green-100 shadow-sm`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                            <Mail
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <span className="text-gray-700">
                                            {customerData.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                            <Phone
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <span className="text-gray-700">
                                            {customerData.profile?.phoneNumber}
                                        </span>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-white rounded-full shadow-sm mt-1">
                                            <MapPin
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <span className="text-gray-700">
                                            {customerData.profile?.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm transform transition-transform hover:scale-105">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div
                                            className={`p-2 ${seasonalStyle.secondary} rounded-full`}
                                        >
                                            <ShoppingBag
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <h3 className="font-semibold text-green-800">
                                            Farm Orders
                                        </h3>
                                    </div>
                                    <p className="text-3xl font-bold text-green-900">
                                        {orders.length ||
                                            0}
                                    </p>
                                    <p
                                        className={`${seasonalStyle.accent} text-sm mt-1`}
                                    >
                                        Fresh produce purchases
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm transform transition-transform hover:scale-105">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="p-2 bg-red-50 rounded-full">
                                            <Heart className="h-5 w-5 text-red-500" />
                                        </div>
                                        <h3 className="font-semibold text-green-800">
                                            Wishlist
                                        </h3>
                                    </div>
                                    <p className="text-3xl font-bold text-green-900">
                                        {customerData.profile?.wishlist
                                            ?.length || 0}
                                    </p>
                                    <p
                                        className={`${seasonalStyle.accent} text-sm mt-1`}
                                    >
                                        Saved farm products
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-green-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div
                                className={`p-2 ${seasonalStyle.secondary} rounded-full mr-3`}
                            >
                                <Apple
                                    className={`h-5 w-5 ${seasonalStyle.accent}`}
                                />
                            </div>
                            <h2 className="text-xl font-bold text-green-900">
                                Your Harvest History
                            </h2>
                        </div>
                        <div className="text-sm text-gray-500">
                            {!ordersLoading && !ordersError && (
                                <span>
                                    {orders.length} order
                                    {orders.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                    </div>

                    {ordersLoading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-3 text-green-800">
                                Gathering your harvest history...
                            </p>
                        </div>
                    ) : ordersError ? (
                        <div className="text-center py-6 bg-red-50 rounded-xl border border-red-100">
                            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <p className="text-red-600">{ordersError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-3 px-4 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className={`border ${seasonalStyle.secondary} border-green-100 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer`}
                                    onClick={() => handleOrderClick(order)}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Order date and ID */}
                                        <div className="w-full md:w-2/12 bg-white p-4 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-green-100">
                                            <p className="text-sm text-gray-500">
                                                Order Date
                                            </p>
                                            <p className="font-medium text-green-900">
                                                {formatDate(order.createdAt)}
                                            </p>
                                            <div className="mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                                ID:{" "}
                                                {order._id.substring(
                                                    order._id.length - 6
                                                )}
                                            </div>
                                        </div>

                                        {/* Order details */}
                                        <div className="w-full md:w-7/12 bg-white p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <ShoppingBag
                                                        className={`h-4 w-4 mr-2 ${seasonalStyle.accent}`}
                                                    />
                                                    <h3 className="font-semibold text-green-900">
                                                        {order.product &&
                                                            `Product: ${order.product.substring(
                                                                0,
                                                                10
                                                            )}...`}
                                                    </h3>
                                                </div>
                                                {/* Add pickup ready badge */}
                                                {order.isAvailable ===
                                                    false && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                                        Ready for Pickup
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Quantity
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        {order.quantity}{" "}
                                                        {order.quantity === 1
                                                            ? "item"
                                                            : "items"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-sm font-medium">
                                                        ₹{order.totalAmount}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500">
                                                    Delivery Location
                                                </p>
                                                <div className="flex items-start mt-1">
                                                    <MapPin className="h-3.5 w-3.5 text-gray-500 mr-1 mt-0.5" />
                                                    <p className="text-sm text-gray-700">
                                                        {order.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order status */}
                                        <div className="w-full md:w-3/12 p-4 flex flex-col justify-center space-y-2 bg-white">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Order Status
                                                </p>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        order.status.slice(1)}
                                                </span>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Payment Status
                                                </p>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                                                        order.paymentStatus,
                                                        "payment"
                                                    )}`}
                                                >
                                                    {order.paymentStatus
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        order.paymentStatus.slice(
                                                            1
                                                        )}
                                                </span>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Payment Method
                                                </p>
                                                <p className="text-sm font-medium capitalize">
                                                    {order.paymentMethod}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className={`text-center py-10 ${seasonalStyle.secondary} rounded-xl border border-green-100`}
                        >
                            <div className="w-24 h-24 mx-auto mb-4 relative">
                                <div className="absolute inset-0 bg-white rounded-full opacity-60"></div>
                                <ShoppingBag
                                    className={`h-16 w-16 absolute inset-0 m-auto ${seasonalStyle.accent}`}
                                />
                            </div>
                            <h3 className="text-lg font-medium text-green-800">
                                Your field is ready for planting
                            </h3>
                            <p
                                className={`${seasonalStyle.accent} mt-2 max-w-md mx-auto`}
                            >
                                Your farm-to-table journey begins with your
                                first purchase. Explore our marketplace to find
                                fresh, locally-grown produce!
                            </p>
                            <button
                                className={`mt-4 px-6 py-2 bg-gradient-to-r ${seasonalStyle.primary} text-white rounded-lg hover:opacity-90 transition-all shadow-md`}
                            >
                                Browse {seasonalStyle.name} Harvest
                            </button>
                        </div>
                    )}
                </div>

                {/* Seasonal Recommendations */}
                <div className="mt-8">
                    <div className="flex items-center mb-4">
                        <div
                            className={`p-2 ${seasonalStyle.secondary} rounded-full mr-3`}
                        >
                            {seasonalStyle.icon}
                        </div>
                        <h2 className="text-xl font-bold text-green-900">
                            {seasonalStyle.name} Season Picks
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {season === "spring" && (
                            <>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Sprout className="h-8 w-8 text-emerald-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Spring Greens
                                    </h3>
                                    <p className="text-emerald-600 text-sm">
                                        Fresh spinach, lettuce, and asparagus
                                        from local farms
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Droplets className="h-8 w-8 text-emerald-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Fresh Herbs
                                    </h3>
                                    <p className="text-emerald-600 text-sm">
                                        Mint, basil, and cilantro grown in
                                        sustainable gardens
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Leaf className="h-8 w-8 text-emerald-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Early Berries
                                    </h3>
                                    <p className="text-emerald-600 text-sm">
                                        First strawberries of the season from
                                        nearby fields
                                    </p>
                                </div>
                            </>
                        )}

                        {season === "summer" && (
                            <>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Sun className="h-8 w-8 text-yellow-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Summer Fruits
                                    </h3>
                                    <p className="text-green-600 text-sm">
                                        Juicy peaches, watermelons, and cherries
                                        at peak ripeness
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Tractor className="h-8 w-8 text-yellow-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Garden Vegetables
                                    </h3>
                                    <p className="text-green-600 text-sm">
                                        Tomatoes, cucumbers, and peppers from
                                        local gardens
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Apple className="h-8 w-8 text-yellow-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Fresh Corn
                                    </h3>
                                    <p className="text-green-600 text-sm">
                                        Sweet corn picked at the perfect moment
                                    </p>
                                </div>
                            </>
                        )}

                        {season === "autumn" && (
                            <>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Wheat className="h-8 w-8 text-amber-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Fall Harvest
                                    </h3>
                                    <p className="text-amber-600 text-sm">
                                        Pumpkins, squash, and gourds from local
                                        farms
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Apple className="h-8 w-8 text-amber-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Apple Varieties
                                    </h3>
                                    <p className="text-amber-600 text-sm">
                                        Crisp apples in multiple varieties from
                                        nearby orchards
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Leaf className="h-8 w-8 text-amber-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Root Vegetables
                                    </h3>
                                    <p className="text-amber-600 text-sm">
                                        Carrots, potatoes, and beets harvested
                                        at peak flavor
                                    </p>
                                </div>
                            </>
                        )}

                        {season === "winter" && (
                            <>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Cloud className="h-8 w-8 text-blue-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Winter Greens
                                    </h3>
                                    <p className="text-blue-600 text-sm">
                                        Kale, collards, and other hardy greens
                                        from covered farms
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Wheat className="h-8 w-8 text-blue-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Stored Harvest
                                    </h3>
                                    <p className="text-blue-600 text-sm">
                                        Properly stored apples, potatoes, and
                                        winter squash
                                    </p>
                                </div>
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 transform transition-all hover:shadow-md hover:-translate-y-1">
                                    <Sprout className="h-8 w-8 text-blue-500 mb-3" />
                                    <h3 className="font-semibold text-green-800 mb-2">
                                        Indoor Grown
                                    </h3>
                                    <p className="text-blue-600 text-sm">
                                        Microgreens, sprouts, and herbs from
                                        indoor farms
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Order detail modal/popup */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div
                        className={`bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
                    >
                        {/* Modal header */}
                        <div
                            className={`p-4 bg-gradient-to-r ${seasonalStyle.primary} rounded-t-xl`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">
                                    Order Details
                                </h3>
                                <button
                                    onClick={closeOrderModal}
                                    className="text-white hover:text-gray-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center mt-2">
                                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                    <span className="text-white text-sm">
                                        Order #
                                        {selectedOrder._id.substring(
                                            selectedOrder._id.length - 6
                                        )}
                                    </span>
                                </div>
                                {selectedOrder.isAvailable === false && (
                                    <div className="ml-2 bg-green-600 bg-opacity-90 px-3 py-1 rounded-full">
                                        <span className="text-white text-sm font-medium">
                                            Ready for Pickup
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Order Info */}
                                <div
                                    className={`${seasonalStyle.secondary} p-4 rounded-xl`}
                                >
                                    <h4 className="font-semibold text-green-900 mb-3">
                                        Order Information
                                    </h4>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Product ID
                                            </p>
                                            <p className="text-sm font-medium text-green-900">
                                                {selectedOrder.product}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Farmer ID
                                            </p>
                                            <p className="text-sm font-medium text-green-900">
                                                {selectedOrder.farmer}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Quantity
                                            </p>
                                            <p className="text-sm font-medium text-green-900">
                                                {selectedOrder.quantity} items
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Total Amount
                                            </p>
                                            <p className="text-lg font-bold text-green-900">
                                                ₹{selectedOrder.totalAmount}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Order Created
                                            </p>
                                            <p className="text-sm font-medium text-green-900">
                                                {new Date(
                                                    selectedOrder.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Last Updated
                                            </p>
                                            <p className="text-sm font-medium text-green-900">
                                                {new Date(
                                                    selectedOrder.updatedAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Info */}
                                <div
                                    className={`${seasonalStyle.secondary} p-4 rounded-xl`}
                                >
                                    <h4 className="font-semibold text-green-900 mb-3">
                                        Status & Delivery
                                    </h4>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Order Status
                                            </p>
                                            <span
                                                className={`inline-block px-3 py-1 mt-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                                                    selectedOrder.status
                                                )}`}
                                            >
                                                {selectedOrder.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    selectedOrder.status.slice(
                                                        1
                                                    )}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Payment Status
                                            </p>
                                            <span
                                                className={`inline-block px-3 py-1 mt-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(
                                                    selectedOrder.paymentStatus,
                                                    "payment"
                                                )}`}
                                            >
                                                {selectedOrder.paymentStatus
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    selectedOrder.paymentStatus.slice(
                                                        1
                                                    )}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Payment Method
                                            </p>
                                            <div className="flex items-center mt-1">
                                                {selectedOrder.paymentMethod ===
                                                "online" ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-blue-500 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-green-500 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                )}
                                                <span className="text-sm font-medium capitalize">
                                                    {
                                                        selectedOrder.paymentMethod
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Delivery Location
                                            </p>
                                            <div className="flex items-start mt-1">
                                                <MapPin className="h-4 w-4 text-gray-600 mr-1 mt-0.5" />
                                                <p className="text-sm text-gray-700">
                                                    {selectedOrder.location}
                                                </p>
                                            </div>
                                        </div>

                                        {selectedOrder.courier && (
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Courier ID
                                                </p>
                                                <p className="text-sm font-medium text-green-900">
                                                    {selectedOrder.courier}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={closeOrderModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Close
                                </button>

                                {selectedOrder.isAvailable === false && (
                                    <button
                                        className={`px-4 py-2 bg-gradient-to-r ${seasonalStyle.primary} text-white rounded-lg hover:opacity-90`}
                                    >
                                        Confirm Pickup
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCustomer;
