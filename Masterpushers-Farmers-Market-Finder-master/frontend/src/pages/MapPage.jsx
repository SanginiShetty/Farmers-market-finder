"use client";

import '@babel/polyfill';
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useLoadScript, GoogleMap, Marker, Autocomplete, DirectionsRenderer, Polyline } from "@react-google-maps/api";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Define the libraries array outside of the component
const libraries = ["places", "geometry"];

// Static data for farmers with spread out locations
const farmers = [
    { id: 1, name: "Farmer A", lat: 22.202194, lng: 72.861401, info: "Organic vegetables" },
    { id: 2, name: "Farmer B", lat: 21.444564, lng: 72.819052, info: "Fresh fruits" },
    { id: 3, name: "Farmer C", lat: 21.076090, lng: 72.877426, info: "Dairy products" },
    { id: 4, name: "Farmer D", lat: 21.218330, lng: 72.978088, info: "Herbs and spices" },
    { id: 5, name: "Farmer E", lat: 20.593684, lng: 78.962880, info: "Rice and wheat" },
    { id: 6, name: "Farmer F", lat: 19.076090, lng: 72.877426, info: "Citrus fruits" },
    { id: 7, name: "Farmer G", lat: 18.520430, lng: 73.856744, info: "Spices and herbs" },
    { id: 8, name: "Farmer H", lat: 17.385044, lng: 78.486671, info: "Vegetables" },
    { id: 9, name: "Farmer I", lat: 16.506174, lng: 80.648015, info: "Pulses" },
    { id: 10, name: "Farmer J", lat: 15.317277, lng: 75.713888, info: "Organic fruits" },
    { id: 11, name: "Farmer K", lat: 14.599512, lng: 74.124000, info: "Herbs" },
    { id: 12, name: "Farmer L", lat: 13.082680, lng: 80.270718, info: "Vegetables and fruits" },
    { id: 13, name: "Farmer M", lat: 12.971599, lng: 77.594566, info: "Dairy and meat" },
    { id: 14, name: "Farmer N", lat: 11.016844, lng: 76.955832, info: "Organic grains" },
    { id: 15, name: "Farmer O", lat: 10.850515, lng: 78.707197, info: "Local produce" }
];

