import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Truck,
  Calendar,
  UserCheck,
  UserX,
  Package,
  Star
} from 'lucide-react';

const CourierDetails = () => {
  const [courier, setCourier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourierDetails();
  }, [id]);

  const fetchCourierDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/v1/courier/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      
      setCourier(response.data.data);
    } catch (error) {
      console.error('Error fetching courier details:', error);
      toast.error('Failed to fetch courier details');
      if (error.response?.status === 404) {
        navigate('/admin/couriers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/api/v1/courier/${id}/verify`,
        { verified: !courier.isVerified },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setCourier(prev => ({
        ...prev,
        isVerified: !prev.isVerified
    }));
      
      toast.success(`Courier ${courier.isVerified ? 'unverified' : 'verified'} successfully`);
    } catch (error) {
      console.error('Error toggling verification:', error);
      toast.error('Failed to update verification status');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/v1/courier/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Courier deleted successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error deleting courier:', error);
      toast.error('Failed to delete courier');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (!courier) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Courier not found</h2>
          <Button onClick={() => navigate('/admin/dashboard')}>
            Back to Couriers List
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">Courier Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="text-lg font-medium">{courier.fullName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {courier.email || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                {courier.phoneNumber || 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Date of Birth</label>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {new Date(courier.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Courier Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-green-600" />
              Courier Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Vehicle Type</label>
              <p className="flex items-center">
                <Truck className="h-4 w-4 mr-2 text-gray-400" />
                {courier.vehicleType || 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Location</label>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {courier.location || 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Description</label>
              <p className="text-sm">{courier.description || 'No description provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Joined Date</label>
              <p className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {new Date(courier.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-green-600" />
              Status & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Verification Status</label>
                <div className="flex items-center gap-3">
                  <Badge 
                    className={courier.isVerified ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                  >
                    {courier.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>
              <div className="text-center">
                <label className="text-sm text-gray-500">Ratings</label>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">{courier.ratings || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Verification Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-green-600" />
              Document Verification
            </CardTitle>
            <CardDescription>Review courier's submitted documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Identity Verification */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Identity Verification</h3>
                  <p className="text-sm text-gray-500">
                    {courier.identityVerification} - {courier.cardNumber}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.open(courier.idProof, '_blank')}
                  className="flex items-center gap-2"
                >
                  View Document
                </Button>
              </div>
              {courier.idProof && (
                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={courier.idProof}
                    alt="ID Proof"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* License Document */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Driving License</h3>
                  <p className="text-sm text-gray-500">
                    License Number: {courier.drivingLicenseNumber}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.open(courier.licenseDocument, '_blank')}
                  className="flex items-center gap-2"
                >
                  View Document
                </Button>
              </div>
              {courier.licenseDocument && (
                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={courier.licenseDocument}
                    alt="License Document"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Profile Photo */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Profile Photo</h3>
                  <p className="text-sm text-gray-500">Courier's profile picture</p>
                </div>
              </div>
              {courier.profile && (
                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={courier.profile}
                    alt="Profile"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Verification Action */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Verification Status</h3>
                  <p className="text-sm text-gray-500">
                    {courier.isVerified 
                      ? "This courier is verified" 
                      : "Review documents and verify this courier"}
                  </p>
                </div>
                <Toggle
                  pressed={courier.isVerified}
                  onPressedChange={handleVerifyToggle}
                  className={cn(
                    "w-[200px]",
                    courier.isVerified ? "bg-green-500" : "bg-gray-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {courier.isVerified ? (
                      <>
                        <UserCheck className="h-4 w-4" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <UserX className="h-4 w-4" />
                        <span>Not Verified</span>
                      </>
                    )}
                  </div>
                </Toggle>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage this courier's account</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button 
              onClick={() => navigate(`/admin/couriers/edit/${id}`)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Edit Courier
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete Courier
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the courier's
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourierDetails;