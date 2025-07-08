import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserRegisterPage from "./assets/Nikhil/UserRegistrationPage";
import LoginPage from "./assets/Nikhil/LoginPage";
import ProductListingPage from "./assets/Nikhil/ProductListingPage";
import MapPage from "./pages/MapPage";

import Layout from "./layout";
import Landingpage from "./pages/Landingpage";
import FarmerProfilePage from "./assets/Nikhil/FarmerProfilePage";
import ProductShowPage from "./assets/Nikhil/ProductShowPage";
import ProductDetailPage from "./assets/Nikhil/ProductDetailPage";
import CustomerRegister from "./assets/Nikhil/customerRegister";
import AllRegister from "./pages/allRegister";
import CourierRegister from "./assets/Nikhil/courierRegister";
import CourierDetails from "./components/admin/CourierDetails";
import AdminLogin from "./components/admin/adminLogin";
import Dashboard from "./components/admin/adminDashboard";
import CouriersList from "./components/admin/CouriersList";
import CourierMap from "./assets/Nikhil/CourierMap";
import CartPage from "./assets/Nikhil/CartPage";
import ProfileCourier from "./components/ProfileCourier";           
import ProfileCustomer from "./components/ProfileCustomer";
import FarmerLocationPage from "./pages/FarmerLocationPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Landingpage />} />
                    <Route
                        path="/product/listing"
                        element={<ProductListingPage />}
                    />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/product-show" element={<ProductShowPage />} />
                    <Route
                        path="/product/:id"
                        element={<ProductDetailPage />}
                    />
                    <Route
                        path="/farmer/register"
                        element={<UserRegisterPage />}
                    />
                    <Route
                        path="/customer/register"
                        element={<CustomerRegister />}
                    />
                     <Route path="/cart" element={<CartPage />} />
                    <Route path="/allRegister" element={<AllRegister />} />
                    <Route path="/courier/register" element={<CourierRegister   />} />
                    <Route path="/courier/map" element={<CourierMap/>} />
                    <Route
                        path="/courier/register"
                        element={<CourierRegister />}
                    />
                    <Route
                        path="/profile/farmer"
                        element={<FarmerProfilePage />}
                    />
                    <Route
                        path="/profile/courier"
                        element={<ProfileCourier />}
                    />
                    <Route
                        path="/profile/customer"
                        element={<ProfileCustomer />}
                    />
                 <Route path="/farmers/:city" element={<FarmerLocationPage />} />

                </Route>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={< Dashboard />} />
                <Route path='/admin/couriers' element={<CouriersList />} />
                <Route path='/admin/couriers/:id' element={<CourierDetails />} />



                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/couriers" element={<CouriersList />} />
                <Route
                    path="/admin/couriers/:id"
                    element={<CourierDetails />}
                />
            </Routes>
        </Router>
    );
};

export default App;
