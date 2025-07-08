import React, { useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config";

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [apiError, setApiError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        let formErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            formErrors.email = "Please enter a valid email address";
        }

        if (formData.password.length < 6) {
            formErrors.password = "Password must be at least 6 characters";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoggingIn(true);
            setApiError(null);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/v1/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            password: formData.password,
                        }),
                        mode: "cors",
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    // Store tokens and user data
                    if (data.accessToken) {
                        localStorage.setItem("token", data.accessToken);
                    }

                    // Store user role and data
                    if (data.user) {
                        localStorage.setItem("user", JSON.stringify(data.user));
                        const userRole = data.user.role;
                        localStorage.setItem("userRole", userRole);

                        // Navigate based on user role
                        switch (userRole.toLowerCase()) {
                            case "farmer":
                                navigate("/profile/farmer");
                                break;
                            case "courier":
                                navigate("/profile/courier");
                                break;
                            case "customer":
                                navigate("/");
                                break;
                            default:
                                navigate("/");
                                break;
                        }
                    } else {
                        navigate("/");
                    }
                } else {
                    throw new Error(data.message || "Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                setApiError(
                    error.message === "Failed to fetch"
                        ? "Unable to connect to the server. Please check your internet connection."
                        : error.message ||
                              "An error occurred during login. Please try again."
                );
            } finally {
                setIsLoggingIn(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
                {apiError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <p className="text-red-700">{apiError}</p>
                    </div>
                )}

                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold text-green-600 mb-3">
                        Veg Farms
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Welcome Back, Farmer!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-green-600 h-6 w-6" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-5 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.email
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-green-200 focus:border-green-600"
                            }`}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-green-600 h-6 w-6" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-14 pr-12 py-4 text-lg border-2 rounded-xl focus:outline-none ${
                                errors.password
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-green-200 focus:border-green-600"
                            }`}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-4 text-gray-500 hover:text-green-600"
                        >
                            {showPassword ? (
                                <EyeOff className="h-6 w-6" />
                            ) : (
                                <Eye className="h-6 w-6" />
                            )}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-5 w-5 text-green-600 border-2 border-green-200 rounded focus:ring-green-500"
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 text-gray-700"
                            >
                                Remember me
                            </label>
                        </div>
                        <a
                            href="#"
                            className="text-green-600 hover:underline font-medium"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition duration-300 flex items-center justify-center text-lg font-medium mt-8 shadow-md"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
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
                                Logging in...
                            </>
                        ) : (
                            <>
                                <LogIn className="mr-2 h-6 w-6" />
                                Login
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-600 text-lg">
                        Don't have an account?
                        <a
                            href="/AllRegister"
                            className="text-green-600 ml-2 hover:underline font-medium"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
