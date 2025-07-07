import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    MapPin,
    Search,
    Truck,
    Apple,
    Leaf,
    ExternalLink,
    Sun,
    Calendar,
    ShoppingBag,
    Users,
    Sprout,
    Wheat,
    CloudSun,
    Droplets,
    Wind,
} from "lucide-react";
import ProductShowPage from "@/assets/Nikhil/ProductShowPage";
import MarketMap from "@/components/MarketMap";
import { API_BASE_URL } from "../../config";
import { useState, useEffect } from "react";

const HeroSection = () => {
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [currentSeason, setCurrentSeason] = useState("");
    const [seasonalProduce, setSeasonalProduce] = useState([]);

    // Determine current season
    useEffect(() => {
        const month = new Date().getMonth();
        let season;
        let produce = [];

        if (month >= 2 && month <= 4) {
            season = "Spring";
            produce = [
                "Spinach",
                "Peas",
                "Asparagus",
                "Strawberries",
                "Radishes",
            ];
        } else if (month >= 5 && month <= 7) {
            season = "Summer";
            produce = [
                "Tomatoes",
                "Corn",
                "Cucumbers",
                "Peppers",
                "Watermelon",
            ];
        } else if (month >= 8 && month <= 10) {
            season = "Autumn";
            produce = [
                "Apples",
                "Pumpkins",
                "Sweet Potatoes",
                "Broccoli",
                "Grapes",
            ];
        } else {
            season = "Winter";
            produce = [
                "Kale",
                "Potatoes",
                "Carrots",
                "Cabbage",
                "Citrus Fruits",
            ];
        }

        setCurrentSeason(season);
        setSeasonalProduce(produce);
    }, []);

    const handleSearch = async () => {
        if (!location.trim()) {
            return;
        }

        console.log(`Searching for markets near ${location}`);
        setIsSearching(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/v1/ampc?location=${location}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Get season icon
    const getSeasonIcon = () => {
        switch (currentSeason) {
            case "Spring":
                return <Sprout className="h-6 w-6 text-green-400" />;
            case "Summer":
                return <Sun className="h-6 w-6 text-yellow-400" />;
            case "Autumn":
                return <Wheat className="h-6 w-6 text-orange-400" />;
            case "Winter":
                return <CloudSun className="h-6 w-6 text-blue-400" />;
            default:
                return <Leaf className="h-6 w-6 text-green-400" />;
        }
    };

    return (
        <div className="relative bg-gradient-to-b from-green-800 to-green-700 text-white overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/api/placeholder/1200/600"
                    alt="Farmers market with fresh produce"
                    className="w-full h-full object-cover opacity-20"
                />
                {/* Overlay pattern */}
                <div
                    className="absolute inset-0 bg-green-900 opacity-30"
                    style={{
                        backgroundImage:
                            'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.05" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
                    }}
                ></div>

                {/* Animated floating elements - reduced size */}
                <div className="absolute top-1/4 left-1/5 animate-float-slow">
                    <Leaf className="w-12 h-12 text-green-300 opacity-10" />
                </div>
                <div className="absolute top-2/3 right-1/4 animate-float-medium">
                    <Apple className="w-14 h-14 text-red-300 opacity-10" />
                </div>
            </div>

            {/* Reduced decorative elements */}
            <div className="absolute top-10 left-10 w-16 h-16 opacity-10">
                <Leaf className="w-full h-full text-green-200" />
            </div>

            <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Season badge - more compact */}
                    <div className="inline-block mb-3 px-3 py-1 bg-green-600/30 rounded-full backdrop-blur-sm">
                        <span className="text-green-50 font-medium text-sm flex items-center">
                            {getSeasonIcon()}
                            <span className="ml-2">
                                {currentSeason} Season • Farm Fresh
                            </span>
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                        Fresh From The Farm <br className="hidden md:block" />
                        <span className="text-green-300">To Your Table</span>
                    </h1>

                    <p className="text-base md:text-lg mb-6 text-green-50 max-w-2xl mx-auto">
                        Discover local farmers markets in your area, connect
                        with producers, and enjoy fresh, seasonal produce that
                        supports your community.
                    </p>

                    {/* Seasonal produce highlight - more compact */}
                    <div className="mb-6 p-4 bg-gradient-to-br from-green-800/40 to-green-700/40 backdrop-blur-sm rounded-xl border border-green-500/20 shadow-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center justify-center text-green-100">
                            <Calendar className="mr-2 h-4 w-4 text-green-300" />
                            What's in Season Now
                        </h3>

                        <div className="flex flex-wrap justify-center gap-2 mb-3">
                            {seasonalProduce.map((item, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-green-600/40 hover:bg-green-500/50 transition-colors rounded-lg text-xs font-medium text-white shadow-sm"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-green-100 text-sm">
                                From farm-fresh produce to poultry and dairy —
                                <span className="text-amber-300 font-medium">
                                    {" "}
                                    discover your local market.
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                        <div className="relative flex-grow">
                            <Input
                                type="text"
                                placeholder="Enter your location"
                                className="pl-10 py-2 bg-white/90 text-black border-green-400 focus-visible:ring-green-500 rounded-lg"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleSearch()
                                }
                            />
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="bg-green-500 hover:bg-green-600 py-2 px-4 text-white rounded-lg shadow-lg hover:shadow-green-500/20 transition-all"
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <div className="flex items-center">
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
                                    Searching...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Search className="mr-2 h-4 w-4" />
                                    Find Markets
                                </div>
                            )}
                        </Button>
                    </div>

                    {/* Benefits section - more compact */}
                    <div className="mt-8 grid grid-cols-3 gap-3 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-green-600/20">
                            <div className="bg-green-600/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                                <ShoppingBag className="h-4 w-4 text-green-300" />
                            </div>
                            <h3 className="text-sm font-semibold mb-1">
                                Fresh & Local
                            </h3>
                            <p className="text-green-100 text-xs">
                                Peak ripeness for maximum flavor
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-green-600/20">
                            <div className="bg-green-600/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Users className="h-4 w-4 text-green-300" />
                            </div>
                            <h3 className="text-sm font-semibold mb-1">
                                Support Farmers
                            </h3>
                            <p className="text-green-100 text-xs">
                                Connect with local growers
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-green-600/20">
                            <div className="bg-green-600/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Wind className="h-4 w-4 text-green-300" />
                            </div>
                            <h3 className="text-sm font-semibold mb-1">
                                Eco-Friendly
                            </h3>
                            <p className="text-green-100 text-xs">
                                Reduce food miles
                            </p>
                        </div>
                    </div>

                    {/* Display suggestions - more compact */}
                    {suggestions.length > 0 && (
                        <div className="mt-8 max-w-4xl mx-auto">
                            <div className="flex items-center justify-center mb-4">
                                <div className="h-px bg-green-400/30 w-12"></div>
                                <h2 className="text-xl font-bold px-3 flex items-center">
                                    <MapPin className="mr-2 h-4 w-4 text-green-300" />
                                    Market Suggestions
                                </h2>
                                <div className="h-px bg-green-400/30 w-12"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suggestions.map((ampc, index) => (
                                    <Card
                                        key={index}
                                        className="bg-white/95 backdrop-blur-sm border-green-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4">
                                            <CardTitle className="text-xl font-semibold flex items-center">
                                                <Truck className="h-5 w-5 mr-2" />
                                                {ampc.ApmcFullCode}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5">
                                            <div className="space-y-3">
                                                <div className="flex items-start">
                                                    <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <p className="text-gray-700">
                                                        {ampc.AddressE ||
                                                            ampc.AddressM}
                                                    </p>
                                                </div>

                                                {ampc.Phone && (
                                                    <div className="flex items-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-green-600 mr-2"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                            />
                                                        </svg>
                                                        <p className="text-gray-700">
                                                            {ampc.Phone}
                                                        </p>
                                                    </div>
                                                )}

                                                {ampc.PinCode && (
                                                    <div className="flex items-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 text-green-600 mr-2"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                            />
                                                        </svg>
                                                        <p className="text-gray-700">
                                                            Pin Code:{" "}
                                                            {ampc.PinCode}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {ampc.MarketList.length > 0 && (
                                                <div className="mt-4">
                                                    <div className="text-sm font-medium text-green-700 mb-2 flex items-center">
                                                        <Leaf className="h-4 w-4 mr-1" />
                                                        {ampc.MarketList[0]
                                                            .MainMarketNameE ||
                                                            ampc.MarketList[0]
                                                                .MainMarketNameM}
                                                    </div>
                                                    <div className="rounded-lg overflow-hidden border border-gray-200">
                                                        <MarketMap
                                                            addressE={
                                                                ampc.AddressE
                                                            }
                                                            addressM={
                                                                ampc.AddressM
                                                            }
                                                            marketName={
                                                                ampc
                                                                    .MarketList[0]
                                                                    .MainMarketNameE ||
                                                                ampc
                                                                    .MarketList[0]
                                                                    .MainMarketNameM
                                                            }
                                                        />
                                                    </div>
                                                    <a
                                                        href={`https://maps.google.com/?q=${
                                                            ampc.AddressE ||
                                                            ampc.AddressM
                                                        }`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium flex items-center justify-center py-2 border border-green-200 rounded-md hover:bg-green-50 transition-colors"
                                                    >
                                                        <ExternalLink className="h-4 w-4 mr-1" />
                                                        Get Directions
                                                    </a>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Wave SVG divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="fill-white h-12 w-full"
                >
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </div>
    );
};

// Add these animations to your global CSS or tailwind config
// @keyframes float-slow {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-20px); }
// }
// @keyframes float-medium {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-15px); }
// }
// @keyframes float-fast {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
// }

export default HeroSection;
