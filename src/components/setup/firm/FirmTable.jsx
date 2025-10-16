import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import formatDate from '@/utils/formatDate';
import { Badge } from '@/components/ui/badge';
import { noFilterColumns } from '@/utils/noFilterColumns';
import { truncateStr } from '@/utils/truncateStr';
import { getTableWidth } from '@/utils/isMobile';
import { getFirmDetails } from '@/api/api_services/setup';
import { Eye, Pencil } from 'lucide-react';

const FirmTable = ({
  onRowClick = () => {},
  handleEdit = () => {},
  reloadKey = 0,
}) => {
  const [firmRows, setFirmRows] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // Using the same pattern as other setup APIs (apiService prefixes with /api)
        const response = await getFirmDetails();
        if (!isMounted) return;
        // API returns a single firm object; normalize and wrap into an array for the grid
        const firm =
          response?.data?.data ||
          response?.data ||
          response?.response ||
          response;

        if (firm && typeof firm === 'object' && (firm.id || firm?.firm_id)) {
          // Prefer `id`, fallback to `firm_id`
          const normalized = { id: firm.id ?? firm.firm_id, ...firm };
          setFirmRows([normalized]);
        } else {
          setFirmRows([]);
        }
      } catch (e) {
        setFirmRows([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

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
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params || !params.row) return null;
        const fullName = `${params.row.first_name || ''} ${
          params.row.last_name || ''
        }`.trim();
        return (
          <div className="w-full h-full flex items-center justify-center">
            {truncateStr(fullName || 'N/A', 24)}
          </div>
        );
      },
    },
    {
      field: 'firm_name',
      headerName: 'Firm Name',
      flex: 1,
      minWidth: 160,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            {truncateStr(params.value, 24)}
          </div>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2,
      minWidth: 200,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            {truncateStr(params.value, 26)}
          </div>
        );
      },
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      flex: 0.9,
      minWidth: 150,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'website_address',
      headerName: 'Website',
      flex: 1,
      minWidth: 160,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            {truncateStr(params.value, 24) || '—'}
          </div>
        );
      },
    },
    {
      field: 'number_of_users',
      headerName: 'Users',
      flex: 0.5,
      minWidth: 90,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 100,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Badge variant={params.value ? 'default' : 'secondary'}>
              {params.value ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        );
      },
    },
    {
      field: 'view',
      headerName: 'View',
      flex: 0.4,
      minWidth: 70,
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
      flex: 0.4,
      minWidth: 70,
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
              handleEdit(params.row);
            }}
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4 text-[#6366F1]" />
          </IconButton>
        );
      },
    },
  ];

  const filteredColumns = noFilterColumns(columns);

  return (
    <Box
      sx={{
        height: '100%',
        width: getTableWidth(),
        overflow: 'auto',
        p: 2,
      }}
    >
      <DataGrid
        rows={firmRows}
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

          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '2rem',
            overflow: 'hidden',
            border: 'none',
            marginBottom: '1rem',
          },
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
          '& .MuiDataGrid-row': {
            borderRadius: '2rem',
            backgroundColor: 'white',
            marginBottom: '0.5rem',
            overflow: 'hidden',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'transparent',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
          },
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
  );
};

export default FirmTable;
