import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Package,
    Star,
    Truck,
    Edit,
    Camera,
    Tractor,
    Sprout,
    BarChart3,
    FileText,
    Clock,
    Sun,
    FileImage,
    ShoppingBag,
    ArrowUp,
    ArrowDown,
    ExternalLink,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

const FarmerProfilePage = () => {
    // Replace static farmer state with API data
    const [farmer, setFarmer] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        address: "",
        profileImage: null,
        memberSince: "",
    });

    // Add dashboard stats state
    const [dashboardStats, setDashboardStats] = useState({
        totalOrders: 0,
        totalAmount: 0,
        totalQuantity: 0,
        pendingOrders: 0,
        completedOrders: 0,
        averageOrderValue: 0,
        recentOrders: [],
    });

    // Fetch farmer profile and dashboard data
    useEffect(() => {
        const fetchFarmerData = async () => {
            try {
                const accessToken = localStorage.getItem("token");
                if (!accessToken) {
                    throw new Error("No access token found");
                }

                // Fetch auth data
                const authResponse = await fetch(
                    "http://localhost:3000/api/v1/auth",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const authData = await authResponse.json();

                if (authData.user) {
                    setFarmer({
                        displayName: authData.user.fullName,
                        email: authData.user.email,
                        phoneNumber: authData.user.profile?.phoneNumber || "",
                        address: authData.user.profile?.location || "",
                        profileImage: authData.user.profile?.profile || null,
                        memberSince: new Date(
                            authData.user.createdAt
                        ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        }),
                    });
                }

                // Fetch dashboard stats
                const dashboardResponse = await fetch(
                    "http://localhost:3000/api/v1/farmer/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const dashboardData = await dashboardResponse.json();

                setDashboardStats({
                    totalOrders: dashboardData.totalOrders,
                    totalAmount: dashboardData.totalAmount,
                    totalQuantity: dashboardData.totalQuantity,
                    pendingOrders: dashboardData.pendingOrders,
                    completedOrders: dashboardData.completedOrders,
                    averageOrderValue: dashboardData.averageOrderValue,
                    recentOrders: dashboardData.recentOrders,
                    cashOrders: dashboardData.cashOrders,
                    onlineOrders: dashboardData.onlineOrders,
                    pendingPayments: dashboardData.pendingPayments,
                    revenueFromCash: dashboardData.revenueFromCash,
                    revenueFromOnline: dashboardData.revenueFromOnline,
                    pendingRevenue: dashboardData.pendingRevenue,
                    highestOrderAmount: dashboardData.highestOrderAmount,
                    lowestOrderAmount: dashboardData.lowestOrderAmount,
                });
            } catch (error) {
                console.error("Error fetching farmer data:", error);
                // Handle error appropriately (show error message, redirect to login, etc.)
            }
        };

        fetchFarmerData();
    }, []);

    // Update cropInsights to be dynamic
    const [cropInsights, setCropInsights] = useState([]);

    // Functions to render activity icons
    const getActivityIcon = (type) => {
        switch (type) {
            case "pending":
                return <Clock className="h-6 w-6 text-amber-500" />;
            case "completed":
                return <ShoppingBag className="h-6 w-6 text-green-600" />;
            case "canceled":
                return <FileText className="h-6 w-6 text-red-500" />;
            default:
                return <Package className="h-6 w-6 text-gray-500" />;
        }
    };

    // Handle profile image upload
    const handleProfileImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                setFarmer({ ...farmer, profileImage: event.target.result });
            };

            reader.readAsDataURL(file);
        }
    };
    // Update the stats section to show more details
    const statsSection = (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Order Statistics</h3>
                <Star className="h-5 w-5 text-amber-400" />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium text-gray-800">
                        {dashboardStats.totalOrders}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-medium text-gray-800">
                        ₹{dashboardStats.totalAmount}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Quantity</span>
                    <span className="font-medium text-gray-800">
                        {dashboardStats.totalQuantity} units
                    </span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Pending Orders</span>
                    <span className="font-medium text-amber-600">
                        {dashboardStats.pendingOrders}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Completed Orders</span>
                    <span className="font-medium text-green-600">
                        {dashboardStats.completedOrders}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Canceled Orders</span>
                    <span className="font-medium text-red-600">
                        {dashboardStats.canceledOrders || 0}
                    </span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Average Order</span>
                    <span className="font-medium text-gray-800">
                        ₹{dashboardStats.averageOrderValue}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Highest Order</span>
                    <span className="font-medium text-gray-800">
                        ₹{dashboardStats.highestOrderAmount}
                    </span>
                </div>
            </div>
        </div>
    );

    // Add payment stats section
    const paymentStatsSection = (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">
                    Payment Statistics
                </h3>
                <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Cash Orders</span>
                    <div className="text-right">
                        <div className="font-medium text-gray-800">
                            {dashboardStats?.cashOrders || 0}
                        </div>
                        <div className="text-sm text-gray-500">
                            ₹{dashboardStats?.revenueFromCash || 0}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Online Orders</span>
                    <div className="text-right">
                        <div className="font-medium text-gray-800">
                            {dashboardStats.onlineOrders}
                        </div>
                        <div className="text-sm text-gray-500">
                            ₹{dashboardStats.revenueFromOnline}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Pending Payments</span>
                    <div className="text-right">
                        <div className="font-medium text-amber-600">
                            {dashboardStats.pendingPayments}
                        </div>
                        <div className="text-sm text-gray-500">
                            ₹{dashboardStats.pendingRevenue}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Chart data for orders
    const orderChartData = {
        labels: [
            "Total Orders",
            "Pending Orders",
            "Completed Orders",
            "Canceled Orders",
        ],
        datasets: [
            {
                label: "Order Statistics",
                data: [
                    dashboardStats.totalOrders,
                    dashboardStats.pendingOrders,
                    dashboardStats.completedOrders,
                    dashboardStats.canceledOrders || 0,
                ],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                ],
            },
        ],
    };

    // Chart data for payments
    const paymentChartData = {
        labels: ["Cash Orders", "Online Orders", "Pending Payments"],
        datasets: [
            {
                label: "Payment Statistics",
                data: [
                    dashboardStats.cashOrders || 0,
                    dashboardStats.onlineOrders || 0,
                    dashboardStats.pendingPayments || 0,
                ],
                backgroundColor: [
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8 relative">
            {/* Background image for the entire page */}
            <div className="absolute inset-0 z-0 opacity-10">
                <img
                    src="https://w0.peakpx.com/wallpaper/937/75/HD-wallpaper-greenery-farm-village-path-white-clouds-blue-sky-anime-background-anime-background.jpg"
                    alt="Farm background"
                    className="w-full h-full object-cover fixed"
                />
                <div className="absolute inset-0 bg-green-50/90 backdrop-blur-[2px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Profile Header Card */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
                    <div
                        className="h-40 relative"
                        style={{
                            backgroundImage:
                                "url('https://wallpapers.com/images/hd/japan-farm-anime-landscape-yvqut0t4ra7u0j6l.jpg')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="absolute -bottom-16 left-8 flex items-end">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                                    {farmer.profileImage ? (
                                        <img
                                            src={farmer.profileImage}
                                            alt={farmer.displayName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-green-100 flex items-center justify-center">
                                            <User className="h-16 w-16 text-green-600" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-0 right-0 bg-green-100 p-2 rounded-full cursor-pointer border-2 border-white shadow-md hover:bg-green-200 transition-colors"
                                >
                                    <Camera className="h-4 w-4 text-green-600" />
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
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    {farmer.displayName}
                                </h1>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <span className="font-semibold">
                                        Farmer
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-600">
                                        Member since {farmer.memberSince}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-6 top-6">
                            <button className="bg-white/20 hover:bg-white/30 transition rounded-lg px-4 py-2 text-white font-medium backdrop-blur-sm flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="pt-20 pb-6 px-8">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Contact Information */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-1">
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-green-600 mr-3" />
                                        <span className="text-gray-800">
                                            {farmer.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="flex items-center">
                                        <Phone className="h-5 w-5 text-green-600 mr-3" />
                                        <span className="text-gray-800">
                                            {farmer.phoneNumber}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-green-600 mr-3" />
                                        <span className="text-gray-800">
                                            Joined {farmer.memberSince}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-green-600 mr-3 mt-1" />
                                <span className="text-gray-800">
                                    {farmer.address}
                                </span>
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-2 gap-6 mt-6">
                                {/* Order Statistics */}
                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-green-800">
                                            Order Statistics{" "}
                                        </h3>
                                        <Star className="h-5 w-5 text-amber-400" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Total Orders
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {dashboardStats.totalOrders}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Total Revenue
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    ₹
                                                    {dashboardStats.totalAmount}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Total Quantity
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {
                                                        dashboardStats.totalQuantity
                                                    }{" "}
                                                    units
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Pending
                                                </span>
                                                <span className="font-medium text-amber-600">
                                                    {
                                                        dashboardStats.pendingOrders
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Completed
                                                </span>
                                                <span className="font-medium text-green-600">
                                                    {
                                                        dashboardStats.completedOrders
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Canceled
                                                </span>
                                                <span className="font-medium text-red-600">
                                                    {dashboardStats.canceledOrders ||
                                                        0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Statistics */}
                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-medium text-green-800">
                                            Payment Statistics
                                        </h3>
                                        <FileText className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white rounded-lg p-3">
                                                <div className="text-sm text-gray-600">
                                                    Cash Orders
                                                </div>
                                                <div className="font-medium text-gray-800 mt-1">
                                                    {dashboardStats?.cashOrders ||
                                                        0}
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        ₹
                                                        {dashboardStats?.revenueFromCash ||
                                                            0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3">
                                                <div className="text-sm text-gray-600">
                                                    Online Orders
                                                </div>
                                                <div className="font-medium text-gray-800 mt-1">
                                                    {
                                                        dashboardStats.onlineOrders
                                                    }
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        ₹
                                                        {
                                                            dashboardStats.revenueFromOnline
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-amber-50 rounded-lg p-3">
                                            <div className="text-sm text-amber-800">
                                                Pending Payments
                                            </div>
                                            <div className="font-medium text-amber-900 mt-1">
                                                {dashboardStats.pendingPayments}
                                                <span className="text-sm text-amber-700 ml-2">
                                                    ₹
                                                    {
                                                        dashboardStats.pendingRevenue
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Produce Section - Enhanced UI */}
                <div className="bg-white shadow-xl rounded-xl p-6 relative overflow-hidden mb-6 border border-green-100">
                    {/* Background image with improved styling */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://w0.peakpx.com/wallpaper/937/75/HD-wallpaper-greenery-farm-village-path-white-clouds-blue-sky-anime-background-anime-background.jpg"
                            alt="Farm background"
                            className="w-full h-full object-cover opacity-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/90 to-green-50/90"></div>
                    </div>

                    {/* Enhanced header */}
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2.5 rounded-full mr-3">
                                    <Sprout className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Add Produce
                                </h2>
                            </div>
                            <div className="bg-green-50 px-3 py-1 rounded-full text-sm text-green-700 font-medium border border-green-100">
                                {cropInsights.length} Crops Listed
                            </div>
                        </div>

                        {/* Improved crop list */}
                        <div className="space-y-4 mb-5">
                            {cropInsights.map((crop, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 hover:border-green-200"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                                                <img
                                                    src={`/assets/crops/${crop.name
                                                        .toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )}.png`}
                                                    alt={crop.name}
                                                    className="w-6 h-6"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            "/assets/crops/default.png";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-800">
                                                    {crop.name}
                                                </span>
                                                <div className="text-xs text-gray-500">
                                                    Last updated: Today
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`flex items-center ${
                                                crop.status === "up"
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {crop.status === "up" ? (
                                                <ArrowUp className="h-4 w-4 mr-1" />
                                            ) : (
                                                <ArrowDown className="h-4 w-4 mr-1" />
                                            )}
                                            <span className="text-sm font-medium">
                                                {Math.abs(crop.growth)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${
                                                crop.status === "up"
                                                    ? "bg-green-500"
                                                    : "bg-amber-500"
                                            }`}
                                            style={{
                                                width: `${
                                                    60 +
                                                    (crop.growth > 0
                                                        ? crop.growth
                                                        : 0)
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Enhanced button */}
                        <a
                            href="/product/listing"
                            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 transition-all duration-300 py-4 rounded-xl font-medium flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <div className="bg-white/20 p-1.5 rounded-full mr-3">
                                <Plus className="h-5 w-5" />
                            </div>
                            Add New Crop
                        </a>

                        {/* Added helpful tip */}
                        <div className="mt-4 text-center text-sm text-gray-500 bg-green-50/50 p-2 rounded-lg border border-green-100/50">
                            <span className="text-green-700">Tip:</span> Adding
                            your produce helps customers discover your farm
                            products
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Order Statistics
                        </h2>
                        <Bar
                            data={orderChartData}
                            options={{ responsive: true }}
                        />
                    </div>
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Payment Statistics
                        </h2>
                        <Bar
                            data={paymentChartData}
                            options={{ responsive: true }}
                        />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Weather Card (moved down) */}
                    <div className="col-span-1">
                        <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Sun className="h-5 w-5 mr-2 text-amber-500" />
                                Weather Forecast
                            </h2>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <Sun className="h-10 w-10 text-amber-500" />
                                </div>
                                <div className="text-2xl font-bold text-gray-800">
                                    28°C
                                </div>
                                <div className="text-gray-600">
                                    Partly Cloudy
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    Mehsana, Gujarat
                                </div>
                                <div className="border-t border-blue-200 mt-4 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Humidity: 65%</span>
                                        <span>Wind: 12 km/h</span>
                                    </div>
                                </div>
                            </div>
                            <a
                                href="#"
                                className="block w-full mt-3 text-center text-blue-600 text-sm hover:underline"
                            >
                                View 7-day forecast
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Recent Activity */}
                    <div className="col-span-2">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-green-600" />
                                Recent Activity
                            </h2>

                            <div className="space-y-6">
                                {dashboardStats?.recentOrders?.map((order) => (
                                    <div key={order._id} className="flex">
                                        <div className="mr-4">
                                            <div className="bg-green-100 p-3 rounded-full">
                                                {getActivityIcon(order.status)}
                                            </div>
                                        </div>
                                        <div className="flex-1 border-b border-gray-100 pb-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-lg text-gray-800">
                                                        Order #
                                                        {order._id.slice(-6)}
                                                    </h3>
                                                    <p className="text-gray-600 mt-1">
                                                        Quantity:{" "}
                                                        {order.quantity} units
                                                        <br />
                                                        Total Amount: ₹
                                                        {order.totalAmount}
                                                        <br />
                                                        Payment Method:{" "}
                                                        {order.paymentMethod}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-1 mt-2 rounded-full ${
                                                            order.status ===
                                                            "completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : order.status ===
                                                                  "pending"
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {order.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            order.status.slice(
                                                                1
                                                            )}
                                                    </span>
                                                    <span
                                                        className={`text-xs px-2 py-1 mt-1 rounded-full ${
                                                            order.paymentStatus ===
                                                            "completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-amber-100 text-amber-700"
                                                        }`}
                                                    >
                                                        Payment:{" "}
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-sm text-gray-600">
                                                    Delivery Location:{" "}
                                                    {order.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-4 bg-green-50 hover:bg-green-100 text-green-700 transition py-3 rounded-lg font-medium">
                                View All Activity
                            </button>
                        </div>

                        {/* Marketplace Trends */}
                        {/* <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                                Order  is 
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Count
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Revenue
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                Cash Orders
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {dashboardStats?.cashOrders || 0}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                ₹
                                                {dashboardStats.revenueFromCash ||
                                                    0}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                Online Orders
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {dashboardStats.onlineOrders ||
                                                    0}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                ₹
                                                {dashboardStats.revenueFromOnline ||
                                                    0}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                Pending Revenue
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {dashboardStats.pendingPayments ||
                                                    0}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                ₹
                                                {dashboardStats.pendingRevenue ||
                                                    0}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white transition py-3 rounded-lg font-medium">
                                List Produce for Sale
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Additional Plus icon since it's not imported at the top
const Plus = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default FarmerProfilePage;
