import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => (
  <div
    className="flex h-screen overflow-hidden no-scrollbar bg-transparent"
    style={{
      // background: "linear-gradient(90deg,rgba(235, 233, 254, 1) 0%, rgba(253, 253, 253, 1) 50%, rgba(254, 246, 232, 1) 100%)",
      // backgroundImage: `url("/dashboard-bg.png")`,
      // style={{
      // background: `radial-gradient(ellipse 80% 80% at 70% 20%, #e6f0ff 0%, #f2eaff 60%, #f8f9fb 100%),\nradial-gradient(ellipse 60% 60% at 20% 80%, #e0f7fa 0%, #f2eaff 80%, #f8f9fb 100%)`,
      // }}
      background: 'white',
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
