import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  DefaultLegendContent,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import CustomRadarGraph from '../custom_radar_graph/CustomRadarGraph';
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  PlusIcon,
  ChartLine,
  ShoppingCart,
  FileIcon,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataGrid, gridPageCountSelector, Toolbar } from '@mui/x-data-grid';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDashboard } from './hooks/dashboard';

// const data = {
//   date: 'June 23, 2025',
//   files_status: {
//     active: {
//       total: 256,
//       accident_benefit_claim: 112,
//       bodily_injury_claim: 96,
//       property_damage_claim: 48,
//     },
//     closed: {
//       total: 180,
//       accident_benefit_claim: 92,
//       bodily_injury_claim: 43,
//       property_damage_claim: 45,
//     },
//   },
//   settlements: {
//     total_settled_files: 145,
//     accident_benefit_claim: 76,
//     bodily_injury_claim: 37,
//     property_damage_claim: 32,
//   },
//   deadlines: {
//     general: ['SOC', 'LAT', 'AOS', 'Section 33', 'Section 44'],
//     insurance: {
//       insurance_examinations: 4,
//       upcoming_assessment: 'clients',
//       done_assessments: 'clients',
//       inform_to_ab_insurance: 3,
//       inform_to_bi_insurance: 5,
//     },
//   },
//   assessments: {
//     upcoming_assessments: 4,
//     inform_to_client: 'unform to client',
//     additional_text: 'A incent Benefit File\nProperty Damage File',
//   },
//   calendar: {
//     selected_date: '2025-06-23',
//     note: 'Preparation of notes',
//   },
//   pending_documents: [
//     'Family Physician Records',
//     'Hospital Records',
//     'Walk-In Clinic Records',
//     'OHIP Decorated Summary',
//     'Prescription Summary',
//     "Pending CNR's Payment from insurance",
//     'Accident Benefit File',
//     'Property Damage File',
//     'Notice of Assessment',
//     'School/College File',
//     'Employment File',
//   ],
// };
// const filesBreakdownData = [
//   {
//     category: 'Accident Benefit',
//     Active: data.files_status.active.accident_benefit_claim,
//     Closed: data.files_status.closed.accident_benefit_claim,
//     Settled: data.settlements.accident_benefit_claim,
//   },
//   {
//     category: 'Bodily Injury',
//     Active: data.files_status.active.bodily_injury_claim,
//     Closed: data.files_status.closed.bodily_injury_claim,
//     Settled: data.settlements.bodily_injury_claim,
//   },
//   {
//     category: 'Property Damage',
//     Active: data.files_status.active.property_damage_claim,
//     Closed: data.files_status.closed.property_damage_claim,
//     Settled: data.settlements.property_damage_claim,
//   },
// ];
// const figmaEarningData = [
//   {
//     name: 'Mon',
//     accident_benefit_claim: data.files_status.active.accident_benefit_claim,
//     bodily_injury_claim: data.files_status.active.bodily_injury_claim,
//     property_damage_claim: data.files_status.active.property_damage_claim,
//   },
//   {
//     name: 'Tue',
//     accident_benefit_claim: data.files_status.closed.accident_benefit_claim,
//     bodily_injury_claim: data.files_status.closed.bodily_injury_claim,
//     property_damage_claim: data.files_status.closed.property_damage_claim,
//   },
//   {
//     name: 'Wed',
//     accident_benefit_claim: data.settlements.accident_benefit_claim,
//     bodily_injury_claim: data.settlements.bodily_injury_claim,
//     property_damage_claim: data.settlements.property_damage_claim,
//   },
// ];
// const figmaInspectionData = [
//   {
//     name: 'Insurance',
//     insurance_examinations: data.deadlines.insurance.insurance_examinations,
//     inform_to_ab_insurance: data.deadlines.insurance.inform_to_ab_insurance,
//     inform_to_bi_insurance: data.deadlines.insurance.inform_to_bi_insurance,
//   },
//   {
//     name: 'Assessment',
//     upcoming_assessments: data.assessments.upcoming_assessments,
//     // We could hardcode 0 for example if no numbers available
//     inform_to_client: 1,
//   },
// ];

