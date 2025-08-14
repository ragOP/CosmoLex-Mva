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

      {/* Center - Search Bar */}
      <div className="flex-1 flex items-center justify-center max-w-md mx-4">
        {/* Search removed for now */}
      </div>

      {/* Right Side - Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            className="p-2.5 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
            style={{
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.1)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            title="Home"
          >
            <Home className="h-5 w-5 text-gray-600" />
          </button>
          
          <button 
            className="p-2.5 rounded-xl hover:bg-white/80 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
            style={{
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.1)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            title="Settings"
          >
            <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/80 transition-all duration-200 border border-white/30 hover:border-white/50"
              style={{
                backdropFilter: 'blur(20px)',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="relative">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover shadow-lg border-2 border-white/50"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-sm font-semibold text-gray-800">Shibtain</span>
              </div>
              <ChevronDown className="h-4 w-4 text-black" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-48 mt-2 p-2"
            style={{
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            }}
          >
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={loadingLogout}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-600 focus:text-red-600"
            >
              {loadingLogout ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              ) : (
                <LogOut className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {loadingLogout ? 'Logging out...' : 'Logout'}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
