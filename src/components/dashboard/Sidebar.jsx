import {
  BookText,
  LayoutDashboardIcon,
  File,
  Folder,
  TextSearch,
  Calendar,
  CheckSquare,
  Inbox,
  Eye,
  FileText,
  ClipboardList,
  MessageSquare,
  DollarSign,
  Activity,
  FormInput,
  StickyNote,
  User,
  Contact,
  Settings2,
  Users,
} from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CustomRickTreeView from '../custom_tree_view/CustomRickTreeView';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getToken, decodeToken } from '@/utils/auth';
import { getUserById } from '@/api/api_services/user';
import { setUser } from '@/store/slices/authSlice';

const typeToIcon = {
  file: File,
  folder: Folder,
  tree: BookText,
  link: LayoutDashboardIcon,
  data: TextSearch,
  calendar: Calendar,
  tasks: CheckSquare,
  inbox: Inbox,
  dashboard: LayoutDashboardIcon,
  overview: Eye,
  form: FormInput,
  notes: StickyNote,
  event: Calendar,
  documentation: FileText,
  communication: MessageSquare,
  finance: DollarSign,
  users: User,
  contact: Contact,
  'activity-logs': Activity,
  agenda: ClipboardList,
  setup: Settings2,
  roles: Users,
  firm: Users,
};

