import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Avatar, Box, Tooltip, IconButton } from '@mui/material';
import formatDate from '@/utils/formatDate';
import { Badge } from '@/components/ui/badge';
import { getUserInitials, getFirstName } from '@/utils/profilePicture';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, CircleOff, Trash2, Eye, MessageSquare } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import getMetaOptions from '@/utils/getMetaFields';
import { truncateStr } from '@/utils/truncateStr';
import { noFilterColumns } from '@/utils/noFilterColumns';
import { getTableWidth } from '@/utils/isMobile';
import PermissionGuard from '@/components/auth/PermissionGuard';

// Utility function to determine flag color based on due status
const getFlagColor = (dueStatus) => {
  if (!dueStatus || typeof dueStatus !== 'string') return 'gray';

  const status = dueStatus.toLowerCase();
  const daysMatch = status.match(/(\d+)\s*day(s)?\s*left/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);

    if (days > 7) {
      return 'orange';
    } else if (days >= 3) {
      return 'yellow';
    } else {
      return 'red';
    }
  }
  if (status.includes('overdue')) {
    return 'red';
  }
  if (status.includes('1 day left')) {
    return 'red';
  }

  return 'gray';
};

const TaskTable = ({
  tasks = [],
  tasksMeta = [], // Receive tasksMeta as prop instead of calling useTasks again
  handleUpdateTaskStatus,
  onRowClick,
  handleEdit,
  handleDelete,
  handleCommentClick,
  canUpdate = false,
  canDelete = false,
  canComment = false,
  canChangeStatus = false,
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
      field: 'due_status',
      headerName: 'Due Status',
      flex: 0.5,
      minWidth: 100,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const flagColor = getFlagColor(params.value);
        const colorStyles = {
          red: { color: '#ef4444' }, //red
          yellow: { color: '#eab308' }, // yellow
          orange: { color: '#f97316' }, // orange
          gray: { color: '#9ca3af' }, // gray
        };

        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-sm">{params.value}</div>
            <FontAwesomeIcon
              icon={faFlag}
              className="h-4 w-4"
              style={colorStyles[flagColor] || colorStyles.gray}
            />
          </div>
        );
      },
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
        <div className="w-full h-full muted-foreground flex items-center justify-center">
          {truncateStr(params.value, 15)}
        </div>
      ),
    },
    {
      field: 'assignees',
      headerName: 'Assignees',
      flex: 1,
      minWidth: 100,
      headerClassName: 'uppercase text-[#40444D] font-bold text-xs',
      cellClassName: 'text-[#6366F1]',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const assignees = params.row.assignees || [];
        const maxVisible = 2;

        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col justify-center items-center gap-1">
              {assignees.length <= maxVisible ? (
                // Show all assignees if 3 or fewer
                assignees.map((assignee, index) => (
                  <Tooltip title={assignee?.name} key={index}>
                    <div className="w-14 h-4 flex items-center justify-center text-xs font-medium text-[#6366F1] border border-gray-200 rounded-sm">
                      {getFirstName(assignee?.name)}
                    </div>
                  </Tooltip>
                ))
              ) : (
                // Show only the "more" button if more than 3
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
                      +{assignees.length}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        All Assignees ({assignees.length})
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {assignees.map((assignee, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                        >
                          <span className="text-sm font-medium text-gray-900">
                            {assignee?.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        );
      },
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
                  <div className="w-14 h-4 flex items-center justify-center text-xs font-medium text-[#6366F1] border border-gray-200 rounded-sm">
                    {getFirstName(params.row.assigned_by?.name)}
                  </div>
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
            <PermissionGuard
              permission="tasks.status.update"
              fallback={
                <div className="w-[120px] h-8 text-xs flex items-center justify-center bg-gray-100 rounded border text-gray-500">
                  {statusMeta.find((s) => s.id === params.value)?.name ||
                    'Unknown'}
                </div>
              }
            >
              <Select
                value={statusMeta
                  .find((s) => s.id === params.value)
                  ?.id.toString()} // convert "Pending" → "1"
                onValueChange={(value) => {
                  handleUpdateTaskStatus(params.id, parseInt(value));
                }}
                disabled={!canChangeStatus}
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
            </PermissionGuard>
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
        <PermissionGuard
          permission="tasks.view"
          fallback={
            <IconButton disabled className="cursor-not-allowed">
              <Eye className="h-4 w-4 text-gray-400" />
            </IconButton>
          }
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(params);
            }}
            className="cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </IconButton>
        </PermissionGuard>
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
        <PermissionGuard
          permission="task-comments.view"
          fallback={
            <IconButton disabled className="cursor-not-allowed">
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </IconButton>
          }
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (!canComment) return;
              handleCommentClick(params.row);
            }}
            className="cursor-pointer"
            disabled={!canComment}
          >
            <MessageSquare className="h-4 w-4 text-[#6366F1]" />
          </IconButton>
        </PermissionGuard>
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
          <PermissionGuard
            permission="tasks.update"
            fallback={
              <IconButton className="cursor-pointer" disabled>
                <CircleOff className="h-4 w-4 text-gray-400" />
              </IconButton>
            }
          >
            {canUpdate ? (
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
              <IconButton className="cursor-pointer" disabled>
                <CircleOff className="h-4 w-4 text-[#6366F1]" />
              </IconButton>
            )}
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
          <PermissionGuard
            permission="tasks.delete"
            fallback={
              <IconButton className="cursor-pointer" disabled>
                <CircleOff className="h-4 w-4 text-gray-400" />
              </IconButton>
            }
          >
            {params?.row?.is_deletable && canDelete ? (
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
              <IconButton className="cursor-pointer" disabled>
                <CircleOff className="h-4 w-4" />
              </IconButton>
            )}
          </PermissionGuard>
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
          minHeight: '400px', // Add minimum height
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
