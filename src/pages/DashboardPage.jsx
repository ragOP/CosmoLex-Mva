import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => (
  <div className="flex h-screen bg-[#F5F5FA]">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 px-5 py-7 overflow-auto no-scrollbar">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardPage; 