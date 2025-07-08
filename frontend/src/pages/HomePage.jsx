import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    MapPin,
    Search,
    Truck,
    Apple,
    Leaf,
    ShoppingBag,
    Calendar,
    Users,
    ExternalLink,
    ChevronRight,
} from "lucide-react";
import ProductShowPage from "@/assets/Nikhil/ProductShowPage";
import MarketMap from "@/components/MarketMap";
import HeroSection from "./HeroSection";

const HomePage = () => {
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = async () => {
        console.log(`Searching for markets near ${location}`);
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/ampc?location=${location}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <HeroSection />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Display suggestions above the local markets section */}
                {suggestions.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center mb-8">
                            <div className="h-px bg-green-200 flex-grow"></div>
                            <h2 className="text-2xl font-bold px-6 text-green-800 flex items-center">
                                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                                Market Suggestions
                            </h2>
                            <div className="h-px bg-green-200 flex-grow"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestions.map((ampc, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-green-100"
                                >
                                    <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 text-white">
                                        <h3 className="text-xl font-semibold flex items-center">
                                            <Truck className="mr-2 h-5 w-5" />
                                            {ampc.ApmcFullCode}
                                        </h3>
                                    </div>

                                    <div className="p-5 space-y-3">
                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <p className="text-gray-700">
                                                {ampc.AddressE || ampc.AddressM}
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
                                                    Pin Code: {ampc.PinCode}
                                                </p>
                                            </div>
                                        )}

                                        {ampc.MarketList.length > 0 && (
                                            <div className="mt-4">
                                                <div className="text-sm font-medium text-green-700 mb-2 flex items-center">
                                                    <Leaf className="h-4 w-4 mr-1" />
                                                    {ampc.MarketList[0]
                                                        .MainMarketNameE ||
                                                        ampc.MarketList[0]
                                                            .MainMarketNameM}
                                                </div>
                                                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                    <MarketMap
                                                        addressE={ampc.AddressE}
                                                        addressM={ampc.AddressM}
                                                        marketName={
                                                            ampc.MarketList[0]
                                                                .MainMarketNameE ||
                                                            ampc.MarketList[0]
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Features Section */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-green-800 mb-3">
                            Why Choose Farmers Markets?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover the benefits of shopping directly from
                            local farmers and producers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-green-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center text-green-700">
                                    <MapPin className="mr-3 text-green-600 h-5 w-5" />
                                    Local Markets
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Discover farmers markets near you, with
                                    detailed location and schedule information.
                                </p>
                                <div className="flex items-center text-sm text-green-600 font-medium">
                                    <span>Find nearby markets</span>
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-green-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center text-green-700">
                                    <Apple className="mr-3 text-green-600 h-5 w-5" />
                                    Fresh Produce
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Find the freshest, locally-grown fruits,
                                    vegetables, and artisan products directly
                                    from farmers.
                                </p>
                                <div className="flex items-center text-sm text-green-600 font-medium">
                                    <span>Explore seasonal items</span>
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-green-100 shadow-md hover:shadow-lg transition-all duration-300 bg-white overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center text-green-700">
                                    <Truck className="mr-3 text-green-600 h-5 w-5" />
                                    Local Delivery
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Some markets offer local delivery or pickup
                                    options for added convenience.
                                </p>
                                <div className="flex items-center text-sm text-green-600 font-medium">
                                    <span>Check delivery options</span>
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Product Showcase Section */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                        <div className="inline-block px-4 py-1 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-3">
                            Featured Products
                        </div>
                        <h2 className="text-3xl font-bold text-green-800 mb-3">
                            Fresh From Our Farmers
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Browse our selection of seasonal, locally-grown
                            produce
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
                        <ProductShowPage />
                    </div>
                </div>

                {/* Testimonials or Farm Stories could go here */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-green-800 mb-2">
                            From Our Community
                        </h2>
                        <p className="text-gray-600">
                            Hear from farmers and customers who are part of our
                            growing community
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                                    <Users className="h-6 w-6 text-green-700" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        Farmer Spotlight
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Organic Farming Practices
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "We've been farming organically for over 15
                                years. Connecting directly with customers
                                through farmers markets has transformed our
                                business and allowed us to share our passion for
                                sustainable agriculture."
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                                    <ShoppingBag className="h-6 w-6 text-green-700" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        Customer Experience
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Weekly Market Shopper
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "Shopping at my local farmers market has changed
                                how I cook and eat. The quality and freshness of
                                the produce is unmatched, and I love knowing
                                exactly where my food comes from."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Banner */}
            <div className="bg-green-700 text-white py-10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Ready to discover fresh, local produce?
                    </h2>
                    <p className="mb-6 max-w-2xl mx-auto">
                        Find a farmers market near you and start enjoying the
                        benefits of farm-fresh food.
                    </p>
                    <Button className="bg-white text-green-700 hover:bg-green-50">
                        Find Markets Near Me
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
