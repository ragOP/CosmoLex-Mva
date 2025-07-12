import React from 'react';
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
import { FileText, Clock, CheckCircle, TrendingUp, PlusIcon, ChartLine, ShoppingCart, FileIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { 
    DataGrid,
    gridPageCountSelector,
 } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { cardHeaderClasses } from '@mui/material';

const data = {
    date: 'June 23, 2025',
    files_status: {
        active: {
            total: 256,
            accident_benefit_claim: 112,
            bodily_injury_claim: 96,
            property_damage_claim: 48,
        },
        closed: {
            total: 180,
            accident_benefit_claim: 92,
            bodily_injury_claim: 43,
            property_damage_claim: 45,
        },
    },
    settlements: {
        total_settled_files: 145,
        accident_benefit_claim: 76,
        bodily_injury_claim: 37,
        property_damage_claim: 32
    },
    deadlines: {
        general: ['SOC', 'LAT', 'AOS', 'Section 33', 'Section 44'],
        insurance: {
            insurance_examinations: 4,
            upcoming_assessment: 'clients',
            done_assessments: 'clients',
            inform_to_ab_insurance: 3,
            inform_to_bi_insurance: 5,
        },
    },
    assessments: {
        upcoming_assessments: 4,
        inform_to_client: 'unform to client',
        additional_text: 'A incent Benefit File\nProperty Damage File'
    },
    calendar: {
        selected_date: '2025-06-23',
        note: 'Preparation of notes',
    },
    pending_documents: [
        "Family Physician Records",
        "Hospital Records",
        "Walk-In Clinic Records",
        "OHIP Decorated Summary",
        "Prescription Summary",
        "Pending CNR's Payment from insurance",
        "Accident Benefit File",
        "Property Damage File",
        "Notice of Assessment",
        "School/College File",
        "Employment File"
    ],
};

const filesBreakdownData = [
    {
        category: 'Accident Benefit',
        Active: data.files_status.active.accident_benefit_claim,
        Closed: data.files_status.closed.accident_benefit_claim,
        Settled: data.settlements.accident_benefit_claim,
    },
    {
        category: 'Bodily Injury',
        Active: data.files_status.active.bodily_injury_claim,
        Closed: data.files_status.closed.bodily_injury_claim,
        Settled: data.settlements.bodily_injury_claim,
    },
    {
        category: 'Property Damage',
        Active: data.files_status.active.property_damage_claim,
        Closed: data.files_status.closed.property_damage_claim,
        Settled: data.settlements.property_damage_claim,
    },
];

const figmaEarningData = [
    {
        name: 'Mon',
        accident_benefit_claim: data.files_status.active.accident_benefit_claim,
        bodily_injury_claim: data.files_status.active.bodily_injury_claim,
        property_damage_claim: data.files_status.active.property_damage_claim,
    },
    {
        name: 'Tue',
        accident_benefit_claim: data.files_status.closed.accident_benefit_claim,
        bodily_injury_claim: data.files_status.closed.bodily_injury_claim,
        property_damage_claim: data.files_status.closed.property_damage_claim,
    },
    {
        name: 'Wed',
        accident_benefit_claim: data.settlements.accident_benefit_claim,
        bodily_injury_claim: data.settlements.bodily_injury_claim,
        property_damage_claim: data.settlements.property_damage_claim,
    },
];


const figmaInspectionData = [
    {
        name: 'Insurance',
        insurance_examinations: data.deadlines.insurance.insurance_examinations,
        inform_to_ab_insurance: data.deadlines.insurance.inform_to_ab_insurance,
        inform_to_bi_insurance: data.deadlines.insurance.inform_to_bi_insurance,
    },
    {
        name: 'Assessment',
        upcoming_assessments: data.assessments.upcoming_assessments,
        // We could hardcode 0 for example if no numbers available
        inform_to_client: 1,
    },
];


const renderTooltipWithoutRange = ({ payload, content, ...rest }) => {
    const newPayload = payload.filter((x) => x.dataKey !== "no_of_registration" && x.dataKey !== "no_of_renewal" && x.dataKey !== "no_of_transfer_of_ownership" && x.dataKey !== "complaints" && x.dataKey !== "failed" && x.dataKey !== "overdue" && x.dataKey !== "property_damage");
    return <Tooltip payload={newPayload} {...rest} />;
}

const renderLegendWithoutRange = ({ payload, content, ...rest }) => {
    // console.log(payload);
    const newPayload = payload.filter((x) => x.dataKey !== "no_of_registration" && x.dataKey !== "no_of_renewal" && x.dataKey !== "no_of_transfer_of_ownership" && x.dataKey !== "complaints" && x.dataKey !== "failed" && x.dataKey !== "overdue" && x.dataKey !== "property_damage");
    return <DefaultLegendContent payload={newPayload} {...rest} />;
}

const Dashboard = () => {
    const navigate = useNavigate();

    const pendingDocumentsColumns = [
        { field: 'document', headerName: 'Document Name', headerClassName: "uppercase text-[#40444D] font-semibold text-xs", width: 200, cellClassName: "text-[#6366F1]" },
    ];
    const pendingDocumentsRows = data.pending_documents.map((doc, index) => ({
        id: index + 1,
        document: doc,
    }));

    const dashBoardItem = {
        cardData: [
            { total: "256", title: "Active Files", percentage: "10%", icon: <FileIcon color="#6366F1" className="bg-white p-3 rounded-md shadow-lg w-10 h-10" /> },
            { total: "180", title: "Closed Files", percentage: "10%", icon: <FileIcon color="#6366F1" className="bg-white p-3 rounded-md shadow-lg w-10 h-10" /> },
            { total: "145", title: "Total Settled Files", percentage: "10%", icon: <FileIcon color="#6366F1" className="bg-white p-3 rounded-md shadow-lg w-10 h-10" /> },
            { total: "4", title: "Upcoming Assessments", percentage: "10%", icon: <FileIcon color="#6366F1" className="bg-white p-3 rounded-md shadow-lg w-10 h-10" /> },
            { total: "11", title: "Pending Documents", percentage: "10%", icon: <FileIcon color="#6366F1" className="bg-white p-3 rounded-md shadow-lg w-10 h-10" /> },
            { total: "Preparation of notes", title: "Calendar Note 23, June 2025", percentage: "10%", icon: <FileIcon color="#6366F1" className="bg-white p-3 rounded-md shadow-lg w-10 h-10" /> },
        ]
    };

    return (
        <div className="flex flex-col space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar">
            <div className="flex justify-between items-center">
                <h2 className="text-[32px] text-[#1E293B] font-bold font-sans">Dashboard</h2>
                <div className="flex items-center space-x-4 lg:space-x-7">
                    <button className="flex items-center gap-2 shadow-lg"
                        style={{
                            background: 'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
                            color: '#fff', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer'
                        }}
                        onClick={() => navigate('/dashboard/dashboard-form')}>
                        <PlusIcon />
                        <span>Add Product</span>
                    </button>
                    <ChartLine color="#6366F1" className="bg-white p-3 rounded-md shadow-lg w-10 h-10" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto w-full overflow-hidden no-scrollbar">
                {dashBoardItem.cardData.map((item, index) => (
                    <DashboardCard key={index} item={item} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-2 gap-6 overflow-x-auto w-full overflow-hidden no-scrollbar">
                <div className="w-full border border-[#E2E8F0] shadow-[0px_4px_24px_0px #000000] col-span-3 h-[25rem] bg-white rounded-lg px-4 py-6 lg:p-6 no-scrollbar">
                    <div>
                        <h1 className="text-xl text-[#40444D] font-semibold font-sans">Vehicle Transaction</h1>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
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
                                // fill="#cccccc"
                                connectNulls
                                dot
                                activeDot={{ r: 8 }}
                                style={{
                                    // background: 'linear-gradient(#3032F2 100%, #5D5FEF00 0%)',
                                    fill: '#9698f6',
                                    stroke: "#cccccc",
                                    strokeWidth: 2
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="bodily_injury_claim"
                                stroke="none"
                                // fill="#cccccc"
                                connectNulls
                                dot
                                activeDot={{ r: 8 }}
                                style={{
                                    // background: 'linear-gradient(#3032F2 100%, #5D5FEF00 0%)',
                                    fill: '#6be2f4',
                                    stroke: "#cccccc",
                                    strokeWidth: 2
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="property_damage_claim"
                                stroke="none"
                                // fill="#cccccc"
                                connectNulls
                                dot={true}
                                activeDot={true}
                                style={{
                                    // background: 'linear-gradient(#3032F2 100%, #5D5FEF00 0%)',
                                    fill: '#6b7280',
                                    stroke: "#cccccc",
                                    strokeWidth: 2
                                }}
                            />
                            {/* <Line type="natural" dataKey="no_of_renewal" stroke="#ff00ff" connectNulls />
                            <Line type="natural" dataKey="no_of_transfer_of_ownership" stroke="#ff00ff" connectNulls /> */}
                            <Legend content={renderLegendWithoutRange} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className='w-full border border-[#E2E8F0] shadow-[0px_4px_24px_0px #000000] col-span-2 h-[25rem] bg-white rounded-lg p-6'>
                    <h1 className="text-xl text-[#40444D] font-semibold font-sans">Inspection Compliance</h1>
                    {/* <div className='border border-[#25282D] rounded-md p-2'> */}
                    <ResponsiveContainer width="100%" height="100%">
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
                            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ccc' }} cursorStyle={{ stroke: '#ccc', strokeWidth: 1, strokeDasharray: '3 3' }} />
                            <Legend content={renderLegendWithoutRange} />
                            <Line type="natural" dataKey="insurance_examinations" stroke="#9698f6" connectNulls />
                            <Line type="natural" dataKey="inform_to_ab_insurance" stroke="#9698f6" connectNulls />
                            <Line type="natural" dataKey="inform_to_bi_insurance" stroke="#9698f6" connectNulls />
                        </ComposedChart>
                    </ResponsiveContainer>
                    {/* </div> */}
                </div>

                <div className='w-full border border-[#E2E8F0] shadow-[0px_4px_24px_0px #000000] col-span-2 bg-white rounded-lg p-6 h-[25rem]'>
                    <h1 className="text-xl text-[#40444D] font-semibold font-sans mb-4">Files Breakdown Overview</h1>
                    <CustomRadarGraph
                        data={filesBreakdownData}
                        dataKeys={['Active', 'Closed', 'Settled']}
                        colors={{
                            Active: '#9698f6',
                            Closed: '#9698f6',
                            Settled: '#9698f6'
                        }}
                    />
                </div>

                <div className="w-full border border-[#E2E8F0] shadow-[0px_4px_24px_0px #000000] col-span-3 h-[25rem] bg-white rounded-lg p-6">
                    <h1 className="text-xl text-[#40444D] font-semibold font-sans mb-4">
                        Claims Type Distribution
                    </h1>
                    <ResponsiveContainer width="100%" height={300}>
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

            {/* Table component */}
            <div className='w-full h-full overflow-x-auto no-scrollbar'>
                <div className='w-full bg-white rounded-lg p-6 overflow-x-hidden no-scrollbar'
                    style={{
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0px 1px 0px 0px #0000000D',
                    }}
                >
                    <h1 className="text-xl text-[#40444D] font-semibold font-sans">Pending Documents ({pendingDocumentsRows.length})</h1>
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[300px] max-w-full">
                            <DataGrid
                                checkboxSelection
                                rows={pendingDocumentsRows}
                                columns={pendingDocumentsColumns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                sx={{
                                    padding: 2,
                                    border: 'none',
                                }}
                            />

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

const DashboardCard = ({ item }) => {
    return (
        <div key={item.id} className="flex flex-col items-center justify-center bg-[#fafafc] border-2 border-white p-3 shadow rounded-md space-y-3 ">
            <div className="flex items-center justify-between w-full">
                <h3 className="text-base text-[#4e5564] font-semibold font-sans uppercase">{item.title}</h3>
                <span className="text-[16px] text-[#22d3ee] font-semibold font-sans">{item.percentage}</span>
            </div>
            <h2 className="text-[30px] text-[#40444d] font-medium font-sans text-start w-full">{item.total}</h2>
            <div className="flex items-end justify-between w-full">
                <span className="text-[#6366F1] text-base font-medium font-sans cursor-pointer hover:underline">View net <span className="lowercase">{item.title}</span></span>
                {item.icon}
            </div>
        </div>
    );
};