const sidebarItems = [
  {
    id: '/dashboard',
    label: 'Dashboard',
    type: 'link',
    iconType: 'dashboard',
  },
  {
    id: '/dashboard/event',
    label: ' Event Calendar',
    type: 'link',
    iconType: 'calendar',
  },
  // {
  //     id: '/dashboard/analytics',
  //     label: 'Analytics',
  //     type: 'link',
  //     iconType: 'analytics',
  // },
  // {
  //   id: 'matter',
  //   label: 'Matter',
  //   type: 'tree',
  //   iconType: 'tree',
  //   treeData: [
  //     {
  //       id: '1',
  //       label: 'Forms',
  //       fileType: 'folder',
  //       children: [
  //         { id: '1.1', label: 'Claim Form', fileType: 'file' },
  //         { id: '1.2', label: 'Renewal Form', fileType: 'file' },
  //         { id: '1.3', label: 'Transfer of Ownership', fileType: 'file' },
  //       ],
  //     },
  //     {
  //       id: '2',
  //       label: 'Policies',
  //       fileType: 'folder',
  //       children: [
  //         { id: '2.1', label: 'Private Car Policy', fileType: 'file' },
  //         { id: '2.2', label: 'Two Wheeler Policy', fileType: 'file' },
  //         { id: '2.3', label: 'Commercial Vehicle Policy', fileType: 'file' },
  //       ],
  //     },
  //     {
  //       id: '3',
  //       label: 'Claims',
  //       fileType: 'folder',
  //       children: [
  //         { id: '3.1', label: 'New Claim', fileType: 'file' },
  //         { id: '3.2', label: 'Claim Status', fileType: 'file' },
  //         { id: '3.3', label: 'Claim History', fileType: 'file' },
  //       ],
  //     },
  //     {
  //       id: '4',
  //       label: 'Reports',
  //       fileType: 'folder',
  //       children: [
  //         { id: '4.1', label: 'Inspection Report', fileType: 'file' },
  //         { id: '4.2', label: 'Accident Report', fileType: 'file' },
  //       ],
  //     },
  //     {
  //       id: '/dashboard/matter-intake',
  //       label: 'Intake',
  //       type: 'link',
  //       iconType: 'intake',
  //       // children: [
  //       //   { id: '/dashboard/matter-intake', label: 'Intake', fileType: 'link' },
  //       //   // { id: '5.2', label: 'Intake Status', fileType: 'file' },
  //       //   // { id: '5.3', label: 'Intake History', fileType: 'file' },
  //       // ],
  //     },
  //   ],
  // },
  {
    id: '/dashboard/tasks',
    label: 'Tasks',
    type: 'link',
    iconType: 'tasks',
  },
  {
    id: '/dashboard/agenda',
    label: 'Agenda',
    type: 'link',
    iconType: 'agenda',
  },
  {
    id: '/dashboard/advanced-search',
    label: 'Advanced Search',
    type: 'link',
    iconType: 'data',
  },
  {
    id: '/dashboard/inbox',
    label: 'Inbox',
    type: 'link',
    iconType: 'inbox',
  },
  {
    id: '/dashboard/documentation',
    label: 'Documentation',
    type: 'link',
    iconType: 'documentation',
  },
  {
    id: '/dashboard/communication',
    label: 'Communication',
    type: 'link',
    iconType: 'communication',
  },
  {
    id: '/dashboard/contacts',
    label: 'Contacts',
    type: 'link',
    iconType: 'link',
  },

  // {
  //   id: '/dashboard/setup',
  //   label: 'Setup',
  //   type: 'tree',
  //   iconType: 'setup',
  //   treeData: [
  //     {
  //       id: '/dashboard/setup/users',
  //       label: 'Users',
  //       type: 'link',
  //       iconType: 'users',
  //     },
  //     {
  //       id: '/dashboard/setup/roles',
  //       label: 'Roles',
  //       type: 'link',
  //       iconType: 'roles',
  //     },
  //     {
  //       id: '/dashboard/setup/task-types',
  //       label: 'Task Type',
  //       type: 'link',
  //       iconType: 'tasks',
  //     },
  //     {
  //       id: '/dashboard/setup/task-status',
  //       label: 'Task Status',
  //       type: 'link',
  //       iconType: 'tasks',
  //     },
  //     {
  //       id: '/dashboard/setup/task-priority',
  //       label: 'Task Priority',
  //       type: 'link',
  //       iconType: 'tasks',
  //     },
  //     {
  //       id: '/dashboard/setup/task-utbms-code',
  //       label: 'Task UTBMS Code',
  //       type: 'link',
  //       iconType: 'tasks',
  //     },
  //     {
  //       id: '/dashboard/setup/event-category',
  //       label: 'Event Category',
  //       type: 'link',
  //       iconType: 'calendar',
  //     },
  //     {
  //       id: '/dashboard/setup/event-status',
  //       label: 'Event Status',
  //       type: 'link',
  //       iconType: 'activity',
  //     },
  //   ],
  // },
  // {
  //   id: '/dashboard/matter-intake',
  //   label: 'Intake',
  //   type: 'link',
  //   iconType: 'link',
  // children: [
  //   { id: '/dashboard/matter-intake', label: 'Intake', fileType: 'link' },
  //   // { id: '5.2', label: 'Intake Status', fileType: 'file' },
  //   // { id: '5.3', label: 'Intake History', fileType: 'file' },
  // ],
  // },
  // {
  //     id: 'crm',
  //     label: 'CRM',
  //     type: 'tree',
  //     iconType: 'tree',
  //     treeData: [
  //         { id: '/dashboard/crm/launchpad', label: 'Launchpad', fileType: 'file' },
  //         { id: '/dashboard/crm/inbox', label: 'Inbox', fileType: 'file' },
  //         { id: '/dashboard/crm/new-intake', label: 'New Intake', fileType: 'file' },
  //         { id: '/dashboard/crm/advanced-search', label: 'Advanced Search', fileType: 'file' },
  //         { id: '/dashboard/crm/new-inquiries', label: 'New Inquiries', fileType: 'file' },
  //         { id: '/dashboard/crm/text-messages', label: 'Text Messages', fileType: 'file' },
  //         { id: '/dashboard/crm/tasks', label: 'Tasks', fileType: 'file' },
  //         { id: '/dashboard/crm/calendar-events', label: 'Calendar Events', fileType: 'file' },
  //         { id: '/dashboard/crm/newsfeed', label: 'Newsfeed', fileType: 'file' },
  //         { id: '/dashboard/crm/contacts', label: 'Contacts', fileType: 'file' },
  //         { id: '/dashboard/crm/reports', label: 'Reports', fileType: 'file' },
  //         { id: '/dashboard/crm/documents', label: 'Documents', fileType: 'file' },
  //         { id: '/dashboard/crm/automations', label: 'Automations', fileType: 'file' },
  //         { id: '/dashboard/crm/email-marketing', label: 'Email Marketing', fileType: 'file' },
  //         { id: '/dashboard/crm/setup', label: 'Setup', fileType: 'file' },
  //     ],
  // },
  {
    id: '/dashboard/profile',
    label: 'My Profile',
    type: 'link',
    iconType: 'link',
  },
];
const adminSidebarItems = [
  {
    id: '/dashboard/setup',
    label: 'Setup',
    type: 'tree',
    iconType: 'setup',
    treeData: [
      {
        id: '/dashboard/setup/users',
        label: 'Users',
        type: 'link',
        iconType: 'users',
      },
      {
        id: '/dashboard/setup/roles',
        label: 'Roles',
        type: 'link',
        iconType: 'roles',
      },
      {
        id: '/dashboard/setup/task-types',
        label: 'Task Type',
        type: 'link',
        iconType: 'tasks',
      },
      {
        id: '/dashboard/setup/task-status',
        label: 'Task Status',
        type: 'link',
        iconType: 'tasks',
      },
      {
        id: '/dashboard/setup/graph',
        label: 'Graph',
        type: 'link',
        iconType: 'graph',
      },
      {
        id: '/dashboard/setup/task-priority',
        label: 'Task Priority',
        type: 'link',
        iconType: 'tasks',
      },
      {
        id: '/dashboard/setup/task-utbms-code',
        label: 'Task UTBMS Code',
        type: 'link',
        iconType: 'tasks',
      },
      {
        id: '/dashboard/setup/event-category',
        label: 'Event Category',
        type: 'link',
        iconType: 'calendar',
      },
      {
        id: '/dashboard/setup/event-status',
        label: 'Event Status',
        type: 'link',
        iconType: 'activity',
      },
      {
        id: '/dashboard/setup/firm',
        label: 'Firm',
        type: 'link',
        iconType: 'firm',
      },
    ],
  },
];

