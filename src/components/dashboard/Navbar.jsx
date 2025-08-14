import * as React from 'react';
import {
  Search,
  Home,
  SlidersHorizontal,
  ChevronDown,
  MenuSquare,
  Loader2,
  Plus,
  Share2,
  Settings,
  LogOut,
} from 'lucide-react';
import Sidebar from './Sidebar';
import MuiDrawer from '@mui/material/Drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loadingLogout, setLoadingLogout] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoadingLogout(true);
    setTimeout(() => {
      // clear auth (example)
      localStorage.removeItem('authToken');
      navigate('/login');
    }, 1500);
  };

  return (
    <header
      className="w-full h-20 flex items-center justify-between px-4 md:px-8 flex-nowrap"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: 'transparent',
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
          '& .MuiDrawer-paper': {
            width: 'fit-content',
            boxSizing: 'border-box',
            p: 0,
          },
        }}
      >
        <Sidebar isDrawer={true} />
      </MuiDrawer>

      {/* Search Icon (mobile) */}
      <div className="flex-1 flex items-center min-w-0">
        <button
          className="flex md:hidden items-center justify-center p-2 ml-2 rounded bg-white shadow"
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
        <button className="rounded-sm bg-white p-2 shadow flex items-center justify-center">
          <Home className="h-5 w-5 text-gray-500" />
        </button>
        <button className="rounded-sm bg-white p-2 shadow flex items-center justify-center">
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 ml-4 rounded p-1 hover:cursor-pointer hover:bg-gray-100 transition">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User Avatar"
                className="h-8 w-8 rounded-full object-cover shadow"
              />
              <span className="font-medium text-gray-700">Shibtain</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loadingLogout}
              className="text-red-600 focus:text-red-600"
            >
              {loadingLogout ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {loadingLogout ? 'Logging out...' : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
