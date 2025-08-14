import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => (
  <div
    className="flex h-screen overflow-hidden no-scrollbar bg-transparent"
    style={{
      // background: "linear-gradient(90deg,rgba(235, 233, 254, 1) 0%, rgba(253, 253, 253, 1) 50%, rgba(254, 246, 232, 1) 100%)",
      backgroundImage: `url("/dashboard-bg.png")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backdropFilter: 'blur(20px)',
    }}
  >
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto no-scrollbar h-full">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardPage;
