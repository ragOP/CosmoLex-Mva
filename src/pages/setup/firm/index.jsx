import React, { useEffect, useState } from 'react';
import FirmTable from '@/components/setup/firm/FirmTable';
import ShowFirmDialog from '@/components/setup/firm/ShowFirmDialog';
import UpdateFirmDialog from '@/components/setup/firm/UpdateFirmDialog';
import { getFirmMeta, updateFirmDetails } from '@/api/api_services/setup';
import { useMutation } from '@tanstack/react-query';

const FirmPage = () => {
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [firmMeta, setFirmMeta] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

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
    <div className="p-4 h-full w-full">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#40444D]">Firm</h1>
        <p className="text-sm text-gray-500">View your firm details</p>
      </div>
      <FirmTable
        onRowClick={handleRowView}
        handleEdit={handleEdit}
        reloadKey={reloadKey}
      />
      <ShowFirmDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        firm={selectedFirm}
        firmMeta={firmMeta}
      />
      <UpdateFirmDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        firm={selectedFirm}
        onSubmit={handleSubmitFirm}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default FirmPage;
