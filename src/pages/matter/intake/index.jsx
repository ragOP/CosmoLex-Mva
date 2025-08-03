import React from 'react';
import Button from '@/components/Button';
import MatterTable from '@/components/matter/MatterTable';
import { Loader2 } from 'lucide-react';
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
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-end w-[10%]">
        <Button
          onClick={() => navigate(`/dashboard/inbox/overview/create`)}
          className="cursor-pointer"
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
