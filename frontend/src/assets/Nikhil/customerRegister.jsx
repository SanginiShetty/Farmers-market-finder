import React, { useState, useRef, useEffect, useMemo } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    CheckCircle,
    Navigation,
    MapPinned,
    Building,
    FileImage,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const CustomerRegistrationPage = () => {
    const fileInputRef = useRef(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [locationMethod, setLocationMethod] = useState("manual");
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");
    const locationInputRef = useRef(null);
    const [locationCoords, setLocationCoords] = useState(null);

    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        profilePhoto: null,
        address: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    // Color theme for customers
    const theme = {
        primary: "#2196F3", // Blue primary
        light: "#90CAF9", // Light blue
        secondary: "#757575", // Gray
        accent: "#03A9F4", // Lighter blue
        backgroundLight: "#E3F2FD",
    };

    // Load Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
    });
    
    // Define map container style
    const mapContainerStyle = useMemo(() => ({
        width: '100%',
        height: '160px',
    }), []);
    
    // Default center for the map (India)
    const defaultCenter = useMemo(() => ({ 
        lat: 20.5937, 
        lng: 78.9629 
    }), []);

    // Initialize autocomplete for address input
    useEffect(() => {
        if (isLoaded && locationInputRef.current && window.google) {
            try {
                console.log("Initializing autocomplete...");
                // Remove any existing autocomplete
                if (locationInputRef.current.autocomplete) {
                    google.maps.event.clearInstanceListeners(locationInputRef.current.autocomplete);
                }
                
                const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
                    // Allow all types of locations including plus codes
                    types: [],
                    fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id'],
                });
                
                // Store reference to autocomplete
                locationInputRef.current.autocomplete = autocomplete;

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    console.log("Place selected:", place);
                    
                    if (place.geometry && place.geometry.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();
                        
                        console.log("Location coordinates:", { lat, lng });
                        setLocationCoords({ lat, lng });
                        
                        // Use the formatted_address or the input value if formatted_address is not available
                        const addressValue = place.formatted_address || locationInputRef.current.value;
                        
                        setFormData({
                            ...formData,
                            address: addressValue,
                        });
                    } else if (locationInputRef.current.value) {
                        // If no geometry is found but there's text in the input, use that
                        console.log("Using manual input value as address");
                        setFormData({
                            ...formData,
                            address: locationInputRef.current.value,
                        });
                    }
                });
                
                console.log("Autocomplete initialized successfully");
            } catch (error) {
                console.error("Error initializing autocomplete:", error);
            }
        }
    }, [isLoaded, formData]);

    // Add a function to handle manual address input
    const handleAddressInput = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            address: value
        }));
        
        // If the user is typing a Plus Code or other non-standard format,
        // we should still accept it even if autocomplete doesn't recognize it
        if (value && !locationCoords) {
            console.log("Manual address input without coordinates");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                profilePhoto: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTriggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleGetLiveLocation = () => {
        setIsGettingLocation(true);
        setLocationError("");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Update the map with the current location
                    setLocationCoords({ lat: latitude, lng: longitude });
                    
                    try {
                        // Use Vite's environment variable format
                        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                        const response = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
                        );
                        
                        const data = await response.json();
                        
                        if (data.results && data.results.length > 0) {
                            const address = data.results[0].formatted_address;
                            setFormData({
                                ...formData,
                                address: address,
                            });
                        } else {
                            setLocationError("Could not find address for your location");
                        }
                    } catch (error) {
                        console.error('Error getting address:', error);
                        setLocationError("Could not convert your location to an address");
                    }
                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    let errorMessage = 'Could not get your location.';
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += ' Please allow location access in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += ' Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += ' The request to get location timed out.';
                            break;
                        default:
                            errorMessage += ' Please check permissions.';
                    }
                    
                    setLocationError(errorMessage);
                    setIsGettingLocation(false);
                },
                { 
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser");
            setIsGettingLocation(false);
        }
    };

    // Render map component
    const renderMap = () => {
        if (loadError) {
            return <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                <p className="text-red-500">Error loading maps</p>
            </div>;
        }
        
        if (!isLoaded) {
            return <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full" />
            </div>;
        }
        
        return (
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={locationCoords || defaultCenter}
                options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                }}
            >
                {locationCoords && <Marker position={locationCoords} />}
            </GoogleMap>
        );
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.displayName.trim()) {
            formErrors.displayName = "Name is required";
        }

        if (!formData.email.trim()) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = "Invalid email address";
        }

        if (!formData.phoneNumber.trim()) {
            formErrors.phoneNumber = "Phone number is required";
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                const formDataToSend = new FormData();

                // Required fields
                formDataToSend.append("fullName", formData.displayName);
                formDataToSend.append("email", formData.email);
                formDataToSend.append("password", formData.password);
                formDataToSend.append("role", "customer");
                formDataToSend.append("phoneNumber", formData.phoneNumber);

                // Always send the address value, even if it's a Plus Code or other format
                formDataToSend.append("location", formData.address || "");

                // Optional fields
                formDataToSend.append("description", "");

                // Add profile photo if exists
                if (formData.profilePhoto) {
                    formDataToSend.append("profile", formData.profilePhoto);
                }

                console.log("Sending registration data:", {
                    fullName: formData.displayName,
                    email: formData.email,
                    role: "customer",
                    phoneNumber: formData.phoneNumber,
                    location: formData.address || "",
                    hasProfile: !!formData.profilePhoto
                });

                const response = await fetch(
                    "http://localhost:3000/api/v1/auth/signup",
                    {
                        method: "POST",
                        body: formDataToSend,
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Registration failed");
                }

                // Store token and user role in localStorage
                localStorage.setItem("token", data.accessToken);
                localStorage.setItem("userRole", JSON.stringify(data.user.role));

                // Handle successful registration
                console.log("Registration successful:", data);
                navigate("/login"); // Redirect to login page after successful registration
            } catch (error) {
                setErrors((prev) => ({
                    ...prev,
                    submit:
                        error.message ||
                        "Registration failed. Please try again.",
                }));
                console.error("Registration error:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

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
                        Welcome to Farm Connect
                    </h2>
                    <p style={{ color: theme.secondary }} className="text-lg">
                        Create Your Customer Account
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
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={handleTriggerFileInput}
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

                {/* Location section - similar to UserRegistrationPage */}
                <div
                    className="space-y-5 border-2 p-6 rounded-xl mb-6"
                    style={{
                        borderColor: theme.light,
                        backgroundColor: theme.backgroundLight,
                    }}
                >
                    <div
                        className="font-medium flex items-center text-lg"
                        style={{ color: theme.primary }}
                    >
                        <MapPinned className="mr-2 h-6 w-6" />
                        Delivery Location
                        <span className="text-sm text-gray-500 ml-2">
                            (Optional)
                        </span>
                    </div>

                    <div className="relative">
                        <div className="flex items-center">
                            <div className="relative flex-grow">
                                <MapPin className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Enter Your Delivery Address"
                                    value={formData.address}
                                    onChange={handleAddressInput}
                                    ref={locationInputRef}
                                    className="w-full pl-14 pr-5 py-4 text-lg border-2 rounded-l-xl focus:outline-none"
                                    style={{
                                        borderColor: theme.light,
                                    }}
                                    onKeyDown={(e) => { 
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                        }
                                    }}
                                    autoComplete="off"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleGetLiveLocation}
                                disabled={isGettingLocation}
                                className="bg-white py-4 px-4 rounded-r-xl transition duration-300 flex items-center justify-center text-lg border-2 border-l-0 h-full"
                                style={{
                                    borderColor: theme.light,
                                    color: theme.primary,
                                }}
                            >
                                {isGettingLocation ? (
                                    <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
                                ) : (
                                    <Navigation className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                        {locationError && (
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {locationError}
                            </p>
                        )}
                    </div>

                    {/* Map component */}
                    <div className="w-full mt-2 rounded-md overflow-hidden">
                        {renderMap()}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.displayName}
                            </p>
                        )}
                    </div>

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
                            <p className="text-red-500 text-base mt-2 ml-2">
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
                            <p className="text-red-500 text-base mt-2 ml-2">
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>

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

                    {errors.submit && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {errors.submit}
                            </span>
                        </div>
                    )}

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

export default CustomerRegistrationPage;
