import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Tooltip, IconButton, Switch } from '@mui/material';
import formatDate from '@/utils/formatDate';
import { Badge } from '@/components/ui/badge';
import { Pencil, CircleOff, Trash2, Eye } from 'lucide-react';
import { noFilterColumns } from '@/utils/noFilterColumns';
import { truncateStr } from '@/utils/truncateStr';
import { getTableWidth } from '@/utils/isMobile';

const TaskTypeTable = ({
  taskTypes = [],
  handleEdit,
  handleDelete,
  handleStatusChange,
}) => {
  const [taskTypeData, setTaskTypeData] = useState([]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.3,
      minWidth: 60,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.2,
      minWidth: 150,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Tooltip title={params.value} arrow>
              <span>{truncateStr(params.value, 25)}</span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 200,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Tooltip title={params.value || 'No description'} arrow>
              <span>{truncateStr(params.value || 'No description', 30)}</span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 0.5,
      minWidth: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params) return null;
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Switch
              checked={params.value}
              onChange={(e) =>
                handleStatusChange(params.row.id, e.target.checked)
              }
              size="small"
            />
          </div>
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
      flex: 0.4,
      minWidth: 70,
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
                <CircleOff className="h-4 w-4 text-[#6366F1]" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];

  const filteredColumns = noFilterColumns(columns);

  useEffect(() => {
    if (taskTypes && Array.isArray(taskTypes)) {
      setTaskTypeData(taskTypes);
    }
  }, [taskTypes]);

  return (
    <>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px',
          '@media (max-width: 768px)': {
            minHeight: '400px',
          },
          '@media (max-width: 480px)': {
            minHeight: '300px',
          },
        }}
      >
        <DataGrid
          rows={taskTypeData}
          columns={filteredColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          autoHeight={false}
          sx={{
            height: '100%',
            width: '100%',
            padding: 2,
            border: 'none',
            borderRadius: '1rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 0.75rem 0.75rem rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            display: 'flex',
            flexDirection: 'column',

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

export default TaskTypeTable;