// const renderTooltipWithoutRange = ({ payload, content, ...rest }) => {
//   const newPayload = payload.filter(
//     (x) =>
//       x.dataKey !== 'no_of_registration' &&
//       x.dataKey !== 'no_of_renewal' &&
//       x.dataKey !== 'no_of_transfer_of_ownership' &&
//       x.dataKey !== 'complaints' &&
//       x.dataKey !== 'failed' &&
//       x.dataKey !== 'overdue' &&
//       x.dataKey !== 'property_damage'
//   );
//   return <Tooltip payload={newPayload} {...rest} />;
// };4

// const renderLegendWithoutRange = ({ payload, content, ...rest }) => {
//   // console.log(payload);
//   const newPayload = payload.filter(
//     (x) =>
//       x.dataKey !== 'no_of_registration' &&
//       x.dataKey !== 'no_of_renewal' &&
//       x.dataKey !== 'no_of_transfer_of_ownership' &&
//       x.dataKey !== 'complaints' &&
//       x.dataKey !== 'failed' &&
//       x.dataKey !== 'overdue' &&
//       x.dataKey !== 'property_damage'
//   );
//   const payloadToSend = newPayload.map((x) => ({
//     ...x,
//     value: snakeCaseToTitleCase(x.value),
//   }));
//   return <DefaultLegendContent payload={payloadToSend} {...rest} />;
// };

