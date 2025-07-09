import * as React from 'react';
import { Search, Home, SlidersHorizontal, ChevronDown, MenuSquare } from 'lucide-react';
import Sidebar from './Sidebar';
import MuiDrawer from '@mui/material/Drawer';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <header
      className="w-full h-20 flex items-center justify-between px-4 md:px-8 flex-nowrap"
      style={{
        backdropFilter: 'blur(20px)',
        boxShadow: '0px 4px 4px 0px #4D515A1F',
        fontFamily: 'Inter, sans-serif',
        background: 'rgba(255,255,255,0.8)',
      }}
    >
      {/* Sidebar Icon (mobile only) */}
      <button
        className="md:hidden p-2 rounded bg-white shadow mr-2"
        aria-label="Open sidebar"
        onClick={() => setDrawerOpen(true)}
      >
        <MenuSquare className="h-6 w-6 text-gray-700" />
      </button>
      <MuiDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: "fit-content", boxSizing: 'border-box', p: 0 },
        }}
      >
        <Sidebar isDrawer={true} />
      </MuiDrawer>
      {/* Search Bar: show input on md+, icon on mobile */}
      <div className="flex-1 flex items-center min-w-0">
        <div
          className="hidden md:flex items-center w-full max-w-xs rounded-sm bg-white px-4 py-2 shadow"
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 4px 4px 0px #4D515A1F',
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          }}
        >
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent outline-none border-none text-gray-700 placeholder-gray-400 font-medium text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
          <Search className="h-5 w-5 text-gray-400 ml-2" />
        </div>
        <button className="flex md:hidden items-center justify-center p-2 ml-2 rounded bg-white shadow"
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 4px 4px 0px #4D515A1F',
          }}
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-gray-700" />
        </button>
      </div>
      {/* Right Side */}
      <div className="flex items-center gap-4 ml-2 md:ml-8 flex-shrink-0">
        <button
          className="rounded-sm bg-white p-2 shadow flex items-center justify-center"
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 4px 4px 0px #4D515A1F',
          }}
        >
          <Home className="h-5 w-5 text-gray-500" />
        </button>
        <button
          className="rounded-sm bg-white p-2 shadow flex items-center justify-center"
          style={{
            backdropFilter: 'blur(20px)',
            boxShadow: '0px 4px 4px 0px #4D515A1F',
          }}
        >
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2 ml-4">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="User Avatar"
            className="h-8 w-8 rounded-full object-cover shadow"
            style={{
              backdropFilter: 'blur(20px)',
              boxShadow: '0px 4px 4px 0px #4D515A1F',
            }}
          />
          <span className="font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
            Shibtain
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
} 