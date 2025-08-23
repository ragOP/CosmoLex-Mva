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
import { Pencil, CircleOff, Trash2, Eye } from 'lucide-react';
import { useContact } from '@/components/contact/hooks/useContact';
import getMetaOptions from '@/utils/getMetaFields';

/**
 
contact_name
: 
"Doe John"
contact_type
: 
"3rd Party"
date_created
: 
"2025-08-14 10:59:05 AM"
id
: 
3
phone
: 
"123-456-7890"
primary_address
: 
"Main St"
primary_email
: 
"abhi.mishra07200@gmail.com"
: 
 */

const ContactTable = ({
  contacts = [],
  onRowClick,
  handleEdit,
  handleDelete,
}) => {
  const [contactData, setContactData] = useState([]);
  const { contactsMeta } = useContact();
  const statusMeta = getMetaOptions({
    metaField: 'contact_type',
    metaObj: contactsMeta,
  });

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'contact_name',
      headerName: 'Contact Name',
      flex: 1,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'contact_type',
      headerName: 'Contact Type',
      width: 100,
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
          <div className="w-full h-full flex items-center justify-start">
            <Badge variant={colorMap[params.value] || 'outline'}>
              {params.value}
            </Badge>
          </div>
        );
      },
    },
    {
      field: 'date_created',
      headerName: 'Date Created',
      width: 130,
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
      width: 100,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          {params.value}
        </div>
      ),
    },
    {
      field: 'primary_email',
      headerName: 'Email',
      width: 100,
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
      field: 'primary_address',
      headerName: 'Address',
      width: 100,
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
      width: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row);
            }}
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4 text-[#6366F1]" />
          </IconButton>
        </div>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row);
            }}
            className="cursor-pointer"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setContactData(contacts);
  }, [contacts]);

  return (
    <>
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={contactData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          sx={{
            padding: 2,
            border: 'none',
            borderRadius: '1rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 0.75rem 0.75rem rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            overflow: 'hidden',
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
              // cursor: 'pointer',
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
            // '& .MuiDataGrid-row:hover': {
            //   backgroundColor: 'rgba(255, 255, 255, 0.3)',
            //   // background:
            //   //   'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
            //   color: 'white',
            //   transition: 'all 0.3s ease-in-out',
            // },

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
