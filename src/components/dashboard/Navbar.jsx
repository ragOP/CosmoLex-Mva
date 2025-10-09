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
  User,
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
import { useSelector, useDispatch } from 'react-redux';
import { Breadcrumb } from '@/components/breadcrumb/index';
import { getProfile } from '@/api/api_services/profile';
import { setUser } from '@/store/slices/authSlice';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loadingLogout, setLoadingLogout] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    setLoadingLogout(true);
    setTimeout(() => {
      // clear auth (example)
      localStorage.removeItem('authToken');
      navigate('/login');
    }, 1500);
  };

  const handleEditProfile = () => {
    navigate('/dashboard/profile');
  };

  // Fetch user profile data
  const fetchUserProfile = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      const profileData = await getProfile();
      if (profileData && Object.keys(profileData).length > 0) {
        dispatch(setUser({ ...user, ...profileData }));
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }, []);

  // Fetch profile on component mount and when user changes
  React.useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile]);

  const items = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Inbox', href: '/inbox' },
    { label: 'Tasks', href: '/tasks' },
    { label: 'Matters', href: '/matters' },
    { label: 'Contacts', href: '/contacts' },
    { label: 'Settings', href: '/settings' },
  ];

  return (
    <header
      className="w-full h-20 flex items-center justify-between px-4 md:px-8 flex-nowrap"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: 'transparent',
      }}
    >
      <Breadcrumb items={items} />

      {/* Right Side - Actions & Profile */}
      <div className="flex justify-between items-center gap-3 ">
        {/* Sidebar Icon (mobile only) */}
        <button
          className="md:hidden p-2 rounded bg-white shadow"
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
                {user?.profile_picture ? (
                  <img
                    src={
                      user.profile_picture.startsWith('http')
                        ? user.profile_picture
                        : `https://backend.vsrlaw.ca/storage/user_profiles/${user.profile_picture}`
                    }
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full object-cover shadow-lg border-2 border-white/50"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}

                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-sm font-semibold text-gray-800">
                  {user
                    ? `${user.first_name || ''} ${
                        user.last_name || ''
                      }`.trim() || 'User'
                    : 'User'}
                </span>
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
              onClick={handleEditProfile}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 focus:text-gray-700"
            >
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Edit Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
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
