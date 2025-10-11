import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Avatar, Box, Tooltip, IconButton } from '@mui/material';
import formatDate from '@/utils/formatDate';
import { Badge } from '@/components/ui/badge';
import { getProfilePictureUrl, getUserInitials } from '@/utils/profilePicture';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, CircleOff, Trash2, Eye, MessageSquare } from 'lucide-react';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import getMetaOptions from '@/utils/getMetaFields';
import { truncateStr } from '@/utils/truncateStr';
import { noFilterColumns } from '@/utils/noFilterColumns';
import { getTableWidth } from '@/utils/isMobile';

const TaskTable = ({
  tasks = [],
  tasksMeta = [], // Receive tasksMeta as prop instead of calling useTasks again
  handleUpdateTaskStatus,
  onRowClick,
  handleEdit,
  handleDelete,
  handleCommentClick,
}) => {
  const statusMeta = getMetaOptions({
    metaField: 'taks_status',
    metaObj: tasksMeta,
  });

  // Use useMemo to prevent unnecessary re-renders
  const taskData = useMemo(() => {
    return tasks || [];
  }, [tasks]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 70,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 1.5,
      minWidth: 150,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => truncateStr(params.value, 15),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 0.8,
      minWidth: 100,
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
      flex: 1,
      minWidth: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Tooltip arrow title={formatDate(params.value)}>
          <span className="text-sm text-muted-foreground">
            {formatDate(params.value)}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'contact_name',
      headerName: 'Contact Name',
      flex: 1,
      minWidth: 100,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          {truncateStr(params.value, 15)}
        </div>
      ),
    },
    {
      field: 'assignees',
      headerName: 'Assignees',
      flex: 1,
      minWidth: 100,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-start">
          <ScrollArea className="w-full">
            <div className="text-sm text-muted-foreground flex justify-center gap-1">
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
      flex: 1,
      minWidth: 100,
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
      field: 'status_id',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          <div className="w-full h-full flex items-center justify-start">
            <Select
              value={statusMeta
                .find((s) => s.id === params.value)
                ?.id.toString()} // convert "Pending" → "1"
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
            </Select>
            {/* <Select
              disabled={params.value === 'Completed'}
              value={params.value} // "Pending", "Completed"
              onValueChange={(value) => {
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
            </Select> */}
          </div>
        );
      },
    },
    {
      field: 'view',
      headerName: 'View',
      flex: 0.5,
      minWidth: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(params);
          }}
          className="cursor-pointer"
        >
          <Eye className="h-4 w-4" />
        </IconButton>
      ),
    },
    {
      field: 'comments',
      headerName: 'Comments',
      flex: 0.5,
      minWidth: 80,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleCommentClick(params.row);
          }}
          className="cursor-pointer"
        >
          <MessageSquare className="h-4 w-4 text-[#6366F1]" />
        </IconButton>
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
          {params?.row?.is_editable ? (
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
          {params?.row?.is_deletable ? (
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
      ),
    },
  ];

  const filteredColumns = noFilterColumns(columns);

  return (
    <>
      <Box
        sx={{
          height: '100%',
          width: getTableWidth(),
          overflowX: 'auto',
          p: 2,
        }}
      >
        <DataGrid
          rows={taskData}
          columns={filteredColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          // slots={{ toolbar: GridToolbar }}
          getRowId={(row) => row.id}
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

export default TaskTable;
