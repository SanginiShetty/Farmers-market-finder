import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    useLoadScript,
    GoogleMap,
    Marker,
    Polyline,
} from "@react-google-maps/api";
import axios from "axios";
import {
    User,
    MapPin,
    Truck,
    Package,
    Navigation,
    AlertCircle,
    Leaf,
    Sun,
    Cloud,
    Wheat,
    Droplets,
    Sprout,
} from "lucide-react";

// Define libraries needed for Google Maps
const libraries = ["places", "geometry"];

const CourierMap = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [pickupCoordinates, setPickupCoordinates] = useState(null);
    const [routeToPickup, setRouteToPickup] = useState(null);
    const [routeToDestination, setRouteToDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [geocoder, setGeocoder] = useState(null);
    const [courierAddress, setCourierAddress] = useState("");
    const [pickupLocations, setPickupLocations] = useState({});

    // Add seasonal styling
    const [season, setSeason] = useState("summer");

    // Add new state for tracking assignment status
    const [assigningOrder, setAssigningOrder] = useState(false);

    // Load Google Maps script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    // Determine season based on current month
    useEffect(() => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) setSeason("spring");
        else if (month >= 5 && month <= 7) setSeason("summer");
        else if (month >= 8 && month <= 10) setSeason("autumn");
        else setSeason("winter");
    }, []);

    // Initialize geocoder when maps are loaded
    useEffect(() => {
        if (isLoaded) {
            setGeocoder(new window.google.maps.Geocoder());
        }
    }, [isLoaded]);

    // Get courier's current location
    useEffect(() => {
        if (navigator.geolocation && isLoaded) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const currentLatLng = new window.google.maps.LatLng(
                        lat,
                        lng
                    );
                    setCurrentLocation(currentLatLng);

                    if (geocoder) {
                        geocoder.geocode(
                            { location: { lat, lng } },
                            (results, status) => {
                                if (
                                    status ===
                                        window.google.maps.GeocoderStatus.OK &&
                                    results[0]
                                ) {
                                    setCourierAddress(
                                        results[0].formatted_address
                                    );
                                } else {
                                    console.error(
                                        "Geocoder failed due to: " + status
                                    );
                                }
                            }
                        );
                    }

                    // After getting location, fetch pickup locations
                    fetchPickupLocations();
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error(
                        "Could not get your location. Please enable location services."
                    );
                    setLoading(false);
                }
            );
        }
    }, [isLoaded, geocoder]);

    // Fetch pickup locations
    const fetchPickupLocations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://localhost:3000/api/v1/order",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (response.data && response.data.pickupLocations) {
                // Filter out locations with only unavailable orders
                const filteredLocations = {};

                Object.entries(response.data.pickupLocations).forEach(
                    ([location, orders]) => {
                        // Only include available orders
                        const availableOrders = orders.filter(
                            (order) => order.isAvailable === true
                        );

                        // Only add this location if it has available orders
                        if (availableOrders.length > 0) {
                            filteredLocations[location] = availableOrders;
                        }
                    }
                );

                setPickupLocations(filteredLocations);
            }
        } catch (error) {
            console.error("Error fetching pickup locations:", error);
            toast.error("Failed to fetch pickup locations");
        } finally {
            setLoading(false);
        }
    };

    // Fetch directions with address
    const fetchDirectionsWithAddress = async (
        origin,
        destinationAddress,
        isPickupRoute
    ) => {
        console.log("Fetching directions with:");
        console.log("Origin:", origin);
        console.log("Destination:", destinationAddress);

        try {
            const response = await fetch(
                `http://localhost:3000/api/directions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        origin: { address: origin },
                        destination: { address: destinationAddress },
                        travelMode: "DRIVE",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch directions");
            }

            const data = await response.json();
            console.log("Directions response:", data);

            if (data.routes && data.routes.length > 0) {
                const encoded = data.routes[0].polyline.encodedPolyline;
                const decodedPath =
                    window.google.maps.geometry.encoding.decodePath(encoded);

                // Set the route based on whether it's a pickup route or destination route
                if (isPickupRoute) {
                    setRouteToPickup(decodedPath); // Green route to pickup
                } else {
                    setRouteToDestination(decodedPath); // Red route to destination
                }
            } else {
                toast.error("No routes found.");
                if (isPickupRoute) {
                    setRouteToPickup(null);
                } else {
                    setRouteToDestination(null);
                }
            }
        } catch (error) {
            console.error("Error fetching directions: ", error);
            toast.error("Could not fetch directions.");
            if (isPickupRoute) {
                setRouteToPickup(null);
            } else {
                setRouteToDestination(null);
            }
        }
    };

    // Select a pickup location and fetch orders
    const handlePickupLocationSelect = async (location) => {
        setPickupLocation(location);
        const ordersAtLocation = pickupLocations[location] || [];

        // Filter to only include available orders
        const availableOrdersAtLocation = ordersAtLocation.filter(
            (order) => order.isAvailable === true
        );

        const ordersWithCoordinates = await Promise.all(
            availableOrdersAtLocation.map(async (order) => {
                if (order.location && geocoder) {
                    try {
                        const results = await new Promise((resolve, reject) => {
                            geocoder.geocode(
                                { address: order.location },
                                (results, status) => {
                                    if (
                                        status ===
                                            window.google.maps.GeocoderStatus
                                                .OK &&
                                        results[0]
                                    ) {
                                        resolve(results);
                                    } else {
                                        reject(status);
                                    }
                                }
                            );
                        });
                        const location = results[0].geometry.location;
                        return {
                            ...order,
                            coordinates: {
                                lat: location.lat(),
                                lng: location.lng(),
                            },
                        };
                    } catch (error) {
                        console.error(
                            `Error geocoding address for order ${order._id}:`,
                            error
                        );
                        return order; // Return order without coordinates
                    }
                }
                return order;
            })
        );

        // Filter out orders without coordinates
        const validOrders = ordersWithCoordinates.filter(
            (order) => order.coordinates
        );
        setAvailableOrders(validOrders);

        // Geocode the selected pickup location to get its coordinates
        try {
            const results = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: location }, (results, status) => {
                    if (
                        status === window.google.maps.GeocoderStatus.OK &&
                        results[0]
                    ) {
                        resolve(results);
                    } else {
                        reject(status);
                    }
                });
            });
            const pickupLocationCoords = results[0].geometry.location;
            setPickupCoordinates({
                lat: pickupLocationCoords.lat(),
                lng: pickupLocationCoords.lng(),
            });
        } catch (error) {
            console.error(`Error geocoding pickup location:`, error);
            setPickupCoordinates(null); // Reset if there's an error
        }
        const pickupCoordinates = { currentLocation };

        // Calculate route to the selected pickup location
        await fetchDirectionsWithAddress(courierAddress, location, true);
    };

    // Select an order and calculate route from current location to pickup and then to destination
    const handleOrderSelect = async (order) => {
        setSelectedOrder(order);
        toast.success(`Selected order #${order._id}`);

        // Ensure pickupCoordinates are set before calculating the route
        if (pickupCoordinates && currentLocation) {
            // Fetch directions from current location to pickup location (green route)
            await fetchDirectionsWithAddress(
                courierAddress,
                pickupLocation,
                true
            ); // From current location to pickup
            // Fetch directions from pickup location to order destination (red route)
            await fetchDirectionsWithAddress(
                pickupLocation,
                order.location,
                false
            ); // From pickup to destination
        } else {
            toast.error(
                "Pickup location coordinates or current location are missing."
            );
        }
    };

    // Handle order assignment
    const handleAssignOrder = async () => {
        if (!selectedOrder || !selectedOrder._id) {
            toast.error("No order selected for assignment");
            return;
        }

        try {
            setAssigningOrder(true);

            // The backend will use the JWT token to identify the courier
            // We just need to make a request to the correct endpoint with the order ID
            const response = await axios.put(
                `http://localhost:3000/api/v1/order/${selectedOrder._id}/assign`,
                {}, // Empty body as the backend uses the JWT to find the courier
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success(
                    "Order assigned successfully! You can now start the delivery."
                );

                // Update the selected order to show it's no longer available
                setSelectedOrder({
                    ...selectedOrder,
                    isAvailable: false,
                    courier: req.user._id, // Mark as assigned to current user
                });

                // Remove the assigned order from available orders
                setAvailableOrders((prevOrders) =>
                    prevOrders.filter(
                        (order) => order._id !== selectedOrder._id
                    )
                );

                // Refresh pickup locations to get updated data
                fetchPickupLocations();
            }
        } catch (error) {
            console.error("Error assigning order:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to assign order";

            if (errorMessage === "Courier not found") {
                toast.error(
                    "You need to register as a courier first. Please contact support."
                );
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setAssigningOrder(false);
        }
    };

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
                    mapStyle: "#00c853", // Green for spring
                };
            case "summer":
                return {
                    primary: "from-green-600 to-yellow-500",
                    secondary: "bg-green-50",
                    accent: "text-green-600",
                    icon: <Sun className="h-6 w-6 text-yellow-500" />,
                    name: "Summer",
                    mapStyle: "#ffa000", // Amber for summer
                };
            case "autumn":
                return {
                    primary: "from-orange-500 to-amber-400",
                    secondary: "bg-amber-50",
                    accent: "text-amber-600",
                    icon: <Wheat className="h-6 w-6 text-amber-500" />,
                    name: "Autumn",
                    mapStyle: "#e65100", // Deep orange for autumn
                };
            case "winter":
                return {
                    primary: "from-blue-500 to-indigo-400",
                    secondary: "bg-blue-50",
                    accent: "text-blue-600",
                    icon: <Cloud className="h-6 w-6 text-blue-500" />,
                    name: "Winter",
                    mapStyle: "#0d47a1", // Deep blue for winter
                };
            default:
                return {
                    primary: "from-green-600 to-green-500",
                    secondary: "bg-green-50",
                    accent: "text-green-600",
                    icon: <Leaf className="h-6 w-6 text-green-500" />,
                    name: "Harvest",
                    mapStyle: "#2e7d32", // Green for default
                };
        }
    };

    const seasonalStyle = getSeasonalStyles();

    if (loadError) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${seasonalStyle.secondary}`}
            >
                <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-100 max-w-md">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Map Loading Error
                    </h3>
                    <p className="text-gray-600 mt-2">{loadError.message}</p>
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

    if (!isLoaded || loading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${seasonalStyle.secondary}`}
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
                        Mapping your delivery routes...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${seasonalStyle.secondary} py-8 relative overflow-hidden`}
        >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <Truck className="h-96 w-96 text-green-800" />
            </div>
            <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none">
                <Package className="h-96 w-96 text-green-800" />
            </div>
            <div className="absolute top-1/4 left-10 opacity-5 pointer-events-none">
                <Navigation className="h-64 w-64 text-green-800" />
            </div>
            <div className="absolute bottom-1/4 right-10 opacity-5 pointer-events-none">
                <MapPin className="h-64 w-64 text-green-800" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Season indicator */}
                <div className="flex items-center justify-center mb-6 bg-white rounded-full py-2 px-6 shadow-md w-fit mx-auto">
                    {seasonalStyle.icon}
                    <span
                        className={`ml-2 font-medium ${seasonalStyle.accent}`}
                    >
                        {seasonalStyle.name} Season Deliveries
                    </span>
                </div>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 mb-8">
                    <div
                        className={`bg-gradient-to-r ${seasonalStyle.primary} h-32 relative`}
                    >
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full">
                                <div className="h-4 w-4 bg-white rounded-full absolute top-10 left-10 opacity-60"></div>
                                <div className="h-3 w-3 bg-white rounded-full absolute top-20 left-40 opacity-40"></div>
                                <div className="h-5 w-5 bg-white rounded-full absolute top-8 right-20 opacity-50"></div>
                                <div className="h-2 w-2 bg-white rounded-full absolute top-30 right-60 opacity-70"></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 left-8 flex items-center">
                            <div className="h-20 w-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg flex items-center justify-center">
                                <Truck className="h-12 w-12 text-gray-500" />
                            </div>
                            <div className="ml-4 text-white">
                                <h1 className="text-2xl font-bold">
                                    Courier Delivery Map
                                </h1>
                                <p className="opacity-90">
                                    Find and manage your delivery routes
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-6 px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div
                                className={`p-4 rounded-xl ${seasonalStyle.secondary} border border-green-100 shadow-sm`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <User
                                            className={`h-5 w-5 ${seasonalStyle.accent}`}
                                        />
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                        Your Location
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-600 pl-10">
                                    {courierAddress || "Locating..."}
                                </p>
                            </div>

                            {pickupLocation && (
                                <div
                                    className={`p-4 rounded-xl ${seasonalStyle.secondary} border border-green-100 shadow-sm`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                            <Package
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <span className="text-gray-700 font-medium">
                                            Pickup Location
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-600 pl-10">
                                        {pickupLocation}
                                    </p>
                                </div>
                            )}

                            {selectedOrder && (
                                <div
                                    className={`p-4 rounded-xl ${seasonalStyle.secondary} border border-green-100 shadow-sm`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-white rounded-full shadow-sm">
                                            <MapPin
                                                className={`h-5 w-5 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <span className="text-gray-700 font-medium">
                                            Delivery Destination
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-600 pl-10">
                                        {selectedOrder.location}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Map and Orders Section */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Map Container */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100 h-[600px]">
                            {currentLocation && (
                                <GoogleMap
                                    mapContainerStyle={{
                                        height: "100%",
                                        width: "100%",
                                    }}
                                    center={currentLocation}
                                    zoom={12}
                                    options={{
                                        styles: [
                                            {
                                                featureType: "all",
                                                elementType: "labels.text.fill",
                                                stylers: [{ color: "#6c757d" }],
                                            },
                                            {
                                                featureType: "water",
                                                elementType: "geometry.fill",
                                                stylers: [{ color: "#e9f5f8" }],
                                            },
                                            {
                                                featureType: "landscape",
                                                elementType: "geometry.fill",
                                                stylers: [{ color: "#f8f9fa" }],
                                            },
                                        ],
                                    }}
                                >
                                    {/* Courier's current location */}
                                    <Marker
                                        position={currentLocation}
                                        icon={{
                                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                            scaledSize:
                                                new window.google.maps.Size(
                                                    40,
                                                    40
                                                ),
                                        }}
                                        label="You"
                                    />

                                    {/* Pickup location */}
                                    {pickupCoordinates && (
                                        <Marker
                                            position={pickupCoordinates}
                                            icon={{
                                                url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                                                scaledSize:
                                                    new window.google.maps.Size(
                                                        40,
                                                        40
                                                    ),
                                            }}
                                            label="Pickup"
                                        />
                                    )}

                                    {/* Available orders */}
                                    {availableOrders.map((order) => (
                                        <Marker
                                            key={order._id}
                                            position={order.coordinates}
                                            icon={{
                                                url:
                                                    selectedOrder &&
                                                    selectedOrder._id ===
                                                        order._id
                                                        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                                                        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                                scaledSize:
                                                    new window.google.maps.Size(
                                                        30,
                                                        30
                                                    ),
                                            }}
                                            onClick={() =>
                                                handleOrderSelect(order)
                                            }
                                        />
                                    ))}

                                    {/* Route from current location to pickup */}
                                    {routeToPickup && (
                                        <Polyline
                                            path={routeToPickup}
                                            options={{
                                                strokeColor:
                                                    seasonalStyle.mapStyle,
                                                strokeOpacity: 0.8,
                                                strokeWeight: 5,
                                                icons: [
                                                    {
                                                        icon: {
                                                            path: window.google
                                                                .maps.SymbolPath
                                                                .FORWARD_CLOSED_ARROW,
                                                        },
                                                        offset: "50%",
                                                        repeat: "100px",
                                                    },
                                                ],
                                            }}
                                        />
                                    )}

                                    {/* Route from pickup to destination */}
                                    {routeToDestination && (
                                        <Polyline
                                            path={routeToDestination}
                                            options={{
                                                strokeColor: "#FF4500",
                                                strokeOpacity: 0.8,
                                                strokeWeight: 5,
                                                icons: [
                                                    {
                                                        icon: {
                                                            path: window.google
                                                                .maps.SymbolPath
                                                                .FORWARD_CLOSED_ARROW,
                                                        },
                                                        offset: "50%",
                                                        repeat: "100px",
                                                    },
                                                ],
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            )}
                        </div>

                        {/* Route Legend */}
                        {(routeToPickup || routeToDestination) && (
                            <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-green-100">
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    Route Legend
                                </h3>
                                <div className="flex flex-col space-y-2">
                                    {routeToPickup && (
                                        <div className="flex items-center">
                                            <div
                                                className="w-6 h-2 rounded"
                                                style={{
                                                    backgroundColor:
                                                        seasonalStyle.mapStyle,
                                                }}
                                            ></div>
                                            <span className="ml-2 text-sm text-gray-600">
                                                Route to pickup location
                                            </span>
                                        </div>
                                    )}
                                    {routeToDestination && (
                                        <div className="flex items-center">
                                            <div className="w-6 h-2 rounded bg-red-500"></div>
                                            <span className="ml-2 text-sm text-gray-600">
                                                Route to delivery destination
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Orders List */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        {/* Pickup Locations */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                            <div
                                className={`bg-gradient-to-r ${seasonalStyle.primary} py-3 px-4`}
                            >
                                <h3 className="text-white font-semibold flex items-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Pickup Locations
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                {Object.keys(pickupLocations).length > 0 ? (
                                    Object.keys(pickupLocations).map(
                                        (location) => (
                                            <div
                                                key={location}
                                                className={`p-3 rounded-lg border ${
                                                    pickupLocation === location
                                                        ? "border-green-500 bg-green-50"
                                                        : "border-gray-200"
                                                }`}
                                            >
                                                <p className="text-gray-700">
                                                    {location}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {
                                                        pickupLocations[
                                                            location
                                                        ].length
                                                    }{" "}
                                                    orders available
                                                </p>
                                                <button
                                                    className={`mt-2 w-full bg-gradient-to-r ${seasonalStyle.primary} text-white px-3 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm`}
                                                    onClick={() =>
                                                        handlePickupLocationSelect(
                                                            location
                                                        )
                                                    }
                                                >
                                                    Select Location
                                                </button>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="text-center py-6">
                                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-500">
                                            No pickup locations available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Orders */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                            <div
                                className={`bg-gradient-to-r ${seasonalStyle.primary} py-3 px-4`}
                            >
                                <h3 className="text-white font-semibold flex items-center">
                                    <Truck className="h-5 w-5 mr-2" />
                                    Available Orders
                                </h3>
                            </div>
                            <div className="p-4">
                                {availableOrders.length > 0 ? (
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        {availableOrders.map((order) => (
                                            <div
                                                key={order._id}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                                    selectedOrder &&
                                                    selectedOrder._id ===
                                                        order._id
                                                        ? `border-${
                                                              seasonalStyle.accent.split(
                                                                  "-"
                                                              )[1]
                                                          } ${
                                                              seasonalStyle.secondary
                                                          }`
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() =>
                                                    handleOrderSelect(order)
                                                }
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            Order #
                                                            {order._id.substring(
                                                                0,
                                                                8
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {order.product}
                                                        </p>
                                                    </div>
                                                    <span className="text-green-600 font-semibold">
                                                        ${order.totalAmount}
                                                    </span>
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-500">
                                                    <p className="flex items-center">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {order.location}
                                                    </p>
                                                </div>
                                                <button
                                                    className={`mt-2 w-full bg-gradient-to-r ${seasonalStyle.primary} text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-all text-sm shadow-sm`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOrderSelect(
                                                            order
                                                        );
                                                    }}
                                                >
                                                    Show Route
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div
                                            className={`w-16 h-16 mx-auto mb-4 rounded-full ${seasonalStyle.secondary} flex items-center justify-center`}
                                        >
                                            <Package
                                                className={`h-8 w-8 ${seasonalStyle.accent}`}
                                            />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-800">
                                            No orders available
                                        </h3>
                                        <p
                                            className={`${seasonalStyle.accent} mt-2 max-w-md mx-auto text-sm`}
                                        >
                                            Select a pickup location to see
                                            available orders for delivery
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Order Details */}
                        {selectedOrder && (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                                <div
                                    className={`bg-gradient-to-r ${seasonalStyle.primary} py-3 px-4`}
                                >
                                    <h3 className="text-white font-semibold flex items-center">
                                        <Navigation className="h-5 w-5 mr-2" />
                                        Delivery Details
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Order ID:
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                #
                                                {selectedOrder._id.substring(
                                                    0,
                                                    8
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Customer:
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {selectedOrder.customer}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Product:
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {selectedOrder.product}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Amount:
                                            </span>
                                            <span className="font-medium text-green-600">
                                                ${selectedOrder.totalAmount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Quantity:
                                            </span>
                                            <span className="font-medium text-gray-800">
                                                {selectedOrder.quantity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Payment:
                                            </span>
                                            <span
                                                className={`font-medium ${
                                                    selectedOrder.paymentStatus ===
                                                    "Paid"
                                                        ? "text-green-600"
                                                        : "text-orange-500"
                                                }`}
                                            >
                                                {selectedOrder.paymentMethod} (
                                                {selectedOrder.paymentStatus})
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`mt-4 p-3 ${seasonalStyle.secondary} rounded-lg border border-green-100`}
                                    >
                                        <p className="font-medium text-gray-800 mb-2">
                                            Delivery Instructions:
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-start">
                                                <div className="bg-white rounded-full p-1 mr-2 mt-0.5">
                                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                                        1
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">
                                                    Pick up from{" "}
                                                    {pickupLocation}
                                                </p>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="bg-white rounded-full p-1 mr-2 mt-0.5">
                                                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                                                        2
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">
                                                    Deliver to{" "}
                                                    {selectedOrder.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className={`mt-4 w-full bg-gradient-to-r ${
                                            seasonalStyle.primary
                                        } text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-md ${
                                            assigningOrder ? "opacity-75" : ""
                                        }`}
                                        onClick={handleAssignOrder}
                                        disabled={
                                            assigningOrder ||
                                            (selectedOrder &&
                                                !selectedOrder.isAvailable)
                                        }
                                    >
                                        {assigningOrder ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                Assigning Order...
                                            </span>
                                        ) : selectedOrder &&
                                          !selectedOrder.isAvailable ? (
                                            "Order Already Assigned"
                                        ) : (
                                            "Start Delivery"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourierMap;
