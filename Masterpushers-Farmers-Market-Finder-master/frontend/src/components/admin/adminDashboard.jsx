import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../../config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "../ui/input";
import {
    Users,
    Package,
    Truck,
    LogOut,
    Menu,
    X,
    Home,
    User,
    Settings,
    Bell,
    Search,
    ChevronDown,
    Shield,
    Clock,
    Check,
} from "lucide-react";
import CouriersList from "./CouriersList";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        totalCouriers: 0,
        verifiedCouriers: 0,
        pendingCouriers: 0,
        activeDeliveries: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE_URL}/api/v1/courier/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                const couriers = response.data.data; // Assuming the data contains the list of couriers

                const totalCouriers = couriers.length; // Total couriers
                const verifiedCouriers = couriers.filter(courier => courier.isVerified === true ).length; 
                console.log("verified",verifiedCouriers);
                // Count verified couriers
                const pendingCouriers = couriers.filter(courier => courier.isVerified === false).length; // Count pending couriers
console.log("pedning",pendingCouriers);


                setStats({
                    totalCouriers: totalCouriers || 0,
                    verifiedCouriers: verifiedCouriers || 0,
                    pendingCouriers: pendingCouriers || 0,
                    activeDeliveries: 0, // Set this as needed
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/admin/login");
            }
            // Initialize with zeros instead of mock data
            setStats({
                totalCouriers: 0,
                verifiedCouriers: 0,
                pendingCouriers: 0,
                activeDeliveries: 0,
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/admin/login");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? "w-64" : "w-20"
                } bg-white shadow-lg transition-all duration-300 flex flex-col fixed h-full z-10`}
            >
                <div className="p-5 flex items-center justify-between border-b">
                    <div
                        className={`flex items-center ${
                            !sidebarOpen && "justify-center w-full"
                        }`}
                    >
                        <Shield className="h-8 w-8 text-green-600" />
                        {sidebarOpen && (
                            <span className="ml-3 text-xl font-bold text-green-700">
                                Admin Portal
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`text-gray-500 hover:text-green-600 transition-colors ${
                            !sidebarOpen && "hidden"
                        }`}
                    >
                        {sidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="px-3 space-y-2">
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-3 text-green-600 bg-green-50 rounded-lg font-medium shadow-sm"
                        >
                            <Home className="h-5 w-5" />
                            {sidebarOpen && (
                                <span className="ml-3">Dashboard</span>
                            )}
                        </Link>
                        <Link
                            to="/admin/couriers"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors"
                        >
                            <Users className="h-5 w-5" />
                            {sidebarOpen && (
                                <span className="ml-3">Couriers</span>
                            )}
                        </Link>
                        <Link
                            to="/admin/settings"
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-green-600 rounded-lg transition-colors"
                        >
                            <Settings className="h-5 w-5" />
                            {sidebarOpen && (
                                <span className="ml-3">Settings</span>
                            )}
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-4 py-2 w-full transition-colors ${
                            !sidebarOpen && "justify-center"
                        }`}
                    >
                        <LogOut className="h-5 w-5" />
                        {sidebarOpen && (
                            <span className="ml-2 font-medium">Logout</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 ${
                    sidebarOpen ? "ml-64" : "ml-20"
                } transition-all duration-300`}
            >
                {/* Top Navigation */}
                <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mr-4 text-gray-500 hover:text-green-600 transition-colors lg:hidden"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center space-x-5">
                        <div className="relative">
                            <Bell className="h-6 w-6 text-gray-500 hover:text-green-600 cursor-pointer transition-colors" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </div>

                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-semibold shadow-md">
                                A
                            </div>
                            <div className="ml-3 hidden md:block">
                                <p className="text-sm font-medium text-gray-800">
                                    Admin User
                                </p>
                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>
                            </div>
                            <ChevronDown className="h-4 w-4 ml-2 text-gray-500 hidden md:block" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6 md:p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-1 bg-blue-500"></div>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Total Couriers
                                        </p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                            {stats.totalCouriers}
                                            {stats.totalCouriers > 0 && (
                                                <span className="text-xs font-medium text-green-600 ml-2 bg-green-100 px-2 py-1 rounded-full">
                                                    Active
                                                </span>
                                            )}
                                        </h3>
                                    </div>
                                    <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                                        <Users className="h-7 w-7 text-blue-600" />
                                    </div>
                                </div>
                                {stats.totalCouriers > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 flex items-center">
                                            <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                            Updated just now
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-1 bg-green-500"></div>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Verified Couriers
                                        </p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                            {stats.verifiedCouriers}
                                            {stats.totalCouriers > 0 && (
                                                <span className="text-xs ml-2 text-gray-600">
                                                    (
                                                    {Math.round(
                                                        (stats.verifiedCouriers /
                                                            stats.totalCouriers) *
                                                            100
                                                    )}
                                                    %)
                                                </span>
                                            )}
                                        </h3>
                                    </div>
                                    <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                                        <User className="h-7 w-7 text-green-600" />
                                    </div>
                                </div>
                                {stats.verifiedCouriers > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{
                                                    width: `${Math.round(
                                                        (stats.verifiedCouriers /
                                                            stats.totalCouriers) *
                                                            100
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-1 bg-amber-500"></div>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Pending Verification
                                        </p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                            {stats.pendingCouriers}
                                            {stats.pendingCouriers > 0 && (
                                                <span className="text-xs font-medium text-amber-600 ml-2 bg-amber-100 px-2 py-1 rounded-full">
                                                    Needs Review
                                                </span>
                                            )}
                                        </h3>
                                    </div>
                                    <div className="h-14 w-14 bg-amber-100 rounded-full flex items-center justify-center shadow-sm">
                                        <Clock className="h-7 w-7 text-amber-600" />
                                    </div>
                                </div>
                                {stats.pendingCouriers > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-amber-600 flex items-center">
                                            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                                            {stats.pendingCouriers} courier
                                            {stats.pendingCouriers !== 1
                                                ? "s"
                                                : ""}{" "}
                                            awaiting review
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                            <div className="h-1 bg-purple-500"></div>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Active Deliveries
                                        </p>
                                        <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                            {stats.activeDeliveries}
                                            {stats.activeDeliveries > 0 && (
                                                <span className="text-xs font-medium text-purple-600 ml-2 bg-purple-100 px-2 py-1 rounded-full">
                                                    Live
                                                </span>
                                            )}
                                        </h3>
                                    </div>
                                    <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center shadow-sm">
                                        <Truck className="h-7 w-7 text-purple-600" />
                                    </div>
                                </div>
                                {stats.activeDeliveries > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">
                                            Avg delivery time:{" "}
                                            <span className="font-medium">
                                                32 min
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card> */}
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="couriers" className="w-full">
                        <TabsList className="grid w-full md:w-1/2 grid-cols-2 mb-6 p-1 bg-gray-100 rounded-lg">
                            <TabsTrigger
                                value="couriers"
                                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                Couriers Management
                            </TabsTrigger>
                            <TabsTrigger
                                value="overview"
                                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                System Overview
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="couriers">
                            <Card className="border-none shadow-md">
                                {/* <CardHeader className="border-b bg-gray-50 rounded-t-lg"> */}
                                    <div className="flex items-center justify-between">
                                        {/* <CardTitle className="text-gray-800">
                                            Couriers List
                                        </CardTitle>
                                        <div className="flex space-x-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder="Search couriers..."
                                                    className="pl-9 w-64 border-gray-200 focus:border-green-500 focus:ring-green-500"
                                                />
                                            </div>
                                            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
                                                Add Courier
                                            </Button>
                                        </div> */}
                                    </div>
                                {/* </CardHeader> */}
                                <CardContent className="p-0">
                                    <CouriersList />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="overview">
                            <Card className="border-none shadow-md">
                                <CardHeader className="border-b bg-gray-50 rounded-t-lg">
                                    <CardTitle className="text-gray-800">
                                        System Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                                    System Health
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Server Uptime
                                                            </span>
                                                            <span className="text-sm font-medium text-green-600">
                                                                99.8%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{
                                                                    width: "99.8%",
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Database Load
                                                            </span>
                                                            <span className="text-sm font-medium text-green-600">
                                                                42%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{
                                                                    width: "42%",
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between mb-1">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                API Response
                                                                Time
                                                            </span>
                                                            <span className="text-sm font-medium text-green-600">
                                                                98ms
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{
                                                                    width: "15%",
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                                    Recent Activity
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                New courier
                                                                registered
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                10 minutes ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                Courier
                                                                verification
                                                                approved
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                25 minutes ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                                            <Truck className="h-4 w-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                Delivery
                                                                completed
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                42 minutes ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
