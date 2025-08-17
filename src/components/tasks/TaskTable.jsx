import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Avatar, Box, Tooltip } from '@mui/material';
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
import { useTasks } from '@/components/tasks/hooks/useTasks';
import getMetaOptions from '@/utils/getMetaFields';

const TaskTable = ({
  tasks = [],
  handleUpdateTaskStatus,
  onRowClick,
  handleEdit,
  handleDelete,
}) => {
  const [taskData, setTaskData] = useState([]);
  const { tasksMeta } = useTasks();
  const statusMeta = getMetaOptions({
    metaField: 'taks_status',
    metaObj: tasksMeta,
  });
  console.log(statusMeta);
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
      field: 'subject',
      headerName: 'Subject',
      flex: 1,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'priority',
      headerName: 'Priority',
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
      field: 'due_date',
      headerName: 'Due Date',
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
      field: 'contact_name',
      headerName: 'Contact Name',
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
      field: 'assignees',
      headerName: 'Assignees',
      width: 100,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-start">
          <ScrollArea className="w-full">
            <div className="text-sm text-muted-foreground flex justify-center">
              {params.row.assignees.map((a, index) => (
                <Tooltip title={a?.name} key={index}>
                  <Avatar src={a?.profile} alt={a?.name} />
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
        </div>
      ),
    },
    {
      field: 'assigned_by',
      headerName: 'Assigned By',
      width: 100,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-start">
          <ScrollArea className="w-full">
            <div className="text-sm text-muted-foreground flex justify-center">
              {params.row.assigned_by && (
                <Tooltip title={params.row.assigned_by?.name}>
                  <Avatar
                    src={params.row.assigned_by?.profile}
                    alt={params.row.assigned_by?.name}
                  />
                </Tooltip>
              )}
            </div>
          </ScrollArea>
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        console.log(params.value);
        return (
          <div className="w-full h-full flex items-center justify-start">
            {/* Uncomment when backend send id rather string for status */}
            {/*
            
            <Select
  disabled={params.value === 'Completed'}
  value={
    statusMeta.find((s) => s.name === params.value)?.id.toString()
  } // convert "Pending" → "1"
  onValueChange={(value) => {
    handleUpdateTaskStatus(params.id, parseInt(value));
  }}
>
  <SelectTrigger className="w-[120px] h-8 text-xs">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {statusMeta.map((status) => (
      <SelectItem key={status.id} value={status.id.toString()}>
        {status.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>*/}
            <Select
              disabled={params.value === 'Completed'}
              value={params.value} // "Pending", "Completed"
              onValueChange={(value) => {
                console.log('value', value);
                handleUpdateTaskStatus(params.id, value); // pass name directly
              }}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusMeta.map((status) => (
                  <SelectItem key={status.id} value={status.name}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      },
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
          {params?.row?.is_editable ? (
            <Pencil
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(params.row);
              }}
              className="h-4 w-4 cursor-pointer hover:text-blue-500 transition-colors duration-300"
            />
          ) : (
            <CircleOff className="h-4 w-4 cursor-pointer hover:text-blue-500 transition-colors duration-300" />
          )}
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
          {params?.row?.is_deletable ? (
            <Trash2
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row);
              }}
              className="h-4 w-4 cursor-pointer hover:text-red-500 transition-colors duration-300"
            />
          ) : (
            <CircleOff className="h-4 w-4 cursor-pointer hover:text-blue-500 transition-colors duration-300" />
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setTaskData(tasks);
  }, [tasks]);

  return (
    <>
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={taskData}
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
              cursor: 'pointer',
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
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              // background:
              //   'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
              color: 'white',
              transition: 'all 0.3s ease-in-out',
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
          onRowClick={onRowClick}
        />
      </Box>
    </>
  );
};

export default TaskTable;
