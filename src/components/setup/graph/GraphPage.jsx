import React, { useState } from 'react';
import { Box, Typography, Stack, IconButton, Skeleton } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSetup } from '@/api/api_services/setup';
import { createService } from '@/api/api_services/setup';
import { deleteService } from '@/api/api_services/setup';
// Chart imports removed
import { Plus, Trash2, Pencil } from 'lucide-react';
import { DataGrid } from '@mui/x-data-grid';
import CreateServiceDialog from './CreateServiceDialog';
import UpdateServiceDialog from './UpdateServiceDialog';
import { getTableWidth } from '@/utils/isMobile';
import Button from '@/components/Button';
import { updateService } from '@/api/api_services/setup';

const GraphPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const queryClient = useQueryClient();
  const tableWidth = getTableWidth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['setup-services-list'],
    queryFn: () => getSetup('v2/setup/services/list'),
    select: (res) => res.response,
    staleTime: 5 * 60 * 1000,
  });

  const services = Array.isArray(data?.data) ? data.data : [];

  const createMutation = useMutation({
    mutationFn: (payload) => createService(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['setup-services-list']);
      setCreateOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateService(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['setup-services-list']);
      setEditOpen(false);
      setSelectedService(null);
    },
  });

  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">
      {/* Header */}
      <div className="flex justify-between w-full items-center px-4 pt-4 gap-2 flex-wrap">
        <p className="text-2xl font-bold">Services ({services.length})</p>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer max-w-48 p-2"
            icon={Plus}
            iconPosition="left"
          >
            Add Service
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Skeleton variant="circular" width={48} height={48} />
        </div>
      ) : isError ? (
        <div className="px-4">
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            Failed to load services
          </Typography>
        </div>
      ) : (
        <Stack className="bg-[#F5F5FA] rounded-lg w-full max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
          <Box
            sx={{
              height: '100%',
              width: tableWidth,
              overflow: 'auto',
              p: 2,
            }}
          >
            <DataGrid
              rows={services.map((s, index) => ({
                sno: index + 1,
                id: s.id,
                email: s.email,
                display_name: s.display_name,
                role: s.role,
                type: s.type,
                created_at: s.created_at,
              }))}
              columns={[
                {
                  field: 'sno',
                  headerName: 'S.No',
                  flex: 0.4,
                  minWidth: 80,
                  sortable: false,
                  filterable: false,
                },
                {
                  field: 'edit',
                  headerName: 'Edit',
                  flex: 0.4,
                  minWidth: 70,
                  headerClassName:
                    'uppercase text-[#40444D] font-semibold text-xs',
                  headerAlign: 'center',
                  align: 'center',
                  renderCell: (params) => {
                    if (!params || !params.row) return null;
                    const svc = services.find((s) => s.id === params.row.id);
                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(svc || null);
                            setEditOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </IconButton>
                      </div>
                    );
                  },
                  sortable: false,
                  filterable: false,
                },
                {
                  field: 'email',
                  headerName: 'Email',
                  flex: 1,
                  minWidth: 180,
                  sortable: false,
                  filterable: false,
                },
                {
                  field: 'display_name',
                  headerName: 'Display Name',
                  flex: 1,
                  minWidth: 160,
                  sortable: false,
                  filterable: false,
                },
                {
                  field: 'role',
                  headerName: 'Role',
                  flex: 0.8,
                  minWidth: 120,
                  sortable: false,
                  filterable: false,
                },
                {
                  field: 'type',
                  headerName: 'Type',
                  flex: 0.6,
                  minWidth: 100,
                  sortable: false,
                  filterable: false,
                },
                {
                  field: 'created_at',
                  headerName: 'Created At',
                  flex: 1,
                  minWidth: 180,
                  sortable: false,
                  filterable: false,
                },

                {
                  field: 'delete',
                  headerName: 'Delete',
                  flex: 0.4,
                  minWidth: 70,
                  headerClassName:
                    'uppercase text-[#40444D] font-semibold text-xs',
                  headerAlign: 'center',
                  align: 'center',
                  renderCell: (params) => {
                    if (!params || !params.row) return null;
                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconButton
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await deleteService(params.row.id);
                              await refetch();
                            } catch (err) {
                              // Swallow error to avoid console noise; consider user-facing toast
                            }
                          }}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </IconButton>
                      </div>
                    );
                  },
                  sortable: false,
                  filterable: false,
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              getRowId={(row) => row.id}
              autoHeight={false}
              disableColumnMenu
              sx={{
                padding: 2,
                border: 'none',
                borderRadius: '1rem',
                backdropFilter: 'blur(20px)',
                boxShadow: '0px 0.75rem 0.75rem rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                overflow: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }}
            />
          </Box>
        </Stack>
      )}

      <CreateServiceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(payload, close) =>
          createMutation.mutate(payload, { onSuccess: close })
        }
        isLoading={createMutation.isPending}
      />

      <UpdateServiceDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        onSubmit={(payload, close) =>
          updateMutation.mutate(
            { id: selectedService?.id, payload },
            { onSuccess: close }
          )
        }
        isLoading={updateMutation.isPending}
      />
    </div>
  );
};

export default GraphPage;
