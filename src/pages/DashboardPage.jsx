import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Navbar from '../components/dashboard/Navbar';

const DashboardPage = () => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardPage; 