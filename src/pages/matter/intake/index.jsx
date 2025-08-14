import React from 'react';
import Button from '@/components/Button';
import MatterTable from '@/components/matter/MatterTable';
import { Loader2, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import getMatters from './helpers/getMatters';
import { useNavigate } from 'react-router-dom';

const TasksPage = () => {
  const navigate = useNavigate();

  const { data: matters, isLoading } = useQuery({
    queryKey: ['matters'],
    queryFn: getMatters,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full p-4">
      <div className="flex justify-between w-full items-center">
        <p className="text-2xl font-bold">Showing {matters?.length} matters</p>
        <Button
          onClick={() => navigate(`/dashboard/inbox/overview/create`)}
          className="cursor-pointer max-w-48"
          icon={Plus}
          iconPosition='left'
        >
          Create Matter
        </Button>
      </div>
      <MatterTable
        matters={matters || []}
        onRowClick={(params) => {
          navigate(`/dashboard/inbox/overview?slugId=${params.row.slug}`, {
            state: { slug: params.row.slug },
          });
        }}
      />
    </div>
  );
};

export default TasksPage;

//    /dashboard/inbox/overview?slufgId=scbshdchsgvchgsdvg
