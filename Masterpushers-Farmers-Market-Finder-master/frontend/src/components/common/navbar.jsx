import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    UserIcon,
    ShoppingCart,
    Search,
    MapPin,
    ChevronDown,
    LogOut,
    Menu,
    X,
    Info,
    Download,
    Globe,
    Sun,
    Moon,
    Leaf,
    Home,
    ShoppingBag,
    Heart,
    HelpCircle,
    Tractor,
    Droplet,
    Wheat,
    Apple,
    Carrot,
} from "lucide-react";

// Import the Google Translate component
import GoogleTranslate from "../../snippets/GoogleTranslate";
import AllRegister from "./../../pages/allRegister";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // Check for token and user role on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?query=${searchTerm}`);
    };

    const handleProfileClick = () => {
        navigate("/profile/customer");
    };

    const handleCartClick = () => {
        navigate("/cart");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/allregister");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
        setUserRole(null);
        navigate("/");
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // Implement dark mode functionality here
    };

    const isCustomer = userRole === "customer";
    const cartItemCount = 0; // Replace with actual cart count

    return (
        <div className="sticky top-0 z-50">
            {/* Farm pattern background */}
            <div
                className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
                style={{
                    backgroundImage:
                        "url('https://www.transparenttextures.com/patterns/farm-landscape.png')",
                }}
            ></div>

            {/* Main navbar with enhanced farming theme */}
            <div
                className={`w-full transition-all duration-300 relative ${
                    scrolled
                        ? "py-2 bg-white shadow-md"
                        : "py-3 bg-gradient-to-r from-green-50 to-white"
                }`}
            >
                {/* Decorative farm elements */}
                <div className="absolute top-0 left-0 w-full overflow-hidden h-1">
                    <div className="w-full h-1 bg-gradient-to-r from-green-300 via-amber-300 to-green-300"></div>
                </div>

                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo with enhanced farming theme */}
                    <div className="flex items-center">
                        <div
                            className={`relative ${
                                scrolled
                                    ? "bg-green-600"
                                    : "bg-gradient-to-br from-green-500 to-green-600"
                            } p-2 rounded-full shadow-md transition-all duration-300 transform hover:rotate-3 hover:scale-105 group`}
                        >
                            <img
                                src="https://autofinancetrack-pennytracker.s3.ap-south-1.amazonaws.com/uploads/farmerLogo.png"
                                alt="AgroLynk"
                                className="h-8 w-8 relative z-10"
                            />
                            <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 opacity-10"></div>
                        </div>
                        <div className="ml-3">
                            <h1 className="text-2xl font-bold flex items-center">
                                <span
                                    className={`${
                                        scrolled
                                            ? "text-green-700"
                                            : "text-green-600"
                                    } transition-colors duration-300`}
                                >
                                    Agro
                                </span>
                                <span
                                    className={`${
                                        scrolled
                                            ? "text-green-900"
                                            : "text-green-800"
                                    } transition-colors duration-300`}
                                >
                                    Lynk
                                </span>
                                <Leaf
                                    className={`ml-1 h-5 w-5 ${
                                        scrolled
                                            ? "text-green-600"
                                            : "text-green-500"
                                    } animate-pulse`}
                                />
                            </h1>
                            <p className="text-xs text-green-600 font-medium -mt-1">
                                Farm to Table Marketplace
                            </p>
                        </div>
                    </div>

                    {/* Desktop Auth and Language with enhanced farming theme */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Globe size={18} className="text-green-600" />
                            <GoogleTranslate />
                        </div>

                        <div className="h-6 w-px bg-green-200"></div>

                        <div className="h-6 w-px bg-green-200"></div>

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleProfileClick}
                                    className="flex items-center text-green-700 hover:text-green-900 font-medium px-3 py-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                >
                                    <UserIcon size={18} className="mr-2" />
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 hover:text-red-700 font-medium px-3 py-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                    <LogOut size={18} className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="flex items-center text-green-700 hover:text-green-900 font-medium px-3 py-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/AllRegister"
                                    className="flex items-center text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button with enhanced farming theme */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`${
                                scrolled ? "text-green-700" : "text-green-600"
                            } p-2 transition-colors duration-300 hover:bg-green-50 rounded-full`}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Customer-only features - Main navbar content with enhanced farming theme */}
                {isCustomer && (
                    <nav
                        className={`container mx-auto mt-2 px-4 ${
                            scrolled ? "py-2" : "py-3"
                        } bg-white rounded-2xl shadow-lg border border-green-100 transition-all duration-300 relative overflow-hidden`}
                    >
                        {/* Decorative farm pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage:
                                    "url('https://www.transparenttextures.com/patterns/crops.png')",
                            }}
                        ></div>

                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center relative">
                            <div className="flex items-center flex-wrap md:flex-nowrap">
                                <div className="relative mr-2 mb-2 md:mb-0">
                                    <select className="appearance-none bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-green-200 rounded-lg p-2 pl-8 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>Categories</option>
                                        <option>Fruits</option>
                                        <option>Vegetables</option>
                                        <option>Grains</option>
                                    </select>
                                    <Wheat className="absolute left-2 top-1/2 transform -translate-y-1/2 text-amber-600 h-4 w-4" />
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                                </div>
                                <div className="relative mb-2 md:mb-0">
                                    <select className="appearance-none bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-green-200 rounded-lg p-2 pl-8 pr-10 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>Change Location</option>
                                        <option>Mumbai</option>
                                        <option>Pune</option>
                                        <option>Nashik</option>
                                    </select>
                                    <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-600 h-4 w-4" />
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                                </div>
                            </div>

                            <form
                                onSubmit={handleSearch}
                                className="flex flex-grow mx-0 md:mx-4 my-2 md:my-0 max-w-2xl"
                            >
                                <div className="relative flex w-full">
                                    <input
                                        type="text"
                                        placeholder="Search for fresh produce..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="flex-grow p-3 pl-4 border border-green-200 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-200 text-white font-medium p-3 px-6 rounded-r-lg shadow-sm flex items-center"
                                    >
                                        <Search className="h-5 w-5 mr-1" />
                                        <span>Search</span>
                                    </button>
                                </div>
                            </form>

                            <div className="hidden md:flex items-center space-x-4">
                                <a
                                    href="/cart"
                                    className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-green-50 relative"
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    <span>My Cart</span>
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </a>
                                <button
                                    onClick={handleProfileClick}
                                    className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-green-50"
                                >
                                    <UserIcon className="h-5 w-5 mr-2" />
                                    <span>Profile</span>
                                </button>
                            </div>
                        </div>

                        {/* Farm-themed decorative element */}
                        <div className="absolute -bottom-6 -right-6 text-green-100 opacity-10 pointer-events-none">
                            <Tractor className="h-16 w-16" />
                        </div>
                    </nav>
                )}

                {/* Mobile menu with enhanced farming theme */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-green-100 shadow-lg animate-fadeIn">
                        <div className="container mx-auto px-4 py-3 space-y-3">
                            <div className="p-2 flex items-center border-b border-green-100 pb-3">
                                <Globe
                                    size={16}
                                    className="mr-2 text-green-600"
                                />
                                <GoogleTranslate />
                            </div>

                            {/* Show customer-specific options in mobile menu if user is a customer */}
                            {isCustomer && (
                                <>
                                    <button
                                        onClick={handleCartClick}
                                        className="flex items-center w-full text-green-700 hover:text-green-900 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                    >
                                        <ShoppingCart
                                            size={18}
                                            className="mr-2"
                                        />
                                        My Cart
                                        {cartItemCount > 0 && (
                                            <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center w-full text-green-700 hover:text-green-900 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                    >
                                        <UserIcon size={18} className="mr-2" />
                                        Profile
                                    </button>
                                </>
                            )}

                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-red-600 hover:text-red-700 font-medium p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                >
                                    <LogOut size={18} className="mr-2" />
                                    Logout
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        className="flex items-center w-full text-green-700 hover:text-green-900 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                    >
                                        <UserIcon size={18} className="mr-2" />
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center w-full text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 font-medium p-2 rounded-lg transition-colors duration-200 justify-center"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}

                            {/* Farm-themed decorative element */}
                            <div className="flex justify-end">
                                <Tractor className="h-8 w-8 text-green-200" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