const inboxSidebarItems = [
  {
    id: '/dashboard/inbox/overview',
    label: 'Overview',
    type: 'link',
    iconType: 'overview',
  },
  {
    id: '/dashboard/inbox/form',
    label: 'Form',
    type: 'link',
    iconType: 'form',
  },
  {
    id: '/dashboard/inbox/key-dates',
    label: 'Key Dates',
    type: 'link',
    iconType: 'calendar',
  },
  {
    id: '/dashboard/inbox/notes',
    label: 'Notes',
    type: 'link',
    iconType: 'notes',
  },
  {
    id: '/dashboard/inbox/event',
    label: 'Event',
    type: 'link',
    iconType: 'event',
  },
  {
    id: '/dashboard/inbox/tasks',
    label: 'Tasks',
    type: 'link',
    iconType: 'link',
  },
  {
    id: '/dashboard/inbox/documentation',
    label: 'Documentation',
    type: 'link',
    iconType: 'documentation',
  },
  {
    id: '/dashboard/inbox/communication',
    label: 'Communication',
    type: 'link',
    iconType: 'communication',
  },
  {
    id: '/dashboard/inbox/finance',
    label: 'Finance',
    type: 'link',
    iconType: 'finance',
  },
  {
    id: '/dashboard/inbox/activity-logs',
    label: 'Activity Logs',
    type: 'link',
    iconType: 'activity-logs',
  },
];

function getIconForType(type) {
  return typeToIcon[type] || null;
}

const Sidebar = ({ isDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [openTree, setOpenTree] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);
  const [sidebarMode, setSidebarMode] = React.useState('default');

  React.useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();

      if (token && !user) {
        try {
          // Decode token
          const decodedToken = decodeToken(token);

          if (decodedToken && decodedToken.sub) {
            // Fetch user data by ID
            const userResponse = await getUserById(decodedToken.sub);

            if (userResponse && userResponse.data) {
              dispatch(setUser(userResponse.data));
            }
          }
        } catch (error) {}
      }
    };

    fetchUserData();
  }, [dispatch, user]);

  // check if user is admin
  const isAdmin = user?.role_id === 1;

  const getSidebarItems = () => {
    if (sidebarMode === 'inbox') {
      return inboxSidebarItems;
    }

    return isAdmin ? [...sidebarItems, ...adminSidebarItems] : sidebarItems;
  };
  const itemsToRender = getSidebarItems();

  // const itemsToRender =
  //   sidebarMode === 'inbox' ? inboxSidebarItems : sidebarItems;

  // const activeItems = location.pathname
  //   .split('/')
  //   .filter((item) => item !== '');
  const activeItem = itemsToRender
    .filter((item) => location.pathname.startsWith(item.id))
    .sort((a, b) => b.id.length - a.id.length)[0];

  const searchParams = new URLSearchParams(location.search);
  const slug = searchParams.get('slugId');

  React.useEffect(() => {
    if (slug) {
      setSidebarMode('inbox');
    } else {
      setSidebarMode('default');
    }
  }, [slug]);

  const handleItemClick = (item) => {
    if (item.type === 'tree') {
      setOpenTree((prev) => (prev === item.id ? null : item.id)); // toggle tree
    } else {
      // close any open tree when navigating
      setOpenTree(null);

      if (slug) {
        navigate(item.id + `?slugId=${slug}`);
      } else {
        navigate(item.id);
      }
    }
  };

  return (
    <aside
      className={`bg-white shadow h-full w-64 flex-shrink-0 flex  overflow-y-auto flex-col p-4 border-r border-gray-200 ${
        isDrawer ? '' : 'hidden md:flex'
      }`}
    >
      <div
        onClick={() => navigate('/dashboard')}
        className="flex p-4 mb-4 cursor-pointer hover:scale-102 transition"
      >
        <img src="/brand-logo.png" alt="Logo" className="h-10 w-10" />
        <span className="text-xl font-bold text-gray-800 ml-3 self-center">
          MVA
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {itemsToRender.map((item) => (
          <React.Fragment key={item.id}>
            <button
              className={`flex items-center w-full px-4 py-2 rounded transition font-medium ${
                openTree === item.id ||
                hovered === item.id ||
                activeItem?.id === item.id
                  ? 'text-white bg-blue-600'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {getIconForType(item.iconType) &&
                React.createElement(getIconForType(item.iconType), {
                  className: 'mr-3 h-5 w-5',
                })}
              {item.label}
            </button>
            {item.type === 'tree' && openTree === item.id && (
              <Box
                sx={{ minWidth: 180, pl: 2, height: 'auto', overflow: 'auto' }}
              >
                <CustomRickTreeView
                  onItemClick={(item) => handleItemClick(item)}
                  items={item.treeData || []}
                />
              </Box>
            )}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
