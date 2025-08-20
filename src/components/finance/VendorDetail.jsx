import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Stack, IconButton, Typography, Chip, Dialog, Alert, Box } from '@mui/material';
import { 
    ArrowLeft, 
    Edit, 
    Trash2, 
    Users, 
    Mail, 
    Phone, 
    MapPin, 
    DollarSign,
    FileText,
    Calendar,
    Building,
    Globe,
    CreditCard
} from 'lucide-react';
import { getVendor, updateVendor, deleteVendor } from '@/api/api_services/finance';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [editMode, setEditMode] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editData, setEditData] = useState({});

    const slugId = searchParams.get('slugId');

    // Check if edit mode is requested via URL parameter
    useEffect(() => {
        const editParam = searchParams.get('edit');
        if (editParam === 'true') {
            setEditMode(true);
        }
    }, [searchParams]);

    // Fetch vendor details
    const { data: vendorResponse, isLoading, error } = useQuery({
        queryKey: ['vendor', id],
        queryFn: () => getVendor(id),
        enabled: !!id,
    });

    const vendor = vendorResponse?.data;

    // Update vendor mutation
    const updateVendorMutation = useMutation({
        mutationFn: (data) => updateVendor(id, data),
        onSuccess: () => {
            toast.success('Vendor updated successfully!');
            setEditMode(false);
            queryClient.invalidateQueries(['vendor', id]);
            queryClient.invalidateQueries(['vendors']);
        },
        onError: (error) => {
            toast.error('Failed to update vendor. Please try again.');
            console.error('Update vendor error:', error);
        }
    });

    // Delete vendor mutation
    const deleteVendorMutation = useMutation({
        mutationFn: () => deleteVendor(id),
        onSuccess: () => {
            toast.success('Vendor deleted successfully!');
            navigate(`/dashboard/inbox/finance?slugId=${slugId || ''}&tab=vendors`);
            queryClient.invalidateQueries(['vendors']);
        },
        onError: (error) => {
            toast.error('Failed to delete vendor. Please try again.');
            console.error('Delete vendor error:', error);
        }
    });

    const handleBack = () => {
        navigate(`/dashboard/inbox/finance?slugId=${slugId || ''}&tab=vendors`);
    };

    const handleEdit = () => {
        navigate(`/dashboard/inbox/finance?slugId=${slugId || ''}&tab=vendors&edit=${id}`);
    };

    const handleSave = () => {
        updateVendorMutation.mutate(editData);
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditData({});
    };

    const handleDelete = () => {
        deleteVendorMutation.mutate();
        setDeleteDialogOpen(false);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (isLoading) {
        return (
            <div className="px-4">
                <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.5)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: 3, 
                    boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    p: 4
                }}>
                    <Stack spacing={3}>
                        <Typography variant="h6" color="text.secondary">
                            Loading vendor details...
                        </Typography>
                    </Stack>
                </Box>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4">
                <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.5)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: 3, 
                    boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    p: 4
                }}>
                    <Typography variant="h6" color="error" align="center">
                        Failed to load vendor details. Please try again.
                    </Typography>
                </Box>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="px-4">
                <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.5)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: 3, 
                    boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    p: 4
                }}>
                    <Typography variant="h6" color="text.secondary" align="center">
                        Vendor not found
                    </Typography>
                </Box>
            </div>
        );
    }

    return (
        <div className="px-2">
            <Box sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.5)', 
                backdropFilter: 'blur(8px)',
                borderRadius: 3, 
                boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <Box sx={{ 
                    px: 3, 
                    py: 2,
                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={handleBack} size="small">
                            <ArrowLeft size={20} />
                        </IconButton>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151' }}>
                            Vendor Details
                        </Typography>
                    </Box>

                    {!editMode && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                onClick={handleEdit}
                                sx={{ 
                                    color: '#7367F0',
                                    '&:hover': { bgcolor: 'rgba(115, 103, 240, 0.1)' }
                                }}
                            >
                                <Edit size={18} />
                            </IconButton>
                            <IconButton 
                                onClick={() => setDeleteDialogOpen(true)}
                                sx={{ 
                                    color: '#dc2626',
                                    '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.1)' }
                                }}
                            >
                                <Trash2 size={18} />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Content */}
                <Box sx={{ 
                    px: 4, 
                    py: 2, 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f5f9',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#cbd5e1',
                        borderRadius: '4px',
                        '&:hover': {
                            background: '#94a3b8',
                        },
                    },
                }}>
                    <Stack spacing={4}>
                        {editMode ? (
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Vendor Name *
                                        </Label>
                                        <Input
                                            value={editData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter vendor name"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Write To
                                        </Label>
                                        <Input
                                            value={editData.write_to}
                                            onChange={(e) => handleInputChange('write_to', e.target.value)}
                                            placeholder="Enter write to name"
                                            className="h-10"
                                        />
                                    </div>
                                </div>

                                {/* Contact Person Details */}
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Prefix
                                        </Label>
                                        <Select onValueChange={(value) => handleInputChange('prefix', value)} value={editData.prefix || ''}>
                                            <SelectTrigger className="h-10 w-full border border-gray-300 rounded-md px-3 py-2">
                                                <SelectValue placeholder="Select prefix" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                <SelectItem value="Mr">Mr</SelectItem>
                                                <SelectItem value="Ms">Ms</SelectItem>
                                                <SelectItem value="Mrs">Mrs</SelectItem>
                                                <SelectItem value="Dr">Dr</SelectItem>
                                                <SelectItem value="Prof">Prof</SelectItem>
                                                <SelectItem value="Rev">Rev</SelectItem>
                                                <SelectItem value="Hon">Hon</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            First Name *
                                        </Label>
                                        <Input
                                            value={editData.first_name}
                                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                                            placeholder="Enter first name"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Middle Name
                                        </Label>
                                        <Input
                                            value={editData.middle_name}
                                            onChange={(e) => handleInputChange('middle_name', e.target.value)}
                                            placeholder="Enter middle name"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Last Name *
                                        </Label>
                                        <Input
                                            value={editData.last_name}
                                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                                            placeholder="Enter last name"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Suffix
                                        </Label>
                                        <Select onValueChange={(value) => handleInputChange('suffix', value)} value={editData.suffix || ''}>
                                            <SelectTrigger className="h-10 w-full border border-gray-300 rounded-md px-3 py-2">
                                                <SelectValue placeholder="Select suffix" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[9999]">
                                                <SelectItem value="Jr">Jr</SelectItem>
                                                <SelectItem value="Sr">Sr</SelectItem>
                                                <SelectItem value="I">I</SelectItem>
                                                <SelectItem value="II">II</SelectItem>
                                                <SelectItem value="III">III</SelectItem>
                                                <SelectItem value="IV">IV</SelectItem>
                                                <SelectItem value="V">V</SelectItem>
                                                <SelectItem value="Esq">Esq</SelectItem>
                                                <SelectItem value="CPA">CPA</SelectItem>
                                                <SelectItem value="MBA">MBA</SelectItem>
                                                <SelectItem value="PhD">PhD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Primary Email *
                                        </Label>
                                        <Input
                                            type="email"
                                            value={editData.primary_email}
                                            onChange={(e) => handleInputChange('primary_email', e.target.value)}
                                            placeholder="Enter primary email"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Secondary Email
                                        </Label>
                                        <Input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Enter secondary email"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Website
                                        </Label>
                                        <Input
                                            value={editData.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            placeholder="Enter website URL"
                                            className="h-10"
                                        />
                                    </div>
                                </div>

                                {/* Phone Information */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Primary Phone *
                                        </Label>
                                        <Input
                                            value={editData.primary_phone}
                                            onChange={(e) => handleInputChange('primary_phone', e.target.value)}
                                            placeholder="Enter primary phone"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Secondary Phone
                                        </Label>
                                        <Input
                                            value={editData.phone2}
                                            onChange={(e) => handleInputChange('phone2', e.target.value)}
                                            placeholder="Enter secondary phone"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Fax
                                        </Label>
                                        <Input
                                            value={editData.fax}
                                            onChange={(e) => handleInputChange('fax', e.target.value)}
                                            placeholder="Enter fax number"
                                            className="h-10"
                                        />
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Address Line 1
                                        </Label>
                                        <Input
                                            value={editData.address1}
                                            onChange={(e) => handleInputChange('address1', e.target.value)}
                                            placeholder="Enter address"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Address Line 2
                                        </Label>
                                        <Input
                                            value={editData.address2}
                                            onChange={(e) => handleInputChange('address2', e.target.value)}
                                            placeholder="Enter address line 2"
                                            className="h-10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            City
                                        </Label>
                                        <Input
                                            value={editData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            placeholder="Enter city"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            State
                                        </Label>
                                        <Input
                                            value={editData.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            placeholder="Enter state"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            ZIP Code
                                        </Label>
                                        <Input
                                            value={editData.zip}
                                            onChange={(e) => handleInputChange('zip', e.target.value)}
                                            placeholder="Enter ZIP code"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Country
                                        </Label>
                                        <Input
                                            value={editData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            placeholder="Enter country"
                                            className="h-10"
                                        />
                                    </div>
                                </div>

                                {/* Financial Information */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Net Terms
                                        </Label>
                                        <Input
                                            value={editData.net_terms}
                                            onChange={(e) => handleInputChange('net_terms', e.target.value)}
                                            placeholder="e.g., Net 30"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Days
                                        </Label>
                                        <Input
                                            type="number"
                                            value={editData.days}
                                            onChange={(e) => handleInputChange('days', e.target.value)}
                                            placeholder="Enter days"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Account Number
                                        </Label>
                                        <Input
                                            value={editData.account_number}
                                            onChange={(e) => handleInputChange('account_number', e.target.value)}
                                            placeholder="Enter account number"
                                            className="h-10"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-2 block">
                                            Tax ID
                                        </Label>
                                        <Input
                                            value={editData.tax_id}
                                            onChange={(e) => handleInputChange('tax_id', e.target.value)}
                                            placeholder="Enter tax ID"
                                            className="h-10"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-gray-700 font-semibold mb-2 block">
                                        Description
                                    </Label>
                                    <textarea
                                        value={editData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Enter vendor description"
                                        className="h-24 resize-none px-4 py-2 rounded-md border border-gray-300 w-full"
                                    />
                                </div>

                                {/* Checkboxes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="w9_on_file"
                                            checked={editData.w9_on_file}
                                            onCheckedChange={(checked) => handleInputChange('w9_on_file', checked)}
                                        />
                                        <Label htmlFor="w9_on_file" className="text-sm text-gray-700">
                                            W9 On File
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="track_1099"
                                            checked={editData.track_1099}
                                            onCheckedChange={(checked) => handleInputChange('track_1099', checked)}
                                        />
                                        <Label htmlFor="track_1099" className="text-sm text-gray-700">
                                            Track 1099
                                        </Label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="border-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={updateVendorMutation.isPending}
                                        className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
                                    >
                                        {updateVendorMutation.isPending ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center">
                                            <Users className="w-8 h-8 text-green-600" />
                                        </div>
                                        <div>
                                            <Typography variant="h5" className="font-semibold text-gray-900 mb-1">
                                                {vendor.name}
                                            </Typography>
                                            <Typography variant="body2" className="text-gray-600">
                                                {vendor.write_to}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Chip
                                            label={vendor.w9_on_file ? 'W9 Filed' : 'W9 Pending'}
                                            size="small"
                                            className={vendor.w9_on_file ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                        />
                                        <Chip
                                            label={vendor.track_1099 ? '1099 Tracked' : 'No 1099'}
                                            size="small"
                                            className={vendor.track_1099 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}
                                        />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Typography variant="h6" className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-gray-500" />
                                            Contact Information
                                        </Typography>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-sm w-20">Primary:</span>
                                                <span className="text-gray-900">{vendor.primary_email}</span>
                                            </div>
                                            {vendor.email && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-500 text-sm w-20">Secondary:</span>
                                                    <span className="text-gray-900">{vendor.email}</span>
                                                </div>
                                            )}
                                            {vendor.website && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-500 text-sm w-20">Website:</span>
                                                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {vendor.website}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Typography variant="h6" className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-gray-500" />
                                            Phone Information
                                        </Typography>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-sm w-20">Primary:</span>
                                                <span className="text-gray-900">{vendor.primary_phone}</span>
                                            </div>
                                            {vendor.phone2 && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-500 text-sm w-20">Secondary:</span>
                                                    <span className="text-gray-900">{vendor.phone2}</span>
                                                </div>
                                            )}
                                            {vendor.fax && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-500 text-sm w-20">Fax:</span>
                                                    <span className="text-gray-900">{vendor.fax}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-4">
                                    <Typography variant="h6" className="font-semibold text-gray-900 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-gray-500" />
                                        Address
                                    </Typography>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <Typography variant="body1" className="text-gray-900">
                                            {[vendor.address1, vendor.address2, vendor.city, vendor.state, vendor.zip, vendor.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Financial Information */}
                                <div className="space-y-4">
                                    <Typography variant="h6" className="font-semibold text-gray-900 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-gray-500" />
                                        Financial Information
                                    </Typography>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <Typography variant="body2" className="text-gray-500 mb-1">Net Terms</Typography>
                                            <Typography variant="body1" className="font-semibold text-gray-900">
                                                {vendor.net_terms} ({vendor.days} days)
                                            </Typography>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <Typography variant="body2" className="text-gray-500 mb-1">Account Number</Typography>
                                            <Typography variant="body1" className="font-semibold text-gray-900">
                                                {vendor.account_number || 'N/A'}
                                            </Typography>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <Typography variant="body2" className="text-gray-500 mb-1">Tax ID</Typography>
                                            <Typography variant="body1" className="font-semibold text-gray-900">
                                                {vendor.tax_id || 'N/A'}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {vendor.description && (
                                    <div className="space-y-4">
                                        <Typography variant="h6" className="font-semibold text-gray-900 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-gray-500" />
                                            Description
                                        </Typography>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <Typography variant="body1" className="text-gray-900">
                                                {vendor.description}
                                            </Typography>
                                        </div>
                                    </div>
                                )}

                                {/* Additional Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Typography variant="h6" className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Building className="w-5 h-5 text-gray-500" />
                                            Company Details
                                        </Typography>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-sm w-24">Category ID:</span>
                                                <span className="text-gray-900">{vendor.category_id || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-sm w-24">Folder ID:</span>
                                                <span className="text-gray-900">{vendor.folder_id || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Typography variant="h6" className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            Timestamps
                                        </Typography>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-sm w-24">Created:</span>
                                                <span className="text-gray-900">
                                                    {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-sm w-24">Updated:</span>
                                                <span className="text-gray-900">
                                                    {vendor.updated_at ? new Date(vendor.updated_at).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Stack>
                </Box>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <div className="p-6">
                    <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                        Delete Vendor
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 mb-6">
                        Are you sure you want to delete "{vendor.name}"? This action cannot be undone.
                    </Typography>
                    <div className="flex justify-end gap-3">
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            variant="outline"
                            className="border-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={deleteVendorMutation.isPending}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {deleteVendorMutation.isPending ? 'Deleting...' : 'Delete Vendor'}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default VendorDetail; 