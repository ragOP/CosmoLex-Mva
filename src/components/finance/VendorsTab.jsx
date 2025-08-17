import React, { useState } from 'react';
import { Stack, IconButton, Typography, Chip } from '@mui/material';
import { Search, RotateCcw, Plus, Users, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVendors, createVendor } from '@/api/api_services/finance';
import { Input } from '@/components/ui/input';
import CreateVendorDialog from './components/CreateVendorDialog';
import { toast } from 'sonner';

const VendorsTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    // Fetch vendors
    const { data: vendorsResponse, isLoading, refetch } = useQuery({
        queryKey: ['vendors'],
        queryFn: getVendors,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    const vendors = vendorsResponse?.data || [];

    const handleRefresh = () => {
        refetch();
    };

    // Create vendor mutation
    const createVendorMutation = useMutation({
        mutationFn: createVendor,
        onSuccess: () => {
            toast.success('Vendor created successfully!');
            setCreateDialogOpen(false);
            queryClient.invalidateQueries(['vendors']);
        },
        onError: (error) => {
            toast.error('Failed to create vendor. Please try again.');
            console.error('Create vendor error:', error);
        }
    });

    const handleCreateVendor = (vendorData) => {
        createVendorMutation.mutate(vendorData);
    };

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.write_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${vendor.first_name} ${vendor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return { bgcolor: '#d1fae5', color: '#065f46' };
            case 'Inactive':
                return { bgcolor: '#fee2e2', color: '#991b1b' };
            case 'Pending':
                return { bgcolor: '#fef3c7', color: '#92400e' };
            default:
                return { bgcolor: '#f3f4f6', color: '#374151' };
        }
    };

    return (
        <>
            <div className="p-4">
                <Stack spacing={3}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <h2 className="text-xl font-semibold text-gray-900">Vendors Management</h2>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <IconButton onClick={handleRefresh} size="small">
                                <RotateCcw size={18} />
                            </IconButton>

                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                                <Input
                                    placeholder="Search vendors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <button
                                onClick={() => setCreateDialogOpen(true)}
                                className="px-4 py-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Add Vendor
                            </button>
                        </Stack>
                    </Stack>

                    {/* Vendors List */}
                    <div className="flex items-center justify-center">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    Loading vendors...
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Please wait while we fetch your vendors data
                                </Typography>
                            </div>
                        ) : filteredVendors.length === 0 ? (
                            <div className="text-center max-w-md">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-12 h-12 text-green-500" />
                                </div>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                                    No vendors yet
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                    {searchTerm ?
                                        `No vendors found matching "${searchTerm}". Try adjusting your search terms.` :
                                        "Start managing your vendor relationships by adding your first service provider."
                                    }
                                </Typography>
                                {!searchTerm && (
                                    <button
                                        onClick={() => setCreateDialogOpen(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-[#7367F0] to-[#453E90] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                    >
                                        <Plus size={18} className="mr-2 inline" />
                                        Add First Vendor
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredVendors.map((vendor) => (
                                    <div
                                        key={vendor.id}
                                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                        {vendor.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {vendor.net_terms} • {vendor.days} days
                                                    </p>
                                                </div>
                                            </div>
                                            <Chip
                                                label={vendor.w9_on_file ? 'W9 Filed' : 'W9 Pending'}
                                                size="small"
                                                sx={{
                                                    ...getStatusColor(vendor.w9_on_file ? 'Active' : 'Pending'),
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="truncate">{vendor.primary_email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span>{vendor.primary_phone}</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs leading-relaxed">
                                                    {[vendor.address1, vendor.address2, vendor.city, vendor.state, vendor.zip, vendor.country]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Vendor Details */}
                                        <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Tax ID:</span>
                                                <span className="font-medium">{vendor.tax_id}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Account #:</span>
                                                <span className="font-medium">{vendor.account_number}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">1099 Track:</span>
                                                <span className={`font-medium ${vendor.track_1099 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {vendor.track_1099 ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="text-xs text-gray-500">
                                                Contact: {vendor.write_to}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Added {new Date(vendor.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Create Vendor Dialog */}
                </Stack>
            </div>
            <CreateVendorDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onSubmit={handleCreateVendor}
                isLoading={createVendorMutation.isPending}
            />

        </>
    );
};

export default VendorsTab; 