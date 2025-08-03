import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box } from '@mui/material';
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
import { Pencil, Trash2 } from 'lucide-react';

const MatterTable = ({ matters = [], onRowClick }) => {
  const [matterData, setMatterData] = useState([]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
    {
      field: 'case_role',
      headerName: 'Case Role',
      width: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
    {
      field: 'case_type',
      headerName: 'Case Type',
      width: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
    {
      field: 'case_status',
      headerName: 'Case Status',
      width: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
    {
      field: 'marketing_source',
      headerName: 'Marketing Source',
      width: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
    {
      field: 'assignee_id',
      headerName: 'Assignee',
      width: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
    {
      field: 'owner_id',
      headerName: 'Owner',
      width: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
    {
      field: 'ad_campaign',
      headerName: 'Ad Campaign',
      width: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
    {
      field: 'case_description',
      headerName: 'Case Description',
      width: 130,
      headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
      cellClassName: 'text-[#6366F1]',
    },
  ];

  useEffect(() => {
    setMatterData(matters);
  }, [matters]);

  return (
    <>
      <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
        <DataGrid
          rows={matterData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          slots={{ toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          sx={{
            padding: 2,
            border: '1px solid #E2E8F0',
            borderRadius: '0.75rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 0.75rem 0.75rem 0px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            overflow: 'auto',
          }}
          disableRowSelectionOnClick
          disableSelectionOnClick
          onRowClick={onRowClick}
        />
      </Box>
    </>
  );
};

export default MatterTable;
