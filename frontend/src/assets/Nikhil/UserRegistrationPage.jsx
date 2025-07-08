import React, { useState, useRef, useEffect, useMemo } from "react";
// import React, { useState, useRef, useEffect, useMemo } from "react";
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
    Leaf,
    Egg,
    Filter,
    FileImage,
    PenLine,
    Home,
    Info,
} from "lucide-react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { faMicrophone, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

const UserRegistrationPage = () => {
    const fileInputRef = useRef(null);
    const idProofInputRef = useRef(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [idProofPreview, setIdProofPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const locationInputRef = useRef(null);
    const mapRef = useRef(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [locationCoords, setLocationCoords] = useState(null);
    const [locationMethod, setLocationMethod] = useState("manual");
    const [recordingField, setRecordingField] = useState(null);
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
        useSpeechRecognition();

    // Update farmType options to match backend enum
    const farmTypes = [
        { value: "Veg", label: "Vegetable Farming", icon: Leaf },
        { value: "nonveg", label: "Poultry And Dairy Farming", icon: Egg },
        { value: "both", label: "Mixed Farming", icon: Filter },
    ];

    // Update the initial form data with correct farmType value
    const [formData, setFormData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        farmName: "",
        farmDescription: "",
        address: "",
        city: "",
        district: "",
        password: "",
        confirmPassword: "",
        farmType: "", // Default to veg farming
        profilePhoto: null,
        idProof: null,
    });

    const [errors, setErrors] = useState({});
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");

    // Color themes based on farm type
    const themes = {
        veg: {
            primary: "#4CAF50",
            light: "#AED581",
            secondary: "#8D6E63",
            accent: "#CDDC39",
            backgroundLight: "#f1f8e9",
        },
        nonveg: {
            primary: "#FFB300",
            light: "#FFD54F",
            secondary: "#795548",
            accent: "#FFF8E1",
            backgroundLight: "#fff8e1",
        },
        both: {
            primary: "#388E3C",
            light: "#A5D6A7",
            secondary: "#8D6E63",
            accent: "#FFC107",
            backgroundLight: "#f5f5f5",
        },
    };

    // Get current theme based on farm type with fallback
    const currentTheme = themes[formData.farmType?.toLowerCase()] || themes.veg;

    // Replace scriptLoaded state with useLoadScript hook
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    // Define map container style
    const mapContainerStyle = useMemo(
        () => ({
            width: "100%",
            height: "160px",
        }),
        []
    );

    // Default center for the map (India)
    const defaultCenter = useMemo(
        () => ({
            lat: 20.5937,
            lng: 78.9629,
        }),
        []
    );

    // Update the autocomplete initialization
    useEffect(() => {
        if (isLoaded && locationInputRef.current && window.google) {
            try {
                console.log("Initializing autocomplete...");
                // Remove any existing autocomplete
                if (locationInputRef.current.autocomplete) {
                    google.maps.event.clearInstanceListeners(
                        locationInputRef.current.autocomplete
                    );
                }

                const autocomplete = new window.google.maps.places.Autocomplete(
                    locationInputRef.current,
                    {
                        // Restrict to addresses/geographical locations
                        types: ["geocode"],
                        fields: [
                            "address_components",
                            "formatted_address",
                            "geometry",
                            "name",
                        ],
                    }
                );

                // Store reference to autocomplete
                locationInputRef.current.autocomplete = autocomplete;

                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    console.log("Place selected:", place);

                    if (place.geometry && place.geometry.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();

                        console.log("Location coordinates:", { lat, lng });
                        setLocationCoords({ lat, lng });

                        setFormData({
                            ...formData,
                            address: place.formatted_address,
                            city: "",
                            district: "",
                        });
                    } else {
                        console.warn(
                            "No geometry found for the selected place"
                        );
                    }
                });

                console.log("Autocomplete initialized successfully");
            } catch (error) {
                console.error("Error initializing autocomplete:", error);
            }
        }
    }, [isLoaded, formData]);

    // Remove the old map initialization useEffect

    // Remove the old marker update useEffect

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

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleIdProofChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                idProof: file,
            }));

            // Create preview URL for ID proof
            const reader = new FileReader();
            reader.onloadend = () => {
                setIdProofPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTriggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleTriggerIdProofInput = () => {
        idProofInputRef.current.click();
    };

    const validateForm = () => {
        let formErrors = {};

        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        if (formData.password.length < 8) {
            formErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.farmName.trim()) {
            formErrors.farmName = "Please enter your farm name";
        }

        // Only validate address field now
        if (!formData.address.trim()) {
            formErrors.address = "Please enter your address";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
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
                                city: "",
                                district: "",
                            });
                        } else {
                            setLocationError(
                                "Could not find address for your location"
                            );
                        }
                    } catch (error) {
                        console.error("Error getting address:", error);
                        setLocationError(
                            "Could not convert your location to an address"
                        );
                    }
                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    let errorMessage = "Could not get your location.";

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage +=
                                " Please allow location access in your browser settings.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage +=
                                " Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMessage +=
                                " The request to get location timed out.";
                            break;
                        default:
                            errorMessage += " Please check permissions.";
                    }

                    setLocationError(errorMessage);
                    setIsGettingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser");
            setIsGettingLocation(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log when button is clicked
        console.log("Farmer Register button clicked!");

        // Log all form data
        console.log("Current Form Data:", {
            fullName: formData.displayName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            farmName: formData.farmName,
            farmDescription: formData.farmDescription,
            address: formData.address,
            city: formData.city,
            district: formData.district,
            farmType: formData.farmType,
            profilePhoto: formData.profilePhoto
                ? {
                      name: formData.profilePhoto.name,
                      type: formData.profilePhoto.type,
                      size: formData.profilePhoto.size,
                  }
                : null,
        });

        // Log validation status
        const isValid = validateForm();
        console.log("Form Validation Status:", isValid);
        console.log("Current Errors:", errors);

        if (isValid) {
            setIsSubmitting(true);
            console.log("Starting submission process...");

            try {
                const formDataToSend = new FormData();
                formDataToSend.append("fullName", formData.displayName);
                formDataToSend.append("email", formData.email);
                formDataToSend.append("password", formData.password);
                formDataToSend.append("role", "farmer");
                formDataToSend.append("phoneNumber", formData.phoneNumber);
                formDataToSend.append("farmName", formData.farmName);
                formDataToSend.append("description", formData.farmDescription);
                formDataToSend.append(
                    "location",
                    formData.address || `${formData.city}, ${formData.district}`
                );
                formDataToSend.append("farmType", formData.farmType);

                if (formData.profilePhoto) {
                    formDataToSend.append("profile", formData.profilePhoto);
                }

                if (formData.idProof) {
                    formDataToSend.append("idProof", formData.idProof);
                }

                // Log all data being sent to server
                console.log("=== Data Being Sent to Server ===");
                for (let [key, value] of formDataToSend.entries()) {
                    if (key === "profile") {
                        console.log("profile:", {
                            name: value.name,
                            type: value.type,
                            size: value.size,
                        });
                    } else {
                        console.log(`${key}:`, value);
                    }
                }

                console.log("Sending request to API...");
                console.log(
                    "API Endpoint:",
                    "http://localhost:3000/api/v1/auth/signup"
                );
                console.log("Request Method:", "POST");

                const response = await fetch(
                    "http://localhost:3000/api/v1/auth/signup",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                        },
                        body: formDataToSend,
                    }
                );

                console.log("=== Response Details ===");
                console.log("Response Status:", response.status);
                console.log("Response Status Text:", response.statusText);
                console.log("Response Headers:", {
                    contentType: response.headers.get("content-type"),
                    authorization: response.headers.get("authorization"),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("Error Response Data:", errorData);
                    throw new Error(errorData.message || "Registration failed");
                }

                const data = await response.json();
                console.log("=== Success Response Data ===");
                console.log(data);
                localStorage.setItem("token", data.accessToken);
                localStorage.setItem(
                    "userRole",
                    JSON.stringify(data.user.role)
                );

                console.log(
                    "Farmer Registration successful! Redirecting to login..."
                );
                alert("Registration successful! Please login.");
                window.location.href = "/login";
            } catch (error) {
                console.log("=== Error Details ===");
                console.log("Error Name:", error.name);
                console.log("Error Message:", error.message);
                console.log("Error Stack:", error.stack);

                setErrors((prev) => ({
                    ...prev,
                    submit:
                        error.message ||
                        "Registration failed. Please try again.",
                }));
            } finally {
                setIsSubmitting(false);
                console.log("Submission process completed");
            }
        } else {
            console.log("=== Validation Failed ===");
            console.log("Validation Errors:", errors);
        }
    };

    const handleLocationMethodChange = (method) => {
        setLocationMethod(method);
        setLocationError("");

        // Clear relevant fields when changing methods
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

    const getFarmTpyeIcon = () => {
        switch (formData.farmType) {
            case "Veg":
                return <Leaf className="h-6 w-6 text-green-600" />;
            case "nonveg":
                return <Egg className="h-6 w-6 text-yellow-600" />;
            case "both":
                return <Filter className="h-6 w-6 text-emerald-700" />;
            default:
                return <Leaf className="h-6 w-6 text-green-600" />;
        }
    };

    // Replace the map div with GoogleMap component
    const renderMap = () => {
        if (loadError) {
            return (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                    <p className="text-red-500">Error loading maps</p>
                </div>
            );
        }

        if (!isLoaded) {
            return (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                    <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full" />
                </div>
            );
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

    // Handle starting recording for a specific field
    const startRecording = (fieldName) => {
        setRecordingField(fieldName);
        resetTranscript();
        SpeechRecognition.startListening();
    };

    // Handle stopping recording
    const stopRecording = () => {
        SpeechRecognition.stopListening();
        setRecordingField(null);
    };

    // Update form data when transcript changes
    useEffect(() => {
        if (transcript && recordingField) {
            setFormData((prev) => ({
                ...prev,
                [recordingField]: transcript,
            }));
        }
    }, [transcript]);

    // Example of how to modify an input field to include voice input
    // Replace your existing input fields with this pattern:

    const renderInputWithVoice = (name, placeholder, icon, type = "text") => (
        <div className="relative">
            {icon}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="w-full pl-14 pr-12 py-4 text-lg border-2 rounded-xl focus:outline-none"
                style={{
                    borderColor: currentTheme.light,
                    ":focus": { borderColor: currentTheme.primary },
                }}
            />
            <button
                type="button"
                onClick={() =>
                    recordingField === name
                        ? stopRecording()
                        : startRecording(name)
                }
                className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
            >
                <FontAwesomeIcon
                    icon={recordingField === name ? faStop : faMicrophone}
                    className="h-6 w-6"
                />
            </button>
        </div>
    );

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ backgroundColor: currentTheme.backgroundLight }}
        >
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h2
                        className="text-5xl font-bold mb-3"
                        style={{ color: currentTheme.primary }}
                    >
                        Farm Connect
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Create Your Farmer Account
                    </p>
                </div>

                {/* Profile Photo Upload */}
                <div className="mb-8 flex flex-col items-center">
                    <div
                        className="w-32 h-32 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4"
                        style={{ borderColor: currentTheme.light }}
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
                            borderColor: currentTheme.light,
                            color: currentTheme.primary,
                        }}
                    >
                        <FileImage className="mr-2 h-5 w-5" />
                        {profilePreview
                            ? "Change Profile Photo"
                            : "Add Profile Photo"}
                    </button>
                </div>

                {/* ID Proof Upload */}
                <div className="mb-8 flex flex-col items-center">
                    <div
                        className="w-full max-w-md h-40 rounded-lg flex items-center justify-center mb-4 overflow-hidden border-4"
                        style={{ borderColor: currentTheme.light }}
                    >
                        {idProofPreview ? (
                            <img
                                src={idProofPreview}
                                alt="ID Proof Preview"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <Info className="h-16 w-16 mb-2" />
                                <span>Upload ID Proof</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={idProofInputRef}
                        accept="image/*"
                        onChange={handleIdProofChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={handleTriggerIdProofInput}
                        className="py-2 px-4 rounded-lg text-base flex items-center justify-center transition duration-300 bg-white border"
                        style={{
                            borderColor: currentTheme.light,
                            color: currentTheme.primary,
                        }}
                    >
                        <FileImage className="mr-2 h-5 w-5" />
                        {idProofPreview ? "Change ID Proof" : "Upload ID Proof"}
                    </button>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        Please upload a valid government-issued ID proof (Aadhar
                        Card, PAN Card, etc.)
                    </p>
                </div>

                {/* Farm Type Selection */}
                <div className="space-y-6">
                    <div className="font-medium text-gray-700 mb-3 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            />
                        </svg>
                        Choose Farm Type
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {farmTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            farmType: type.value,
                                        }));
                                        console.log(
                                            "Selected farm type:",
                                            type.value
                                        ); // Log selection
                                    }}
                                    className={`p-4 rounded-xl border-2 transition duration-300 flex flex-col items-center justify-center space-y-2 ${
                                        formData.farmType === type.value
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200 hover:border-green-300"
                                    }`}
                                >
                                    <div
                                        className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${
                                            formData.farmType === type.value
                                                ? "bg-green-100"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        <Icon
                                            className={`h-8 w-8 ${
                                                formData.farmType === type.value
                                                    ? "text-green-500"
                                                    : "text-gray-500"
                                            }`}
                                        />
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${
                                            formData.farmType === type.value
                                                ? "text-green-700"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {type.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderInputWithVoice(
                        "displayName",
                        "Full Name",
                        <User className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                    )}

                    {renderInputWithVoice(
                        "farmName",
                        "Farm Name",
                        <Home className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                    )}

                    {renderInputWithVoice(
                        "email",
                        "Email Address",
                        <Mail className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                    )}

                    {renderInputWithVoice(
                        "phoneNumber",
                        "Phone Number",
                        <Phone className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                    )}

                    {/* Special case for textarea */}
                    <div className="relative">
                        <PenLine className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                        <textarea
                            name="farmDescription"
                            placeholder="Farm Description - Tell us about your farm, products, etc."
                            value={formData.farmDescription}
                            onChange={handleChange}
                            className="w-full pl-14 pr-12 py-4 text-lg border-2 rounded-xl focus:outline-none resize-none"
                            style={{
                                borderColor: currentTheme.light,
                                ":focus": { borderColor: currentTheme.primary },
                                minHeight: "120px",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                recordingField === "farmDescription"
                                    ? stopRecording()
                                    : startRecording("farmDescription")
                            }
                            className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
                        >
                            <FontAwesomeIcon
                                icon={
                                    recordingField === "farmDescription"
                                        ? faStop
                                        : faMicrophone
                                }
                                className="h-6 w-6"
                            />
                        </button>
                    </div>

                    {/* Location section - simplified */}
                    <div
                        className="space-y-5 border-2 p-6 rounded-xl"
                        style={{
                            borderColor: currentTheme.light,
                            backgroundColor: `${currentTheme.backgroundLight}`,
                        }}
                    >
                        <div
                            className="font-medium flex items-center text-lg"
                            style={{ color: currentTheme.primary }}
                        >
                            <MapPinned className="mr-2 h-6 w-6" />
                            Farm Location
                        </div>

                        <div className="relative">
                            <div className="flex items-center">
                                <div className="relative flex-grow">
                                    <MapPin className="absolute left-4 top-4 text-gray-600 h-6 w-6" />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Enter Farm Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        ref={locationInputRef}
                                        className={`w-full pl-14 pr-12 py-4 text-lg border-2 rounded-l-xl focus:outline-none ${
                                            errors.address
                                                ? "border-red-500 focus:border-red-500"
                                                : "bg-white"
                                        }`}
                                        style={
                                            !errors.address
                                                ? {
                                                      borderColor:
                                                          currentTheme.light,
                                                      ":focus": {
                                                          borderColor:
                                                              currentTheme.primary,
                                                      },
                                                  }
                                                : {}
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                            }
                                        }}
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            recordingField === "address"
                                                ? stopRecording()
                                                : startRecording("address")
                                        }
                                        className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                recordingField === "address"
                                                    ? faStop
                                                    : faMicrophone
                                            }
                                            className="h-6 w-6"
                                        />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGetLiveLocation}
                                    disabled={isGettingLocation}
                                    className="bg-white py-4 px-4 rounded-r-xl transition duration-300 flex items-center justify-center text-lg border-2 border-l-0 h-full"
                                    style={{
                                        borderColor: currentTheme.light,
                                        color: currentTheme.primary,
                                    }}
                                >
                                    {isGettingLocation ? (
                                        <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
                                    ) : (
                                        <Navigation className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                            {errors.address && (
                                <p className="text-red-500 text-base mt-2 ml-2">
                                    {errors.address}
                                </p>
                            )}
                            {locationError && (
                                <p className="text-red-500 text-base mt-2 ml-2">
                                    {locationError}
                                </p>
                            )}
                        </div>

                        {/* Replace the map div with the renderMap function */}
                        <div className="w-full mt-2 rounded-md overflow-hidden">
                            {renderMap()}
                        </div>
                    </div>

                    {renderInputWithVoice(
                        "password",
                        "Password",
                        <Lock className="absolute left-4 top-4 text-gray-600 h-6 w-6" />,
                        "password"
                    )}

                    {renderInputWithVoice(
                        "confirmPassword",
                        "Confirm Password",
                        <Lock className="absolute left-4 top-4 text-gray-600 h-6 w-6" />,
                        "password"
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-white py-4 rounded-xl transition duration-300 flex items-center justify-center text-lg font-medium mt-6 shadow-md ${
                            isSubmitting ? "opacity-70" : ""
                        }`}
                        style={{ backgroundColor: currentTheme.primary }}
                    >
                        {isSubmitting ? (
                            "Registering..."
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
                        Already have an account?
                        <button
                            onClick={()=>{window.location.href="/login"}}
                            className="ml-2 hover:underline font-medium"
                            style={{ color: currentTheme.primary }}
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserRegistrationPage;
