import React, { useState, useEffect, useRef } from "react";
import {
    MapPin,
    Building,
    DollarSign,
    Heart,
    Share2,
    MessageCircle,
    ShoppingCart,
    Tag,
    Clock,
    Calendar,
    Star,
    ChevronLeft,
    ChevronRight,
    Phone,
    ArrowLeft,
    ShoppingBag,
    Navigation,
    ReceiptIndianRupeeIcon,
    Info,
    CheckCircle,
    Minus,
    Plus,
    User,
    MessageSquare,
    AlertCircle,
    Truck,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import { useLoadScript } from "@react-google-maps/api";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showBuyPopup, setShowBuyPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState("");
    const [locationCoords, setLocationCoords] = useState(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState("");
    const locationInputRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("online");

    // Google Maps loading
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    // Initialize Google Places Autocomplete
    useEffect(() => {
        if (isLoaded && locationInputRef.current && window.google) {
            try {
                // Remove any existing autocomplete
                if (locationInputRef.current.autocomplete) {
                    google.maps.event.clearInstanceListeners(
                        locationInputRef.current.autocomplete
                    );
                }

                const autocomplete = new window.google.maps.places.Autocomplete(
                    locationInputRef.current,
                    {
                        types: ["geocode"],
                        fields: [
                            "address_components",
                            "formatted_address",
                            "geometry",
                            "name",
                        ],
                    }
                );

                locationInputRef.current.autocomplete = autocomplete;

                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    setShowSuggestions(false);

                    if (place.geometry && place.geometry.location) {
                        const lat = place.geometry.location.lat();
                        const lng = place.geometry.location.lng();

                        setLocationCoords({ lat, lng });
                        setLocation(place.formatted_address);
                    }
                });
            } catch (error) {
                console.error("Error initializing autocomplete:", error);
            }
        }
    }, [isLoaded]);

    // Handle location input change
    const handleLocationChange = async (e) => {
        const value = e.target.value;
        setLocation(value);

        if (value.trim() && isLoaded) {
            try {
                const service =
                    new window.google.maps.places.AutocompleteService();
                const predictions = await new Promise((resolve, reject) => {
                    service.getPlacePredictions(
                        {
                            input: value,
                            types: ["geocode"],
                        },
                        (predictions, status) => {
                            if (
                                status ===
                                window.google.maps.places.PlacesServiceStatus.OK
                            ) {
                                resolve(predictions);
                            } else {
                                reject(status);
                            }
                        }
                    );
                });
                setSuggestions(predictions);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle suggestion selection
    const handleSelectSuggestion = async (placeId) => {
        if (isLoaded) {
            try {
                const geocoder = new window.google.maps.Geocoder();
                const result = await new Promise((resolve, reject) => {
                    geocoder.geocode(
                        { placeId: placeId },
                        (results, status) => {
                            if (status === "OK") {
                                resolve(results[0]);
                            } else {
                                reject(status);
                            }
                        }
                    );
                });

                const { lat, lng } = result.geometry.location;
                setLocationCoords({
                    lat: lat(),
                    lng: lng(),
                });
                setLocation(result.formatted_address);
                setShowSuggestions(false);
            } catch (error) {
                console.error("Error getting place details:", error);
            }
        }
    };

    // Handle getting live location
    const handleGetLiveLocation = () => {
        setIsGettingLocation(true);
        setLocationError("");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocationCoords({ lat: latitude, lng: longitude });

                    try {
                        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                        const response = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
                        );

                        const data = await response.json();

                        if (data.results && data.results.length > 0) {
                            const address = data.results[0].formatted_address;
                            setLocation(address);
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

    // Map container style
    const mapContainerStyle = {
        width: "100%",
        height: "200px",
    };

    // Render map
    const renderMap = () => {
        if (loadError) {
            return (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md">
                    <p className="text-red-500">Error loading maps</p>
                </div>
            );
        }

        if (!isLoaded) {
            return (
                <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-md">
                    <div className="animate-spin h-6 w-6 border-2 border-gray-500 border-t-transparent rounded-full" />
                </div>
            );
        }

        return (
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={locationCoords || { lat: 20.5937, lng: 78.9629 }}
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

    // In a real app, you would get the product ID from the URL
    // For this demo, we'll use a fixed product ID
    const productId = 1;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/v1/product/${id}`
                );
                const data = await response.json();
                if (data.success) {
                    setProduct(data.product);

                    // Get related products
                    if (data.product.relatedProducts) {
                        const related = data.product.relatedProducts
                            .map((id) =>
                                data.product.relatedProducts.find(
                                    (p) => p.id === id
                                )
                            )
                            .filter(Boolean);
                        setRelatedProducts(related);
                    }
                }
            } catch (error) {
                toast.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const nextImage = () => {
        setCurrentImageIndex(
            (prevIndex) => (prevIndex + 1) % product.images.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prevIndex) =>
                (prevIndex - 1 + product.images.length) % product.images.length
        );
    };

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    const toggleWishlist = () => {
        setIsInWishlist(!isInWishlist);
    };

    const addToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("User not logged in.");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/wishlist/`,
                {
                    productId: id, // Only send productId
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Send the token in the header
                    },
                }
            );

            if (response.data.status == "success") {
                toast.success("Added to cart successfully!");
            } else {
                toast.error("Failed to add to cart.");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("An error occurred while adding to cart.");
        }
    };

    const handleBackToProducts = () => {
        // In a real app, this would navigate back to products page
        window.location.href = "/product-show";
    };

    const handleOpenBuyPopup = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to make a purchase");

            return;
        } else {
            setShowBuyPopup(true);
        }
    };

    const handleBuyProduct = async () => {
        setIsLoading(true);
        setError(null);

        if (!location.trim()) {
            setError("Please enter delivery location");
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to make a purchase");
                return;
            }

            // Handle online payment first if selected
            if (paymentMethod === "online") {
                try {
                    // First create order in Razorpay
                    const paymentResponse = await axios.post(
                        `${API_BASE_URL}/api/v1/payment/`,
                        {
                            amount: parseInt(product.price * quantity),
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    console.log("Payment Response:", paymentResponse.data); // Debug log

                    if (paymentResponse.data.success) {
                        const options = {
                            key: paymentResponse.data.key_id, // Razorpay Key ID
                            amount: paymentResponse.data.amount, // Amount in paisa
                            currency: paymentResponse.data.currency,
                            order_id: paymentResponse.data.id,
                            name: "FarmFresh Market",
                            description: `Payment for ${product.name}`,
                            image: "your_logo_url", // Add your logo URL
                            handler: function (response) {
                                // This function will be called after successful payment
                                console.log("Payment Success:", response);
                                toast.success("Payment successful!");
                                createOrder();
                            },
                            prefill: {
                                name: "Customer Name",
                                email: "customer@example.com",
                                contact: "9999999999",
                            },
                            notes: {
                                address: "Customer Address",
                            },
                            theme: {
                                color: "#16a34a",
                            },
                        };

                        // Create a new instance of Razorpay
                        const rzp1 = new window.Razorpay(options);

                        rzp1.on("payment.failed", function (response) {
                            console.error("Payment Failed:", response.error);
                            toast.error(
                                "Payment failed: " + response.error.description
                            );
                        });

                        // Open Razorpay payment window
                        rzp1.open();

                        // Don't set isLoading to false here as payment is in progress
                        return;
                    } else {
                        throw new Error("Failed to create payment order");
                    }
                } catch (paymentError) {
                    console.error("Payment error:", paymentError);
                    toast.error(
                        "Payment initialization failed. Please try again."
                    );
                    setError("Payment failed. Please try again.");
                    setIsLoading(false);
                    return;
                }
            } else {
                // For cash on delivery
                await createOrder();
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while processing your order");
            toast.error("Order processing failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const createOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/v1/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: id,
                    totalAmount: product.price * quantity,
                    quantity: quantity,
                    paymentMethod: paymentMethod,
                    location: location.trim(),
                }),
            });

            const data = await response.json();

            if (data.status === "success") {
                toast.success("Order placed successfully!");
                setShowBuyPopup(false);
                setLocation("");
            } else {
                throw new Error(data.message || "Failed to create order");
            }
        } catch (error) {
            console.error("Order creation error:", error);
            toast.error("Failed to create order. Please try again.");
            setError(error.message || "Failed to create order");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
            {/* Navigation bar */}
            <Toaster />

            {/* Main content wrapper with farm-themed background */}
            <div className="max-w-6xl mx-auto p-6 relative">
                {/* Subtle farm pattern background for the entire page */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                    style={{
                        backgroundImage:
                            "url('https://www.transparenttextures.com/patterns/farm-landscape.png')",
                    }}
                ></div>

                {/* Back button with enhanced farming style */}
                <button
                    onClick={() => window.history.back()}
                    className="relative z-10 flex items-center text-green-700 hover:text-green-800 mb-6 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-green-100 transition-all duration-200 hover:bg-white group"
                >
                    <div className="bg-green-100 rounded-full p-1 mr-2 group-hover:bg-green-200 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Back to Products
                </button>

                {/* Product card with enhanced farming theme */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-green-100 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Product Images Section with farming theme */}
                        <div className="relative h-[400px] md:h-[500px]">
                            {/* Debug the image source */}
                            {console.log("Product data:", product)}
                            {console.log(
                                "Current image index:",
                                currentImageIndex
                            )}

                            {/* Main product image with comprehensive error handling */}
                            {product ? (
                                <>
                                    {product.images &&
                                    product.images.length > 0 ? (
                                        <img
                                            src={
                                                product.images[
                                                    currentImageIndex
                                                ]
                                            }
                                            alt={
                                                product.name || "Product image"
                                            }
                                            className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                                            onError={(e) => {
                                                console.log(
                                                    "Image failed to load:",
                                                    e.target.src
                                                );
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://via.placeholder.com/600x400?text=Product+Image";
                                            }}
                                        />
                                    ) : product.image ? (
                                        // Fallback to single image if images array is not available
                                        <img
                                            src={product.image}
                                            alt={
                                                product.name || "Product image"
                                            }
                                            className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                                            onError={(e) => {
                                                console.log(
                                                    "Image failed to load:",
                                                    e.target.src
                                                );
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://via.placeholder.com/600x400?text=Product+Image";
                                            }}
                                        />
                                    ) : (
                                        // No images available
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                            <div className="text-center p-4">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-16 w-16 text-gray-400 mx-auto mb-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <p className="text-gray-500">
                                                    Image not available
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Product data is still loading
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                    <div className="text-center p-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-16 w-16 text-gray-400 mx-auto mb-2 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        <p className="text-gray-500">
                                            Loading product...
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Decorative farm elements */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            {product &&
                                product.images &&
                                product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors duration-200 shadow-md border border-green-100"
                                        >
                                            <ChevronLeft className="h-6 w-6 text-green-700" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors duration-200 shadow-md border border-green-100"
                                        >
                                            <ChevronRight className="h-6 w-6 text-green-700" />
                                        </button>
                                    </>
                                )}

                            {/* Image gallery thumbnails with farming theme */}
                            {product &&
                                product.images &&
                                product.images.length > 1 && (
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                        {product.images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setCurrentImageIndex(index)
                                                }
                                                className={`w-3 h-3 rounded-full border ${
                                                    index === currentImageIndex
                                                        ? "bg-green-600 border-white"
                                                        : "bg-white/70 border-transparent"
                                                } shadow-sm`}
                                                aria-label={`View image ${
                                                    index + 1
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}

                            {/* Category tag with farming theme */}
                            {product && product.category && (
                                <div className="absolute top-4 left-4 bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                                        />
                                    </svg>
                                    {product.category}
                                </div>
                            )}

                            {/* Organic tag with farming theme */}
                            {product && product.organic && (
                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                                        />
                                    </svg>
                                    Organic
                                </div>
                            )}

                            {/* Freshness indicator */}
                            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-green-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 mr-1 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                Freshly Harvested
                            </div>
                        </div>

                        {/* Product Details Section with farming theme */}
                        <div className="p-6 md:p-8 relative">
                            {/* Decorative farm element */}
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-full h-full text-green-900"
                                >
                                    <path d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M3.019 11.115L18 5.667V9.09l4.006 1.456a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.006zM18 20.25v-9.565l1.5.545v9.02H18zm-9-6a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>

                            {/* Product title with farming theme */}
                            <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-1.5 rounded-full mr-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-green-700"
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
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-green-800">
                                    {product.name}
                                </h1>
                            </div>

                            {/* Product description with farming theme */}
                            <div className="mb-6 bg-green-50/50 p-4 rounded-xl border border-green-100/50 relative">
                                <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        className="text-green-800"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-medium mb-2 text-green-800">
                                    About this product
                                </h3>
                                <p className="text-gray-700">
                                    {product.description ||
                                        "This premium quality product is sourced directly from local farms. It's fresh, nutritious, and sustainably grown with care by our partner farmers."}
                                </p>

                                {/* Product highlights with farming theme */}
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        <span>Locally grown</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        <span>No pesticides</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        <span>Sustainable farming</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                        <span>Supports local farmers</span>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced price display with farming theme */}
                            <div className="flex items-baseline space-x-2 mb-6 p-4 rounded-xl bg-green-700/10">
                                <div className="flex items-center">
                                    <span className="text-3xl font-bold text-green-700">
                                        ₹{product.price?.toFixed(2) || "0.00"}
                                    </span>
                                    <span className="text-gray-500 ml-2">
                                        per {product.unit || "kg"}
                                    </span>
                                </div>
                                {product.oldPrice && (
                                    <div className="flex items-center">
                                        <span className="text-gray-400 line-through">
                                            ₹{product.oldPrice.toFixed(2)}
                                        </span>
                                        <span className="ml-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                                            SAVE{" "}
                                            {Math.round(
                                                ((product.oldPrice -
                                                    product.price) /
                                                    product.oldPrice) *
                                                    100
                                            )}
                                            %
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity selector with farming theme */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center">
                                    <button
                                        onClick={decrementQuantity}
                                        className="w-10 h-10 rounded-l-lg bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <div className="h-10 px-4 flex items-center justify-center bg-white border-t border-b border-green-200 text-lg font-medium">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={incrementQuantity}
                                        className="w-10 h-10 rounded-r-lg bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                    <span className="ml-3 text-gray-500">
                                        {product.unit || "kg"}
                                    </span>
                                </div>
                            </div>

                            {/* Action buttons with farming theme */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button
                                    onClick={() => setShowBuyPopup(true)}
                                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-all duration-200 shadow-sm"
                                >
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Buy Now
                                </button>
                                <button
                                    onClick={addToCart}
                                    className="bg-white border border-green-600 text-green-700 hover:bg-green-50 py-3 px-4 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Add to Cart
                                </button>
                            </div>

                            {/* Stock and delivery info with farming theme */}
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <div
                                        className={`w-3 h-3 rounded-full mr-2 ${
                                            product.stock > 0
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    ></div>
                                    <span
                                        className={
                                            product.stock > 0
                                                ? "text-green-700"
                                                : "text-red-700"
                                        }
                                    >
                                        {product.stock > 0
                                            ? `In Stock (${product.stock} ${
                                                  product.unit || "kg"
                                              } available)`
                                            : "Out of Stock"}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Truck className="h-4 w-4 mr-2 text-amber-600" />
                                    <div>
                                        <div className="font-medium text-amber-800">
                                            Farm Fresh Delivery
                                        </div>
                                        <div className="text-sm text-amber-700">
                                            Estimated delivery: 1-2 days
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Farm & Market Information with farming theme */}
                {product && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 relative z-10 mb-8">
                        <h3 className="font-medium text-lg text-green-800 mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-green-600" />
                            Farm & Market Details
                        </h3>

                        <div className="bg-green-50 rounded-xl p-4 mb-4 relative overflow-hidden">
                            {/* Decorative farm icon */}
                            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-24 h-24 text-green-900"
                                >
                                    <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
                                        clipRule="evenodd"
                                    />
                                    <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                                </svg>
                            </div>

                            <div className="relative">
                                <div className="font-medium text-green-800 mb-3">
                                    Farm Location
                                </div>
                                <div className="flex items-center text-sm text-gray-600 bg-white/60 p-3 rounded-lg mb-3">
                                    <MapPin className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                    <span>
                                        {product.location || "Local Farm"}
                                    </span>
                                </div>

                                <div className="font-medium text-green-800 mb-3">
                                    Harvest Information
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center text-sm text-gray-600 bg-white/60 p-3 rounded-lg">
                                        <Calendar className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                        <span>
                                            Harvested:{" "}
                                            {product.harvestDate
                                                ? new Date(
                                                      product.harvestDate
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "Recently harvested for maximum freshness"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 bg-white/60 p-3 rounded-lg">
                                        <Clock className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                        <span>
                                            Available until:{" "}
                                            {product.availableUntil
                                                ? new Date(
                                                      product.availableUntil
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "While supplies last"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                            <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                                <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                                Farming Practices
                            </h4>
                            <p className="text-sm text-amber-700 mb-3">
                                This product is grown using sustainable farming
                                practices that protect the environment and
                                support local ecosystems.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-white text-amber-700 text-xs px-2 py-1 rounded-full border border-amber-200">
                                    Organic Methods
                                </span>
                                <span className="bg-white text-amber-700 text-xs px-2 py-1 rounded-full border border-amber-200">
                                    Water Conservation
                                </span>
                                <span className="bg-white text-amber-700 text-xs px-2 py-1 rounded-full border border-amber-200">
                                    No Synthetic Pesticides
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Buy Popup */}
            {showBuyPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-green-800">
                                Confirm Order
                            </h2>
                            <button
                                onClick={() => setShowBuyPopup(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">
                                        Product:
                                    </span>
                                    <span className="font-medium">
                                        {product.name}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">
                                        Quantity:
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={decrementQuantity}
                                            className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full hover:bg-green-200"
                                        >
                                            -
                                        </button>
                                        <span className="font-medium text-lg w-8 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full hover:bg-green-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">
                                        Price per {product.unit}:
                                    </span>
                                    <span className="font-medium">
                                        ₹{product.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                    <label className="block text-gray-600 font-medium">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod("cash")
                                            }
                                            className={`p-4 rounded-lg flex items-center justify-center transition-all ${
                                                paymentMethod === "cash"
                                                    ? "bg-green-600 text-white shadow-lg scale-105"
                                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <ShoppingBag className="h-5 w-5 mr-2" />
                                            Cash on Delivery
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPaymentMethod("online")
                                            }
                                            className={`p-4 rounded-lg flex items-center justify-center transition-all ${
                                                paymentMethod === "online"
                                                    ? "bg-green-600 text-white shadow-lg scale-105"
                                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <ReceiptIndianRupeeIcon className="h-5 w-5 mr-2" />
                                            Online Payment
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                    <label className="block text-gray-600 font-medium">
                                        Delivery Location
                                    </label>
                                    <div className="relative">
                                        <div className="flex">
                                            <div className="relative flex-grow">
                                                <MapPin className="absolute left-4 top-4 text-gray-600 h-5 w-5" />
                                                <input
                                                    type="text"
                                                    value={location}
                                                    onChange={
                                                        handleLocationChange
                                                    }
                                                    ref={locationInputRef}
                                                    placeholder="Enter delivery address"
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
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
                                                className="bg-gray-100 px-4 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-200 transition-colors duration-200"
                                            >
                                                {isGettingLocation ? (
                                                    <div className="animate-spin h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full" />
                                                ) : (
                                                    <Navigation className="h-5 w-5 text-green-600" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Suggestions dropdown */}
                                        {showSuggestions &&
                                            suggestions.length > 0 && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                    {suggestions.map(
                                                        (suggestion) => (
                                                            <button
                                                                key={
                                                                    suggestion.place_id
                                                                }
                                                                onClick={() =>
                                                                    handleSelectSuggestion(
                                                                        suggestion.place_id
                                                                    )
                                                                }
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                                            >
                                                                <div className="flex items-center">
                                                                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                                                    <span>
                                                                        {
                                                                            suggestion.description
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {locationError && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {locationError}
                                        </p>
                                    )}
                                </div>

                                {/* Map */}
                                <div className="w-full rounded-lg overflow-hidden h-[200px]">
                                    {renderMap()}
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex-1 w-full bg-green-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-green-800">
                                            Total Amount:
                                        </span>
                                        <span className="text-2xl font-bold text-green-800">
                                            ₹
                                            {(product.price * quantity).toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => setShowBuyPopup(false)}
                                        className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBuyProduct}
                                        disabled={isLoading}
                                        className="flex-1 sm:flex-initial px-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors duration-200 disabled:bg-green-400"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin h-5 w-5 mr-2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            "Place Order"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;