const Dashboard = () => {
  const navigate = useNavigate();
  const { dashboardSummary, dashboardSummaryLoading } = useDashboard();
  // console.log(dashboardSummary);
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all'; // all | week | last_week | month | last_month | year | last_year
  React.useEffect(() => {
    if (!searchParams.get('filter')) {
      setSearchParams({ filter: 'all' });
    }
  }, [searchParams, setSearchParams]);
  const totalIntakes = dashboardSummary?.total_intakes ?? 0;
  const closedIntakes = dashboardSummary?.closed_intakes ?? 0;
  const activeIntakes = dashboardSummary?.active_intakes ?? 0;
  const pendingIntakes = dashboardSummary?.pending_intakes ?? 0;
  // const settledIntakes = totalIntakes - closedIntakes;

  // const pendingDocumentsColumns = [
  //   {
  //     field: 'document',
  //     headerName: 'Document Name',
  //     headerClassName: 'uppercase text-[#40444D] font-semibold text-xs',
  //     width: 200,
  //     cellClassName: 'text-[#6366F1]',
  //   },
  // ];
  // const pendingDocumentsRows = data.pending_documents.map((doc, index) => ({
  //   id: index + 1,
  //   document: doc,
  // }));

  const dashBoardItem = {
    cardData: [
      {
        total: activeIntakes,
        title: 'active files',
        percentage: `${
          totalIntakes ? ((activeIntakes / totalIntakes) * 100).toFixed(1) : 0
        }%`,
        icon: (
          <FileIcon
            color="#6366F1"
            className="bg-white p-3 rounded-md shadow-lg w-10 h-10"
          />
        ),
      },
      {
        total: closedIntakes,
        title: 'Closed Files',
        percentage: `${
          totalIntakes ? ((closedIntakes / totalIntakes) * 100).toFixed(1) : 0
        }%`,
        icon: (
          <FileIcon
            color="#6366F1"
            className="bg-white p-3 rounded-md shadow-lg w-10 h-10"
          />
        ),
      },
      {
        total: totalIntakes,
        title: 'Total Files',
        percentage: `${
          totalIntakes ? ((totalIntakes / totalIntakes) * 100).toFixed(1) : 0
        }%`,
        icon: (
          <FileIcon
            color="#6366F1"
            className="bg-white p-3 rounded-md shadow-lg w-10 h-10"
          />
        ),
      },
      // {
      //   total: totalIntakes - closedIntakes,
      //   title: 'Settled Files',
      //   percentage: `${
      //     totalIntakes
      //       ? ((totalIntakes - closedIntakes) / totalIntakes) * 100
      //       : 0
      //   }%`,
      //   icon: (
      //     <FileIcon
      //       color="#6366F1"
      //       className="bg-white p-3 rounded-md shadow-lg w-10 h-10"
      //     />
      //   ),
      // },
      // {
      //   total: pendingIntakes,
      //   title: 'Pending Documents',
      //   percentage: `${
      //     totalIntakes ? ((pendingIntakes / totalIntakes) * 100).toFixed(1) : 0
      //   }%`,
      //   icon: (
      //     <FileIcon
      //       color="#6366F1"
      //       className="bg-white p-3 rounded-md shadow-lg w-10 h-10"
      //     />
      //   ),
      // },
      // {
      //   total: 'Preparation of notes',
      //   title: 'Calendar Note 23, June 2025',
      //   percentage: '10%',
      //   icon: (
      //     <FileIcon
      //       color="#6366F1"
      //       className="bg-white p-3 rounded-md shadow-lg w-10 h-10"
      //     />
      //   ),
      // },
    ],
  };

  return (
    <div className="flex flex-col space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar p-4">
      <div className="flex justify-between items-center">
        <h2 className="hidden sm:block text-[32px] text-[#1E293B] font-bold font-sans">
          Dashboard
        </h2>
        <div className="flex items-center gap-3 lg:space-x-7">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-[#E2E8F0] rounded-md px-2 h-10 shadow w-auto outline-none focus:outline-none focus-within:outline-none focus-within:ring-0">
            <Clock size={16} className="text-[#6366F1]" />
            <span className="text-sm font-semibold uppercase text-[#40444D]">
              Filter
            </span>
            <span className="h-5 w-px bg-[#E2E8F0]" />
            <div className="min-w-[110px] h-full flex items-center">
              <Select
                value={filter}
                onValueChange={(value) => setSearchParams({ filter: value })}
                disabled={dashboardSummaryLoading}
              >
                <SelectTrigger className="h-10 bg-transparent border-0 shadow-none px-1 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none outline-none w-auto min-w-[110px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="min-w-[140px]">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                  <SelectItem value="last_week">Last week</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                  <SelectItem value="last_month">Last month</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                  <SelectItem value="last_year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <button
            className="flex items-center gap-2 shadow-lg flex-shrink-0 text-sm sm:text-base leading-none"
            style={{
              background:
                'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
              color: '#fff',
              height: '40px',
              lineHeight: '40px',
              padding: '0 12px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard/inbox/overview/create')}
          >
            <PlusIcon size={16} />
            <span>Create Matter</span>
          </button>
          <ChartLine
            color="#6366F1"
            className="bg-white p-3 rounded-md shadow-lg w-10 h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto w-full overflow-hidden no-scrollbar">
        {dashBoardItem.cardData.map((item, index) => (
          <DashboardCard
            key={index}
            item={item}
            onCardClick={() => {
              if (item.title === 'active files') {
                navigate('/dashboard/inbox?filter=active-files');
              } else if (item.title === 'Closed Files') {
                navigate('/dashboard/inbox?filter=closed-files');
              } else if (item.title === 'Total Files') {
                navigate('/dashboard/inbox?filter=all-files');
              }
            }}
          />
        ))}
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-2 gap-6 overflow-x-auto w-full overflow-hidden no-scrollbar">
        <div className="col-span-3 p-4 bg-white/30 backdrop-blur-sm rounded-lg">
          <div className="w-full border border-[#E2E8F0] shadow-[0px_4px_24px_0px #000000] h-[25rem] bg-white/50 backdrop-blur-sm rounded-lg px-4 py-6 lg:p-6 no-scrollbar">
            <div>
              <h1 className="text-xl text-[#40444D] font-semibold font-sans">
                Vehicle Transaction
              </h1>
            </div>
            <ResponsiveContainer width="100%" height="100%" className="py-5">
              <ComposedChart
                width={500}
                height={400}
                data={figmaEarningData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={renderTooltipWithoutRange} />
                <Area
                  type="monotone"
                  dataKey="accident_benefit_claim"
                  stroke="none"
                  connectNulls
                  dot
                  activeDot={{ r: 8 }}
                  style={{
                    fill: '#9698f6',
                    stroke: '#cccccc',
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bodily_injury_claim"
                  stroke="none"
                  connectNulls
                  dot
                  activeDot={{ r: 8 }}
                  style={{
                    fill: '#6be2f4',
                    stroke: '#cccccc',
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="property_damage_claim"
                  stroke="none"
                  connectNulls
                  dot={true}
                  activeDot={true}
                  style={{
                    fill: '#6b7280',
                    stroke: '#cccccc',
                    strokeWidth: 2,
                  }}
                />
               
                <Legend content={renderLegendWithoutRange} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-2 p-4 bg-white/30 backdrop-blur-sm rounded-lg">
          <div className="w-full border border-[#E2E8F0] shadow-[0px_4px_24px_0px #000000] h-[25rem] bg-white/50 backdrop-blur-sm rounded-lg p-6">
            <h1 className="text-xl text-[#40444D] font-semibold font-sans">
              Inspection Compliance
            </h1>
            
            <ResponsiveContainer width="100%" height="100%" className="py-5">
              <ComposedChart
                width={500}
                height={300}
                data={figmaInspectionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#25282D' }} />
                <YAxis tick={{ fill: '#25282D' }} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #ccc',
                  }}
                  cursorStyle={{
                    stroke: '#ccc',
                    strokeWidth: 1,
                    strokeDasharray: '3 3',
                  }}
                />
                <Legend content={renderLegendWithoutRange} />
                <Line
                  type="natural"
                  dataKey="insurance_examinations"
                  stroke="#9698f6"
                  connectNulls
                />
                <Line
                  type="natural"
                  dataKey="inform_to_ab_insurance"
                  stroke="#9698f6"
                  connectNulls
                />
                <Line
                  type="natural"
                  dataKey="inform_to_bi_insurance"
                  stroke="#9698f6"
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
            
          </div>
        </div>

        <div className="col-span-2 p-4 bg-white/30 backdrop-blur-sm rounded-lg">
          <div className="w-full border border-[#E2E8F0] shadow-[0px_4px_24px_0px #000000] bg-white/50 backdrop-blur-sm rounded-lg p-6 h-[25rem]">
            <h1 className="text-xl text-[#40444D] font-semibold font-sans mb-4">
              Files Breakdown Overview
            </h1>
            <CustomRadarGraph
              data={filesBreakdownData}
              dataKeys={['Active', 'Closed', 'Settled']}
              colors={{
                Active: '#9698f6',
                Closed: '#9698f6',
                Settled: '#9698f6',
              }}
            />
          </div>
        </div>

        <div className="col-span-3 p-4 bg-white/30 backdrop-blur-sm rounded-lg">
          <div className="w-full border border-[#E2E8F0] shadow-[0px_4px_24px_0px #000000] h-[25rem] bg-white/50 backdrop-blur-sm rounded-lg p-6">
            <h1 className="text-xl text-[#40444D] font-semibold font-sans mb-4">
              Claims Type Distribution
            </h1>
            <ResponsiveContainer width="100%" height={300} className="py-5">
              <BarChart
                data={filesBreakdownData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Active" fill="#9698f6" />
                <Bar dataKey="Closed" fill="#6be2f4" />
                <Bar dataKey="Settled" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full h-full overflow-x-auto no-scrollbar">
        <div
          className="w-full p-4 overflow-x-hidden no-scrollbar"
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 1px 0px 0px #0000000D',
          }}
        >
          
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px] max-w-full">
              <DataGrid
                checkboxSelection
                rows={pendingDocumentsRows}
                columns={pendingDocumentsColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                components={{
                  Toolbar: CustomHeader, // Heading now part of table's header area
                }}
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
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;

const DashboardCard = ({ item, onCardClick }) => {
  return (
    <div className="bg-white/30 backdrop-blur-sm p-4 rounded-md">
      <div
        key={item.id}
        className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm p-3 shadow rounded-md space-y-3 cursor-pointer hover:bg-white/70 transition-colors"
        onClick={onCardClick}
      >
        <div className="flex items-center justify-between w-full">
          <h3 className="text-base text-[#4e5564] font-semibold font-sans uppercase">
            {item.title}
          </h3>
          <span className="text-[16px] text-[#22d3ee] font-semibold font-sans">
            {item.percentage}
          </span>
        </div>
        <h2 className="text-[30px] text-[#40444d] font-medium font-sans text-start w-full">
          {item.total}
        </h2>
        <div className="flex items-end justify-between w-full">
          <span className="text-[#6366F1] text-base font-medium font-sans cursor-pointer hover:underline">
            View net <span className="lowercase">{item.title}</span>
          </span>
          {item.icon}
        </div>
      </div>
    </div>
  );
};

// const snakeCaseToTitleCase = (str) => {
//   if (!str) return '';
//   const words = str
//     .replace(/_/g, ' ')
//     .replace(/\b\w/g, (char) => char.toUpperCase());
//   return words;
// };

// function CustomHeader() {
//   return (
//     <Toolbar
//       sx={{
//         backgroundColor: 'black',
//         color: 'white',
//         padding: '0.75rem 1rem',
//         fontWeight: 'bold',
//         fontSize: '1.25rem',
//       }}
//     >
//       Pending Documents
//     </Toolbar>
//   );
// }
