import React from 'react';
import Button from '@/components/Button';
import MatterTable from '@/components/matter/MatterTable';
import { Loader2, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import getMatters from './helpers/getMatters';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';
import { set } from 'date-fns';

const TasksPage = () => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('all');
  const [filterApplied, setFilterApplied] = useState('');

  const { data: matters, isLoading } = useQuery({
    queryKey: ['matters'],
    queryFn: getMatters,
  });

  const { data: matterMeta } = useQuery({
      queryKey: ['matterMeta'],
      queryFn: getMatterMeta,
    });
    


    const filteredMatters = React.useMemo(() => {
      if (filterText === 'all' || !filterApplied) {
        setFilterApplied('');
        return matters;
      }
      let filtered = [];
      for(const matter of matters) {
        if(matter[filterText]===filterApplied) {
          filtered.push(matter);
        }
      }
      return filtered;
      // return matters?.filter((matter) => {
      //   if (filterText === 'assignees' || filterText === 'owners') {
      //     return matter[filterText]?.some((user) => user.name === filterApplied);
      //   }
      //   return matter[filterText] === filterApplied;
      // });
    }, [filterText, filterApplied, matters]);
    

    // Removed useEffect that assigns to matters, as filteredMatters should be used directly.

  // const filterType = {
  //   case_role: [
  //     "3rd Party Defendant",
  //     "Adjuster",
  //     "Administrator",
  //     "Agency",
  //     "Arbitrator",
  //     "Attorney",
  //     "Caller",
  //     "Claimant",
  //     "Client",
  //     "Defendant",
  //     "Def-Deceased",
  //     "Def-Driver",
  //     "Def-Driver/Owner",
  //     "Def-Owner",
  //     "Def-Gov",
  //     "Doctor",
  //     "Expert",
  //     "Guardian",
  //     "Heir",
  //     "Injured Party",
  //     "Insurance Co",
  //     "Judge",
  //     "Lienholder",
  //     "Mediator",
  //     "Medical Provider",
  //     "Minor",
  //     "Nurse Case Mgr",
  //     "Opposing Attorney",
  //     "Parent",
  //     "Passenger",
  //     "Petitioner",
  //     "Plaintiff",
  //     "Plntf-Deceased",
  //     "Plntf-Driver",
  //     "Plntf-Minor",
  //     "Plntf-Owner",
  //     "Plntf-Parent",
  //     "Relative",
  //     "Rejected Caller",
  //     "Representative",
  //     "Spouse",
  //     "Trustee",
  //     "Witness",
  //     "Client Related",
  //     "Deceased",
  //     "Incapacitated",
  //     "Caregiver"
  //   ],
  //   case_type: [
  //     "Auto Accident",
  //     "Bankruptcy",
  //     "Criminal Defense Law",
  //     "Custody",
  //     "Divorce Without Children",
  //     "Dog Bite",
  //     "Domestic Violence/Restraining Orders",
  //     "Employment Law",
  //     "Estate Law",
  //     "Medical Malpractice",
  //     "Slip and Fall",
  //     "Social Security Disability"
  //   ]


  // };

  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">
      <div className="flex justify-between w-full items-center px-4 pt-4">
        <p className="text-2xl font-bold">Matters ({matters?.length || 0})</p>
        <div className='flex justify-evenly gap-2 items-center px-2 pt-4'>
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-[#E2E8F0] rounded-md px-2 h-10 shadow w-auto outline-none focus:outline-none focus-within:outline-none focus-within:ring-0">
            <Clock size={16} className="text-[#6366F1]" />
            <span className="text-sm font-semibold uppercase text-[#40444D]">
              Filter
            </span>
            <span className="h-5 w-px bg-[#E2E8F0]" />
            <div className="min-w-[110px] h-full flex items-center">
              <Select
                // value={filter}
                // onValueChange={(value) => setSearchParams({ filter: value })}
                // disabled={dashboardSummaryLoading}
                value={filterText}
                onValueChange={(value) => setFilterText(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="h-10 bg-transparent border-0 shadow-none px-1 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none outline-none w-auto min-w-[110px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="min-w-[140px]">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="case_role">Case Role</SelectItem>
                  <SelectItem value="case_type">Case Type</SelectItem>
                  <SelectItem value="case_status">Case Status</SelectItem>
                  <SelectItem value="marketing_source">Marketing Source</SelectItem>
                  <SelectItem value="assignees">Assignee</SelectItem>
                  <SelectItem value="owners">Owner</SelectItem>
                  <SelectItem value="ad_campaign_id">Ad Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={`min-w-[110px] h-full flex items-center ${filterText === 'all' ? 'hidden' : ''}`}>
              <Select
                // value={filter}
                // onValueChange={(value) => setSearchParams({ filter: value })}
                // disabled={dashboardSummaryLoading}
                value={filterApplied}
                onValueChange={(value) => setFilterApplied(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="h-10 bg-transparent border-0 shadow-none px-1 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none outline-none w-auto min-w-[110px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="min-w-[140px]">
                  {
                    filterText !== 'all' && matterMeta ? (
                      matterMeta[filterText]?.map((item) => (
                        <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="all">All</SelectItem>
                    )
                  }
                  {/* <SelectItem value="all">All</SelectItem>
                  <SelectItem value="case_role">Case Role</SelectItem>
                  <SelectItem value="case_type">Case Type</SelectItem>
                  <SelectItem value="case_status">Case Status</SelectItem>
                  <SelectItem value="marketing_source">Marketing Source</SelectItem>
                  <SelectItem value="assignee">Assignee</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="ad_campaign">Ad Campaign</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => navigate(`/dashboard/inbox/overview/create`)}
            className="cursor-pointer text-center pr-1.5 max-w-48"
            icon={Plus}
            iconPosition="left"
          >
            Create Matter
          </Button>
        </div>
      </div>
      <MatterTable
        matters={filteredMatters || []}
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