import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Avatar,
  Box,
  Tooltip,
  IconButton,
  Switch,
  useMediaQuery,
} from '@mui/material';
import formatDate from '@/utils/formatDate';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, CircleOff, Trash2, Eye } from 'lucide-react';
import { noFilterColumns } from '@/utils/noFilterColumns';
import { truncateStr } from '@/utils/truncateStr';
import { getTableWidth } from '@/utils/isMobile';

const UsersTable = ({
  users = [],
  onRowClick,
  handleEdit,
  handleDelete,
  handleStatusChange,
}) => {
  const [userData, setUserData] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'profile_picture',
      headerName: 'Avatar',
      width: 70,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params || !params.row) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Avatar
              src={params.value}
              alt={`${params.row.first_name || ''} ${
                params.row.last_name || ''
              }`}
              sx={{ width: 28, height: 28 }}
            >
              {`${params.row.first_name?.[0] || ''}${
                params.row.last_name?.[0] || ''
              }`}
            </Avatar>
          </div>
        );
      },
    },
    {
      field: 'full_name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      valueGetter: (value, row) => {
        if (!row) return '';
        return `${row.first_name || ''} ${row.last_name || ''}`.trim();
      },
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            {truncateStr(params.value, 20)}
          </div>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2,
      minWidth: 180,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            {truncateStr(params.value, 20)}
          </div>
        );
      },
    },
    {
      field: 'role_id',
      headerName: 'Role',
      width: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-start">
            <Badge variant="outline">
              {params.row.role_id === 1 ? 'Admin' : 'User'}
            </Badge>
          </div>
        );
      },
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-start">
            <Switch
              checked={params.value}
              onChange={(e) =>
                handleStatusChange(params.row.id, e.target.checked)
              }
            />
          </div>
        );
      },
    },
    {
      field: 'email_verified_at',
      headerName: 'Verified',
      width: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-start">
            <Badge variant={params.value ? 'default' : 'secondary'}>
              {params.value ? 'Yes' : 'No'}
            </Badge>
          </div>
        );
      },
    },
    {
      field: 'last_login_at',
      headerName: 'Last Login',
      width: 120,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            {params.value ? formatDate(params.value) : 'Never'}
          </div>
        );
      },
    },
    {
      field: 'view',
      headerName: 'View',
      width: 70,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params || !params.row) return null;
        return (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(params);
            }}
            className="cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </IconButton>
        );
      },
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 70,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params || !params.row) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            {params?.row?.is_editable !== false ? (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(params.row);
                }}
                className="cursor-pointer"
              >
                <Pencil className="h-4 w-4 text-[#6366F1]" />
              </IconButton>
            ) : (
              <IconButton className="cursor-pointer">
                <CircleOff className="h-4 w-4 text-[#6366F1]" />
              </IconButton>
            )}
          </div>
        );
      },
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 70,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params || !params.row) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            {params?.row?.is_deletable !== false ? (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(params.row);
                }}
                className="cursor-pointer"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </IconButton>
            ) : (
              <IconButton className="cursor-pointer">
                <CircleOff className="h-4 w-4" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];

  const filteredColumns = noFilterColumns(columns);

  useEffect(() => {
    setUserData(users);
  }, [users]);

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
          rows={userData}
          columns={filteredColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          autoHeight={false}
          sx={{
            padding: 2,
            border: 'none',
            borderRadius: '1rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 0.75rem 0.75rem rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            overflow: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            // width: '100%',

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

export default UsersTable;
