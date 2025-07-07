import React from "react";
import { useNavigate } from "react-router-dom";
import { Sprout, User, Truck } from "lucide-react";

const AllRegister = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: "Farmer",
            description: "Register as a farmer to sell your products",
            icon: Sprout,
            path: "/farmer/register",
            color: "#4CAF50",
            bgLight: "#f1f8e9",
        },
        {
            title: "Customer",
            description: "Register as a customer to buy fresh products",
            icon: User,
            path: "/customer/register",
            color: "#2196F3",
            bgLight: "#e3f2fd",
        },
        {
            title: "Courier",
            description: "Register as a courier to deliver products",
            icon: Truck,
            path: "/courier/register",
            color: "#FF9800",
            bgLight: "#fff3e0",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Join Farm Connect
                    </h1>
                    <p className="text-lg text-gray-600">
                        Choose how you want to be part of our community
                    </p>
                </div>

                {/* Role Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <button
                            key={role.title}
                            onClick={() => navigate(role.path)}
                            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl"
                            style={{ background: role.bgLight }}
                        >
                            {/* Content Container */}
                            <div className="p-8 transition-transform duration-300 group-hover:scale-[1.02]">
                                {/* Icon */}
                                <div
                                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor: `${role.color}15`,
                                    }}
                                >
                                    <role.icon
                                        className="w-8 h-8"
                                        style={{ color: role.color }}
                                    />
                                </div>

                                {/* Text Content */}
                                <h3
                                    className="text-xl font-semibold mb-2"
                                    style={{ color: role.color }}
                                >
                                    {role.title}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {role.description}
                                </p>

                                {/* Get Started Button */}
                                <div
                                    className="inline-flex items-center text-sm font-medium transition-colors duration-300"
                                    style={{ color: role.color }}
                                >
                                    Get Started
                                    <svg
                                        className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div
                                className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10"
                                style={{ background: role.color }}
                            />
                            <div
                                className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 rounded-full opacity-10"
                                style={{ background: role.color }}
                            />
                        </button>
                    ))}
                </div>

                {/* Login Link */}
                <div className="text-center mt-12">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AllRegister;
