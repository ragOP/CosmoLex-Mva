import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Avatar, Box, Tooltip, IconButton } from '@mui/material';
import formatDate from '@/utils/formatDate';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, CircleOff, Trash2 } from 'lucide-react';
import { useContact } from '@/components/contact/hooks/useContact';
import getMetaOptions from '@/utils/getMetaFields';
import { noFilterColumns } from '@/utils/noFilterColumns';
import { getTableWidth } from '@/utils/isMobile';
import { truncateStr } from '@/utils/truncateStr';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { usePermission } from '@/utils/usePermission';

const ContactTable = ({
  contacts = [],
  onRowClick,
  handleEdit,
  handleDelete,
}) => {
  const [contactData, setContactData] = useState([]);

  // Check if user has show permission
  const { hasPermission } = usePermission();
  const canShowContact = hasPermission('contacts.show');

  const handleRowClick = (params) => {
    if (canShowContact) {
      onRowClick(params);
    }
  };

  const columns = [
    {
      field: 'sno',
      headerName: 'S.No',
      flex: 0.5,
      minWidth: 70,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: 'contact_name',
      headerName: 'Contact Name',
      flex: 1.5,
      minWidth: 200,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => truncateStr(params.value, 15),
    },
    {
      field: 'contact_type',
      headerName: 'Contact Type',
      flex: 1,
      minWidth: 150,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const colorMap = {
          High: 'destructive',
          Medium: 'warning',
          Low: 'secondary',
        };
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Badge variant={colorMap[params.value] || 'outline'}>
              {truncateStr(params.value, 15)}
            </Badge>
          </div>
        );
      },
    },
    {
      field: 'date_created',
      headerName: 'Date Created',
      flex: 1,
      minWidth: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(params.value)}
        </span>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 120,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          {truncateStr(params.value, 10)}
        </div>
      ),
    },
    {
      field: 'primary_email',
      headerName: 'Email',
      flex: 1.2,
      minWidth: 150,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-start">
          <ScrollArea className="w-full">
            <div className="text-sm text-muted-foreground flex justify-center">
              {truncateStr(params.value, 15)}
            </div>
          </ScrollArea>
        </div>
      ),
    },
    {
      field: 'primary_address',
      headerName: 'Address',
      flex: 1.2,
      minWidth: 150,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-start">
          <ScrollArea className="w-full">
            <div className="text-sm text-muted-foreground flex justify-center">
              {params.value}
            </div>
          </ScrollArea>
        </div>
      ),
    },
    {
      field: 'edit',
      headerName: 'Edit',
      flex: 0.5,
      minWidth: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          <PermissionGuard permission="contacts.update">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(params.row);
              }}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4 text-[#6366F1]" />
            </IconButton>
          </PermissionGuard>
        </div>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      flex: 0.5,
      minWidth: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          <PermissionGuard permission="contacts.delete">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row);
              }}
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </IconButton>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  const filteredColumns = noFilterColumns(columns);

  useEffect(() => {
    setContactData(contacts);
  }, [contacts]);

  return (
    <>
      <Box
        sx={{
          height: '100%',
          width: getTableWidth(),
          overflow: 'auto',
          p: 2,
        }}
      >
        <DataGrid
          rows={contactData}
          columns={filteredColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          onRowClick={canShowContact ? onRowClick : undefined}
          sx={{
            padding: 2,
            border: 'none',
            borderRadius: '1rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 0.75rem 0.75rem rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            overflow: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',

            // HEADER CONTAINER
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '2rem',
              overflow: 'hidden',
              border: 'none',
              marginBottom: '1rem',
            },

            // INDIVIDUAL HEADER CELLS
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'white',
              color: 'black',
              border: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
              border: 'none',
            },

            // BODY CELLS
            '& .MuiDataGrid-cell': {
              border: 'none',
              backgroundColor: 'transparent',
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-cell:focus-within': {
              outline: 'none',
              border: 'none',
            },

            // ROWS
            '& .MuiDataGrid-row': {
              borderRadius: '2rem',
              backgroundColor: 'white',
              marginBottom: '0.5rem',
              overflow: 'hidden',
            },

            // FOOTER
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'transparent',
              borderBottomLeftRadius: '1rem',
              borderBottomRightRadius: '1rem',
            },

            // TOOLBAR & SCROLLBAR
            '& .MuiDataGrid-toolbarContainer': {
              padding: '0.5rem 1rem',
            },
            '& .MuiDataGrid-scrollbar': {
              display: 'none',
            },
          }}
          disableRowSelectionOnClick
          disableSelectionOnClick
        />
      </Box>
    </>
  );
};

export default ContactTable;
