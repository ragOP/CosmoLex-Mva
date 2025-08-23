import React, { useState } from 'react';
import { Eye, User, Building, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Divider } from '@mui/material';
import { X } from 'lucide-react';

const SearchResults = ({ results, searchCriteria }) => {
  const [selectedResult, setSelectedResult] = useState(null);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'open':
      case 'in progress':
        return 'default';
      case 'pending':
      case 'awaiting':
        return 'secondary';
      case 'closed':
      case 'completed':
        return 'outline';
      case 'rejected':
      case 'disqualified':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const renderContactInfo = (contact) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User className="w-4 h-4 text-gray-400" />
        <span className="font-medium">
          {[contact.first_name, contact.last_name]
            .filter(Boolean)
            .join(' ')}
        </span>
      </div>

      {contact.source && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">Source: {contact.source}</span>
        </div>
      )}
    </div>
  );

  const renderCaseInfo = (caseData) => (
    <div className="space-y-2">
      {caseData.type_of_case && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{caseData.type_of_case}</span>
        </div>
      )}

      {caseData.status && (
        <Badge variant={getStatusVariant(caseData.status)} className="text-xs">
          {caseData.status}
        </Badge>
      )}

      {caseData.current_assignee && (
        <div className="text-xs text-gray-500">
          Assignee: {caseData.current_assignee}
        </div>
      )}
    </div>
  );

  if (!results?.data || results.data.length === 0) {
    return (
      <div className="p-6 text-center flex flex-1 items-center justify-center flex-col">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-12 h-12 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No results found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or broadening your search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 h">

      {/* Search Criteria Summary */}
      {Object.keys(searchCriteria).length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-3">
            Search Criteria Applied:
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(searchCriteria).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-xs">
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results Table - Scrollable */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Contact Information</TableHead>
                <TableHead className="font-semibold text-gray-700">Case Information</TableHead>
                <TableHead className="font-semibold text-gray-700">Additional Details</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results?.data?.map((result, index) => (
                <TableRow key={index} className="bg-white">
                  <TableCell>
                    {renderContactInfo(result)}
                  </TableCell>
                  <TableCell>
                    {renderCaseInfo(result)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {result.created && (
                        <div className="text-xs text-gray-500">
                          Created: {result.created}
                        </div>
                      )}
                      {result.source && (
                        <div className="text-xs text-gray-500">
                          Source: {result.source}
                        </div>
                      )}
                      {result.current_assignee && (
                        <div className="text-xs text-gray-500">
                          Assignee: {result.current_assignee}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedResult(result)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye size={16} className="text-gray-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

            {/* Contact Preview Dialog */}
      <Dialog 
        open={!!selectedResult} 
        onClose={() => setSelectedResult(null)}
        maxWidth="md"
        fullWidth
      >
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
              Contact Details
            </h1>
            <IconButton onClick={() => setSelectedResult(null)}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          {/* Contact Content */}
          {selectedResult && (
            <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#40444D] mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedResult.first_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>
                        <strong>First Name:</strong> {selectedResult.first_name}
                      </span>
                    </div>
                  )}
                  {selectedResult.last_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>
                        <strong>Last Name:</strong> {selectedResult.last_name}
                      </span>
                    </div>
                  )}
                  {selectedResult.source && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>
                        <strong>Source:</strong> {selectedResult.source}
                      </span>
                    </div>
                  )}
                  {selectedResult.created && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>
                        <strong>Created:</strong> {selectedResult.created}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* Case Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#40444D] mb-3">
                  Case Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedResult.type_of_case && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>
                        <strong>Case Type:</strong> {selectedResult.type_of_case}
                      </span>
                    </div>
                  )}
                  {selectedResult.status && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>
                        <strong>Status:</strong> 
                        <Badge variant={getStatusVariant(selectedResult.status)} className="ml-2 text-xs">
                          {selectedResult.status}
                        </Badge>
                      </span>
                    </div>
                  )}
                  {selectedResult.current_assignee && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>
                        <strong>Assignee:</strong> {selectedResult.current_assignee}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Stack>
      </Dialog>
    </div>
  );
};

export default SearchResults; 