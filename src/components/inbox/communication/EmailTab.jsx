import React, { useState } from 'react';
import { Stack, IconButton, InputAdornment, Typography } from '@mui/material';
import { Search, RotateCcw, Edit } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCommunications } from '@/api/api_services/communications';
import { useSearchParams } from 'react-router-dom';
import ComposeEmailDialog from './components/ComposeEmailDialog';
import EmailList from './components/EmailList';
import { Input } from '@/components/ui/input';

const EmailTab = () => {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [composeOpen, setComposeOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const matterId = searchParams.get('slugId') || '1';

    // Fetch emails
    const { data: emailsResponse, isLoading, refetch } = useQuery({
        queryKey: ['communications', matterId],
        queryFn: () => getCommunications(matterId),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });

    const emails = emailsResponse?.data || [];

    const handleRefresh = () => {
        refetch();
    };

    const handleComposeSuccess = () => {
        setComposeOpen(false);
        queryClient.invalidateQueries(['communications', matterId]);
    };

    const filteredEmails = emails.filter(email =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <Stack spacing={4}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <h2 className="text-xl font-semibold text-gray-900">Email Communications</h2>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton onClick={handleRefresh} size="small">
                            <RotateCcw size={18} />
                        </IconButton>

                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                            <Input
                                placeholder="Search emails..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <button
                            onClick={() => setComposeOpen(true)}
                            className="px-4 py-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                        >
                            <Edit size={16} />
                            Compose
                        </button>
                    </Stack>
                </Stack>

                {/* Email List */}
                <div className="min-h-[600px] flex items-center justify-center">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                Loading emails...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Please wait while we fetch your communication history
                            </Typography>
                        </div>
                    ) : filteredEmails.length === 0 ? (
                        <div className="text-center max-w-md">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                                No emails yet
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                {searchTerm ?
                                    `No emails found matching "${searchTerm}". Try adjusting your search terms.` :
                                    "Start your communication journey by sending your first email. It's quick and easy!"
                                }
                            </Typography>
                            {!searchTerm && (
                                <button
                                    onClick={() => setComposeOpen(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-[#7367F0] to-[#453E90] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    <Edit size={18} className="mr-2 inline" />
                                    Compose First Email
                                </button>
                            )}
                        </div>
                    ) : (
                        <EmailList
                            emails={filteredEmails}
                            isLoading={isLoading}
                        />
                    )}
                </div>

                {/* Compose Email Dialog */}
                <ComposeEmailDialog
                    open={composeOpen}
                    onClose={() => setComposeOpen(false)}
                    onSuccess={handleComposeSuccess}
                    matterId={matterId}
                />
            </Stack>
        </div>
    );
};

export default EmailTab; 