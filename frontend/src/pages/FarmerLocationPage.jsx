// src/pages/FarmerLocationPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

const FarmerLocationPage = () => {
    const { city } = useParams(); // Get the city from URL parameters
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/farmer/location?city=${city}`);
                setFarmers(response.data.farmers);
                toast.success("Farmers loaded successfully!");
            } catch (error) {
                console.error("Error fetching farmers:", error);
                toast.error("Failed to load farmers.");
            } finally {
                setLoading(false);
            }
        };

        fetchFarmers();
    }, [city]);

    if (loading) {
        return <div>Loading farmers...</div>;
    }

    return (
        <div className="p-5">
            <Link to="/" className="text-green-600 hover:underline mb-4">Back to Home</Link>
            <h1 className="text-2xl font-bold mb-4">Farmers in {city}</h1>
            <Table className="w-full border border-green-300">
                <TableHeader className="bg-green-200">
                    <TableRow>
                        <TableCell className="border px-4 py-2">Name</TableCell>
                        <TableCell className="border px-4 py-2">Description</TableCell>
                        <TableCell className="border px-4 py-2">Location</TableCell>
                        <TableCell className="border px-4 py-2">Farm Name</TableCell>
                        <TableCell className="border px-4 py-2">Profile</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {farmers.map(farmer => (
                        <TableRow key={farmer._id} className="hover:bg-green-100">
                            <TableCell className="border px-4 py-2">{farmer.fullName}</TableCell>
                            <TableCell className="border px-4 py-2">{farmer.description}</TableCell>
                            <TableCell className="border px-4 py-2">{farmer.location}</TableCell>
                            <TableCell className="border px-4 py-2">{farmer.farmName}</TableCell>
                            <TableCell className="border px-4 py-2">
                                {farmer.profile && <img src={farmer.profile} alt={`${farmer.fullName}'s profile`} className="w-16 h-16" />}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default FarmerLocationPage;