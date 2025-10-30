import React, { useEffect, useState } from 'react';
import FirmTable from '@/components/setup/firm/FirmTable';
import ShowFirmDialog from '@/components/setup/firm/ShowFirmDialog';
import UpdateFirmDialog from '@/components/setup/firm/UpdateFirmDialog';
import { getFirmMeta, updateFirmDetails } from '@/api/api_services/setup';
import { useMutation } from '@tanstack/react-query';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { usePermission } from '@/utils/usePermission';

const FirmPage = () => {
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [firmMeta, setFirmMeta] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Permission checks
  const { hasPermission } = usePermission();
  const canViewMasters = hasPermission('masters.view');
  const canCreateMasters = hasPermission('masters.create');
  const canUpdateMasters = hasPermission('masters.update');
  const canDeleteMasters = hasPermission('masters.delete');
  const canShowMasters = hasPermission('masters.show');
  const canUpdateStatus = hasPermission('masters.status.update');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getFirmMeta();
        if (!isMounted) return;
        setFirmMeta(res?.data || res);
      } catch (e) {
        setFirmMeta(null);
      }
    })();
    console.log(firmMeta);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRowView = (params) => {
    setSelectedFirm(params?.row || null);
    setViewOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedFirm(row || null);
    setEditOpen(true);
  };

  const { mutate: mutateUpdateFirm, isPending: isUpdating } = useMutation({
    mutationFn: async (payload) => {
      // API expects PUT to same endpoint without id (single firm update)
      return updateFirmDetails(payload);
    },
    onSuccess: () => {
      setEditOpen(false);
      setReloadKey((k) => k + 1);
    },
  });

  const handleSubmitFirm = (data) => {
    // If backend expects 1/0 for boolean, convert here; keep as-is if bool accepted
    const payload = {
      ...data,
      is_active: data.is_active ? 1 : 0,
    };
    mutateUpdateFirm(payload);
  };

  return (
    <PermissionGuard
      permission="masters.view"
      fallback={
        <div className="p-4 h-full w-full">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-[#40444D]">Firm</h1>
            <p className="text-sm text-gray-500">View your firm details</p>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600">
              You don't have permission to view masters.
            </p>
          </div>
        </div>
      }
    >
      <div className="p-4 h-full w-full">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[#40444D]">Firm</h1>
          <p className="text-sm text-gray-500">View your firm details</p>
        </div>
        <FirmTable
          onRowClick={canShowMasters ? handleRowView : undefined}
          handleEdit={handleEdit}
          reloadKey={reloadKey}
        />
        {canShowMasters && (
          <ShowFirmDialog
            open={viewOpen}
            onClose={() => setViewOpen(false)}
            firm={selectedFirm}
            firmMeta={firmMeta}
          />
        )}
        <UpdateFirmDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          firm={selectedFirm}
          onSubmit={handleSubmitFirm}
          isLoading={isUpdating}
        />
      </div>
    </PermissionGuard>
  );
};

export default FirmPage;