const MapPage = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [originAddress, setOriginAddress] = useState("");
    const [destination, setDestination] = useState("");
    const [destinationCoordinates, setDestinationCoordinates] = useState(null);
    const [routePath, setRoutePath] = useState(null);
    const [directionsInstructions, setDirectionsInstructions] = useState(null);
    const [customMarkers, setCustomMarkers] = useState([]);
    const [showMarkers, setShowMarkers] = useState(false);
    const [nearbyMarkers, setNearbyMarkers] = useState([]);
    const inputRef = useRef(null);
    const [markerLabel, setMarkerLabel] = useState("");
    const [markerLat, setMarkerLat] = useState("");
    const [markerLng, setMarkerLng] = useState("");
    const [nearbyFarmers, setNearbyFarmers] = useState([]);
    const [showingNearby, setShowingNearby] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    // Initialize SpeechRecognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    
    try {
        recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            setDestination(speechToText);
            toast.success("Address transcribed!");
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            stopRecording();
            
            switch(event.error) {
                case 'network':
                    toast.error("Network error: Please check your internet connection.");
                    break;
                case 'not-allowed':
                    toast.error("Microphone access denied. Please allow microphone access.");
                    break;
                case 'no-speech':
                    toast.error("No speech was detected. Please try again.");
                    break;
                default:
                    toast.error(`Speech recognition error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            setRecording(false);
        };
        
    } catch (error) {
        console.error("Speech recognition not supported:", error);
        toast.error("Speech recognition is not supported in your browser.");
    }

    const startRecording = () => {
        if (!recognition) {
            toast.error("Speech recognition is not supported in your browser.");
            return;
        }
        try {
            setRecording(true);
            recognition.start();
        } catch (error) {
            console.error("Error starting recognition:", error);
            toast.error("Error starting speech recognition");
            setRecording(false);
        }
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
        }
        setRecording(false);
    };

    useEffect(() => {
        if (transcript) {
            setDestination(transcript); // Update the destination with the transcribed text
        }
    }, [transcript]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    useEffect(() => {
        if (isLoaded) {
            setGeocoder(new window.google.maps.Geocoder());
        }
    }, [isLoaded]);

    useEffect(() => {
        if (navigator.geolocation && isLoaded) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const currentLatLng = new window.google.maps.LatLng(lat, lng);
                    setCurrentLocation(currentLatLng);

                    if (geocoder) {
                        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                                setOriginAddress(results[0].formatted_address);
                            } else {
                                console.error("Geocoder failed due to: " + status);
                            }
                        });
                    }
                },
                () => {
                    const defaultLatLng = new window.google.maps.LatLng(37.7749, -122.4194);
                    setCurrentLocation(defaultLatLng);
                }
            );
        }
    }, [isLoaded, geocoder]);

    useEffect(() => {
        if (isLoaded && window.google && inputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ["geocode"],
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry) {
                    setDestinationCoordinates({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    });
                    setDestination(place.formatted_address);
                    toast.success("Address selected!");
                }
            });
        }
    }, [isLoaded]);

    const fetchDirections = async () => {
        if (selectedFarmer) {
            // If a farmer is selected, use their coordinates
            setDestinationCoordinates({
                lat: selectedFarmer.lat,
                lng: selectedFarmer.lng,
            });
            if (geocoder) {
                geocoder.geocode({ location: { lat: selectedFarmer.lat, lng: selectedFarmer.lng } }, async (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                        const formattedAddress = results[0].formatted_address;
                        setDestination(formattedAddress);
                        await fetchDirectionsWithAddress(formattedAddress);
                    } else {
                        console.error("Geocoder failed due to: " + status);
                        toast.error("Could not get destination address.");
                    }
                });
            }
        } else if (destinationCoordinates && originAddress) {
            // If no farmer is selected, use the destination node
            await fetchDirectionsWithAddress(destination);
        } else {
            toast.error("Please select a destination or a farmer.");
        }
    };

    const fetchDirectionsWithAddress = async (destinationAddress) => {
        console.log("Fetching directions with:");
        console.log("Origin:", originAddress);
        console.log("Destination:", destinationAddress);

        try {
            const response = await fetch(`http://localhost:3000/api/directions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    origin: { address: originAddress },
                    destination: { address: destinationAddress },
                    travelMode: "DRIVE"
                })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch directions");
            }

            const data = await response.json();
            console.log("Directions response:", data);

            if (data.routes && data.routes.length > 0) {
                const encoded = data.routes[0].polyline.encodedPolyline;
                const decodedPath = window.google.maps.geometry.encoding.decodePath(encoded);
                setRoutePath(decodedPath);

                if (data.routes[0].legs && data.routes[0].legs.length > 0 && data.routes[0].legs[0].steps) {
                    setDirectionsInstructions(data.routes[0].legs[0].steps);
                } else {
                    setDirectionsInstructions(null);
                }
            } else {
                toast.error("No routes found.");
                setRoutePath(null);
                setDirectionsInstructions(null);
            }
        } catch (error) {
            console.error("Error fetching directions: ", error);
            toast.error("Could not fetch directions.");
            setRoutePath(null);
            setDirectionsInstructions(null);
        }
    };

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const newMarker = { lat, lng, label: `Custom Marker ${customMarkers.length + 1}` };
        setCustomMarkers([...customMarkers, newMarker]);
        toast.success("Custom marker added!");
    };

    const calculateNearbyFarmers = () => {
        if (currentLocation) {
            const nearby = farmers;
            setNearbyFarmers(nearby);
            setShowingNearby(true);
            toast("Showing all farmers within 25 km.");
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleFarmerClick = (farmer) => {
        setSelectedFarmer(farmer);
        toast(`Selected: ${farmer.name}`);
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps...</div>;
    }

    return (
        <div className="p-5">
            {/* Display current location coordinates */}
            {currentLocation && (
                <div className="mb-4">
                    <h3>Current Location:</h3>
                    <p>Latitude: {currentLocation.lat()}</p>
                    <p>Longitude: {currentLocation.lng()}</p>
                </div>
            )}
            <div className="mb-4 flex items-center">
                <input
                    type="text"
                    ref={inputRef}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    placeholder="Enter an address"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <button onClick={recording ? stopRecording : startRecording} className="ml-2">
                    <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
                </button>
            </div>
            <button
                onClick={fetchDirections}
                className="mb-4 bg-blue-500 text-white rounded-lg px-4 py-2"
            >
                Get Directions
            </button>
            <button
                onClick={calculateNearbyFarmers}
                className="mb-4 bg-green-500 text-white rounded-lg px-4 py-2"
            >
                Show Nearby Farmers
            </button>
            <div className="mb-4">
                <h3>Add Custom Marker</h3>
                <input
                    type="text"
                    value={markerLat}
                    onChange={(e) => setMarkerLat(e.target.value)}
                    placeholder="Latitude"
                    className="border border-gray-300 rounded-lg px-2 py-1 mr-2"
                />
                <input
                    type="text"
                    value={markerLng}
                    onChange={(e) => setMarkerLng(e.target.value)}
                    placeholder="Longitude"
                    className="border border-gray-300 rounded-lg px-2 py-1 mr-2"
                />
                <input
                    type="text"
                    value={markerLabel}
                    onChange={(e) => setMarkerLabel(e.target.value)}
                    placeholder="Label"
                    className="border border-gray-300 rounded-lg px-2 py-1 mr-2"
                />
                <button
                    onClick={() => {
                        if (markerLat && markerLng && markerLabel) {
                            setCustomMarkers([...customMarkers, { lat: parseFloat(markerLat), lng: parseFloat(markerLng), label: markerLabel }]);
                            setMarkerLat("");
                            setMarkerLng("");
                            setMarkerLabel("");
                        } else {
                            toast.error("Please enter valid latitude, longitude, and label.");
                        }
                    }}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                    Add Marker
                </button>
            </div>
            {currentLocation && (
                <GoogleMap
                    mapContainerStyle={{ height: "400px", width: "800px" }}
                    center={currentLocation}
                    zoom={10}
                    onClick={handleMapClick}
                >
                    <Marker position={currentLocation} label="Current Location" />
                    {destinationCoordinates && (
                        <Marker position={destinationCoordinates} label="Destination" icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }} />
                    )}
                    {routePath && (
                        <Polyline
                            path={routePath}
                            options={{ strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 4 }}
                        />
                    )}
                    {(showingNearby ? nearbyFarmers : farmers).map((farmer, index) => (
                        <Marker
                            key={farmer.id}
                            position={{ lat: farmer.lat, lng: farmer.lng }}
                            label={farmer.name}
                            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }}
                            onClick={() => handleFarmerClick(farmer)}
                        />
                    ))}
                </GoogleMap>
            )}
            {selectedFarmer && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                    <h3>Farmer Information</h3>
                    <p><strong>Name:</strong> {selectedFarmer.name}</p>
                    <p><strong>Info:</strong> {selectedFarmer.info}</p>
                    <p><strong>Location:</strong> Latitude: {selectedFarmer.lat}, Longitude: {selectedFarmer.lng}</p>
                </div>
            )}
            {directionsInstructions && directionsInstructions.length > 0 && (
                <div>
                    <h3>Directions:</h3>
                    <ul>
                        {directionsInstructions.map((step, index) => (
                            <li key={index}>
                                {step.html_instructions
                                    ? step.html_instructions.replace(/<[^>]+>/g, "")
                                    : "Instruction not available"}{" "}
                                ({step.distance ? step.distance.text : "N/A"})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MapPage;
