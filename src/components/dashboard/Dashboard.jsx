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
} from 'recharts';
import CustomTable from '../CustomTable';
import { FileText, Clock, CheckCircle, TrendingUp, PlusIcon, ChartLine, ShoppingCart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from 'react-router-dom';

const columnsDummyData = [
    {
        id: 1,
        location: "Location 1",
        individual: "Individual 1",
        progress: "Progress 1",
        deadline: "Deadline 1",
        compliance: "Compliance 1",
        np: "NP 1",
        status: "Status 1",
    },
    {
        id: 2,
        location: "Location 2",
        individual: "Individual 2",
        progress: "Progress 2",
        deadline: "Deadline 2",
        compliance: "Compliance 2",
        np: "NP 2",
        status: "Status 2",
    },
    {
        id: 3,
        location: "Location 3",
        individual: "Individual 3",
        progress: "Progress 3",
        deadline: "Deadline 3",
        compliance: "Compliance 3",
        np: "NP 3",
        status: "Status 3",
    },

    {
        id: 4,
        location: "Location 1",
        individual: "Individual 1",
        progress: "Progress 1",
        deadline: "Deadline 1",
        compliance: "Compliance 1",
        np: "NP 1",
        status: "Status 1",
    },
    {
        id: 5,
        location: "Location 2",
        individual: "Individual 2",
        progress: "Progress 2",
        deadline: "Deadline 2",
        compliance: "Compliance 2",
        np: "NP 2",
        status: "Status 2",
    },
    {
        id: 6,
        location: "Location 3",
        individual: "Individual 3",
        progress: "Progress 3",
        deadline: "Deadline 3",
        compliance: "Compliance 3",
        np: "NP 3",
        status: "Status 3",
    },

    {
        id: 7,
        location: "Location 1",
        individual: "Individual 1",
        progress: "Progress 1",
        deadline: "Deadline 1",
        compliance: "Compliance 1",
        np: "NP 1",
        status: "Status 1",
    },
    {
        id: 8,
        location: "Location 2",
        individual: "Individual 2",
        progress: "Progress 2",
        deadline: "Deadline 2",
        compliance: "Compliance 2",
        np: "NP 2",
        status: "Status 2",
    },
    {
        id: 9,
        location: "Location 3",
        individual: "Individual 3",
        progress: "Progress 3",
        deadline: "Deadline 3",
        compliance: "Compliance 3",
        np: "NP 3",
        status: "Status 3",
    },
]

const figmaEarningData = [
    {
        name: 'Mon',
        no_of_registration: 10,
        no_of_renewal: 5,
        no_of_transfer_of_ownership: 3,
    },
    {
        name: 'Tue',
        no_of_registration: 12,
        no_of_renewal: 6,
        no_of_transfer_of_ownership: 4,
    },
    {
        name: 'Wed',
        no_of_registration: 15,
        no_of_renewal: 8,
        no_of_transfer_of_ownership: 5,
    },
    {
        name: 'Thu',
        no_of_registration: 18,
        no_of_renewal: 10,
        no_of_transfer_of_ownership: 6,
    },
    {
        name: 'Fri',
        no_of_registration: 20,
        no_of_renewal: 12,
        no_of_transfer_of_ownership: 7,
    },
    {
        name: 'Sat',
        no_of_registration: 22,
        no_of_renewal: 14,
        no_of_transfer_of_ownership: 8,
    },
    {
        name: 'Sun',
        no_of_registration: 25,
        no_of_renewal: 16,
        no_of_transfer_of_ownership: 9,
    },
]

const figmaInspectionData = [
    {
        name: 'Mon',
        complaints: 10,
        failed: 3,
        overdue: 9,
    },
    {
        name: 'Tue',
        complaints: 12,
        failed: 4,
        overdue: 10,
    },
    {
        name: 'Wed',
        complaints: 15,
        failed: 5,
        overdue: 12,
    },
    {
        name: 'Thu',
        complaints: 18,
        failed: 6,
        overdue: 15,
    },
    {
        name: 'Fri',
        complaints: 20,
        failed: 7,
        overdue: 18,
    },
    {
        name: 'Sat',
        complaints: 22,
        failed: 8,
        overdue: 20,
    },
    {
        name: 'Sun',
        complaints: 25,
        failed: 9,
        overdue: 22,
    },
]

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
    const column = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => row.getValue("location"),
        },
        {
            accessorKey: "individual",
            header: "Individual",
            cell: ({ row }) => row.getValue("individual"),
        },
        {
            accessorKey: "progress",
            header: "Progress",
            cell: ({ row }) => row.getValue("progress"),
        },
        {
            accessorKey: "deadline",
            header: "Deadline",
            cell: ({ row }) => row.getValue("deadline"),
        },
        {
            accessorKey: "compliance",
            header: "Compliance",
            cell: ({ row }) => row.getValue("compliance"),
        },
        {
            accessorKey: "np",
            header: "NP",
            cell: ({ row }) => row.getValue("np"),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => row.getValue("status"),
        }
    ];

    const dashBoardItem = {
        cardData: [
            { totalAmount: "₹100k", title: "Total Earning", percentage: "10%" },
            { totalAmount: "₹1059.63k", title: "Registration Fees", percentage: "10%" },
            { totalAmount: "₹10.99k", title: "Licensing Fees", percentage: "10%" },
            { totalAmount: "$100k", title: "Fines Collected", percentage: "10%" },
        ]
    };

    return (
        <div className="flex flex-col space-y-6 p-6 overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center">
                <h2 className="text-[32px] text-[#1E293B] font-bold font-sans">Dashboard</h2>
                <div className="flex items-center space-x-7">
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

            <div className="flex space-x-6">
                {dashBoardItem.cardData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center justify-center bg-[#fafafc] border-2 border-white p-3 shadow rounded-md space-y-3 w-full">
                        <div className="flex items-center justify-between w-full">
                            <h3 className="text-base text-[#4e5564] font-semibold font-sans uppercase">{item.title}</h3>
                            <span className="text-[16px] text-[#22d3ee] font-semibold font-sans">{item.percentage}</span>
                        </div>
                        <h2 className="text-[30px] text-[#40444d] font-medium font-sans text-start w-full">{item.totalAmount}</h2>
                        <div className="flex items-end justify-between w-full">
                            <span className="text-[#6366F1] text-base font-medium font-sans">View net <span className="lowercase">{item.title}</span></span>
                            <ShoppingCart color="#6366F1" className="bg-white p-3 rounded-md shadow-lg w-10 h-10" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex space-x-6 overflow-x-auto w-full h-[30rem] overflow-hidden no-scrollbar">
                <div className="w-[60%] bg-white shadow-md rounded-2xl p-6 no-scrollbar">
                    <div>
                        <h1 className="text-xl text-[#40444D] font-semibold font-sans">Vehicle Transaction</h1>
                        {/* <div className='border border-[#25282D] rounded-md p-2'>
                            
                        </div> */}
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
                                dataKey="no_of_registration"
                                stroke="none"
                                // fill="#cccccc"
                                connectNulls
                                dot
                                activeDot={{ r: 8 }}
                                style={{
                                    // background: 'linear-gradient(#3032F2 100%, #5D5FEF00 0%)',
                                    fill: '#3032F2',
                                    stroke: "#cccccc",
                                    strokeWidth: 2
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="no_of_renewal"
                                stroke="none"
                                // fill="#cccccc"
                                connectNulls
                                dot
                                activeDot={{ r: 8 }}
                                style={{
                                    // background: 'linear-gradient(#3032F2 100%, #5D5FEF00 0%)',
                                    fill: '#ff00ff',
                                    stroke: "#cccccc",
                                    strokeWidth: 2
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="no_of_transfer_of_ownership"
                                stroke="none"
                                // fill="#cccccc"
                                connectNulls
                                dot={true}
                                activeDot={true}
                                style={{
                                    // background: 'linear-gradient(#3032F2 100%, #5D5FEF00 0%)',
                                    fill: '#ff00ff',
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

                <div className='w-[40%] bg-white shadow-md rounded-2xl p-6'>
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
                            <Line type="natural" dataKey="complaints" stroke="#ff00ff" connectNulls />
                            <Line type="natural" dataKey="failed" stroke="#ff00ff" connectNulls />
                            <Line type="natural" dataKey="overdue" stroke="#ff00ff" connectNulls />
                        </ComposedChart>
                    </ResponsiveContainer>
                    {/* </div> */}
                </div>
            </div>

            {/* Table component */}
            <div className='w-full bg-white shadow-md rounded-2xl p-6'>
                <h1 className="text-xl text-[#40444D] font-semibold font-sans">Vehicle Registration</h1>
                <CustomTable
                    columns={column}            
                    data={columnsDummyData}     
                />
            </div>
        </div>
    );
};

export default Dashboard;
