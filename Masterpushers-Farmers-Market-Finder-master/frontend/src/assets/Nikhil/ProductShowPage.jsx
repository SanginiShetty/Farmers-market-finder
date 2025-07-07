import React, { useState, useEffect } from "react";
import {
    MapPin,
    Building,
    Star,
    Filter,
    Search,
    ChevronDown,
    Tag,
} from "lucide-react";
import { API_BASE_URL } from '../../../config';

const ProductShowPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [marketFilter, setMarketFilter] = useState("All");
    const [products, setProducts] = useState([]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/product`);
                const data = await response.json();
                if (data.success) {
                    // Transform API data to match existing structure
                    const transformedProducts = data.products.map(product => ({
                        id: product._id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        unit: product.unit,
                        rating: 4.7, // Default value since API doesn't provide ratings
                        reviews: 0,  // Default value since API doesn't provide reviews
                        seller: product.farmerId, // You might want to fetch farmer details separately
                        location: "Location", // API doesn't provide location
                        market: "Market",    // API doesn't provide market
                        category: product.category,
                        image: product.image
                    }));
                    setProducts(transformedProducts);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Get unique categories and markets for filter dropdowns
    const categories = [
        "All",
        ...new Set(products.map((product) => product.category)),
    ];
    const markets = [
        "All",
        ...new Set(products.map((product) => product.market)),
    ];

    // Filter products based on search term and filters
    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "All" || product.category === categoryFilter;
        const matchesMarket =
            marketFilter === "All" || product.market === marketFilter;

        return matchesSearch && matchesCategory && matchesMarket;
    });

    const handleProductClick = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/product/${productId}`);
            const data = await response.json();
            if (data.success) {
                window.location.href = `/product/${productId}`;
            } else {
                console.error("Error fetching product details:", data.message);
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
            {/* Navigation bar */}
            {/* <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-green-700">FarmFresh Market</div>
          <div className="bg-green-600 text-white py-2 px-4 rounded-md font-medium">Sign In</div>
        </div>
      </nav> */}

            {/* Main content */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">
                        Fresh Local Products
                    </h1>
                    <p className="text-gray-600">
                        Discover fresh products from local farmers in your area
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        {/* Search input */}
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:border-green-500"
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        setCategoryFilter(e.target.value)
                                    }
                                >
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Market filter */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Market
                            </label>
                            <div className="relative">
                                <select
                                    className="appearance-none w-full bg-white border-2 border-gray-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:border-green-500"
                                    value={marketFilter}
                                    onChange={(e) =>
                                        setMarketFilter(e.target.value)
                                    }
                                >
                                    {markets.map((market, index) => (
                                        <option key={index} value={market}>
                                            {market}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Filter button */}
                        <button className="bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-green-200 transition duration-200">
                            <Filter className="h-5 w-5 mr-2" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
                            onClick={() => handleProductClick(product.id)}
                        >
                            <div className="relative h-48">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-green-600 text-white text-sm font-medium px-2 py-1 rounded-full">
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-4">
                                <h2 className="text-xl font-bold text-green-800 mb-2">
                                    {product.name}
                                </h2>

                                <div className="flex items-center text-amber-500 mb-2">
                                    <Star className="h-4 w-4 fill-amber-500 mr-1" />
                                    <span className="font-medium">
                                        {product.rating}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({product.reviews} reviews)
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex justify-between items-baseline">
                                    <div className="text-xl font-bold text-green-700">
                                    ₹{product.price.toFixed(2)}
                                        <span className="text-sm text-gray-500 font-normal">
                                            /{product.unit}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>{product.location}</span>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-sm text-gray-500">
                                    {/* <Building className="h-4 w-4 mr-1" /> */}
                                    {/* <span>{product.seller}</span> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredProducts.length === 0 && (
                    <div className="bg-white rounded-xl p-8 text-center">
                        <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500">
                            Try adjusting your search or filters to find what
                            you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductShowPage;
