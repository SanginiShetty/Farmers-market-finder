import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Pencil, Trash2, Search, RefreshCw, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

const CouriersList = () => {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/courier/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCouriers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch couriers');
      if (error.response?.status === 401) navigate('/admin/login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const verifyCourier = async (courierId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE_URL}/api/v1/courier/${courierId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Redirecting to courier details...');
      navigate(`/admin/couriers/${courierId}`); // Navigate to courier details instead of refreshing
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify courier');
      if (error.response?.status === 401) navigate('/admin/login');
    }
  };

  // Memoize filtered couriers based on search term and status filter
  const filteredCouriers = useMemo(() => {
    const regex = new RegExp(searchTerm, 'i'); // Create regex for case-insensitive search
    return couriers.filter(courier => {
      const matchesSearch = courier.user.fullName.match(regex) || courier.user.email.match(regex);
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'verified' && courier.isVerified) || 
                            (statusFilter === 'pending' && !courier.isVerified);
      return matchesSearch && matchesStatus; // Return true if both conditions are met
    });
  }, [couriers, searchTerm, statusFilter]); // Add statusFilter to dependencies

  return (
    <TooltipProvider>
      <Card className="w-full shadow-lg rounded-xl">
        <CardHeader className="bg-gray-100 p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-700">Couriers Management</CardTitle>
            {/* Status Filter */}
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} // Update status filter
              className="border rounded-md p-2"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Search and Refresh */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search couriers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-10 border-gray-300 rounded-md"
              />
              {searchTerm && (
                <X
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>

            <Button variant="outline" onClick={fetchCouriers} disabled={refreshing} className="relative">
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table className="w-full">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead className="p-3">Name</TableHead>
                  <TableHead className="p-3">Email</TableHead>
                  <TableHead className="p-3">Status</TableHead>
                  <TableHead className="p-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4} className="text-center">
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredCouriers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                      No couriers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCouriers.map((courier) => (
                    <TableRow key={courier._id} className="hover:bg-gray-50 transition">
                      <TableCell className="p-3 font-medium">{courier?.user?.fullName || 'N/A'}</TableCell>
                      <TableCell className="p-3">{courier?.user?.email || 'N/A'}</TableCell>
                      <TableCell className="p-3">
                        <Badge 
                          className={
                            courier.isVerified 
                              ? "bg-green-500 text-white" 
                              : "bg-yellow-500 text-white"
                          }
                        >
                          {courier.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-3 flex justify-end gap-2">
                        {!courier.isVerified && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                onClick={() => verifyCourier(courier._id)}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Verify Courier</TooltipContent>
                          </Tooltip>
                        )}
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/couriers/${courier._id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Courier</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/couriers/${courier._id}`)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Courier</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Courier</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CouriersList;
