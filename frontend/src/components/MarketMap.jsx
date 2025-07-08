import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const libraries = ["places"];

const MarketMap = ({ addressE, addressM, marketName }) => {
    const [coordinates, setCoordinates] = useState(null);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && (addressE || addressM)) {
            const geocoder = new window.google.maps.Geocoder();
            const address = addressE + addressM;

            console.log("Sending address to Google Maps API:", address);

            geocoder.geocode({ address }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                    setCoordinates(results[0].geometry.location);
                } else {
                    console.error("Geocode was not successful for the following reason: " + status);
                    if (status === "ZERO_RESULTS") {
                        console.warn("No results found for address:", address);
                    }
                }
            });
        }
    }, [isLoaded, addressE, addressM]);

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded || !coordinates) {
        return <div>Loading map...</div>;
    }

    const handleFindFarmers = () => {
        navigate(`/farmers/${marketName}`); 
    };

    return (
        <div>
            <GoogleMap
                mapContainerStyle={{ height: "200px", width: "100%" }}
                center={coordinates}
                zoom={15}
            >
                <Marker position={coordinates} />
            </GoogleMap>
            <button
                onClick={handleFindFarmers}
                className="mt-2 bg-blue-500 text-white rounded-lg px-4 py-2"
            >
                Find Farmers in {marketName}
            </button>
        </div>
    );
};

export default MarketMap;
