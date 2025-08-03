import {
  BookText,
  LayoutDashboardIcon,
  File,
  Folder,
  TextSearch,
  Calendar,
} from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CustomRickTreeView from '../custom_tree_view/CustomRickTreeView';

const typeToIcon = {
  file: File,
  folder: Folder,
  tree: BookText,
  link: LayoutDashboardIcon,
  data: TextSearch,
  calendar: Calendar,
};

const sidebarItems = [
  {
    id: '/dashboard',
    label: 'Dashboard',
    type: 'link',
    iconType: 'link',
  },
  {
    id: '/dashboard/calendar/1',
    label: ' Event Calendar',
    type: 'link',
    iconType: 'calendar',
  },
  // {
  //     id: '/dashboard/analytics',
  //     label: 'Analytics',
  //     type: 'link',
  //     iconType: 'link',
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
  //       iconType: 'link',
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
    iconType: 'link',
  },
  {
    id: '/dashboard/inbox',
    label: 'Inbox',
    type: 'link',
    iconType: 'link',
  },

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
  //   id: '/dashboard/contacts',
  //   label: 'Contacts',
  //   type: 'link',
  //   iconType: 'link',
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
  // {
  //     id: '/dashboard/profile',
  //     label: 'My Profile',
  //     type: 'link',
  //     iconType: 'link',
  // },
];

const inboxSidebarItems = [
  {
    id: '/dashboard/inbox/overview',
    label: 'Overview',
    type: 'link',
    iconType: 'link',
  },
  {
    id: '/dashboard/inbox/form',
    label: 'Form',
    type: 'link',
    iconType: 'link',
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
    iconType: 'link',
  },
  {
    id: '/dashboard/inbox/event',
    label: 'Event',
    type: 'link',
    iconType: 'calendar',
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
    iconType: 'file',
  },
  {
    id: '/dashboard/inbox/communication',
    label: 'Communication',
    type: 'link',
    iconType: 'link',
  },
  {
    id: '/dashboard/inbox/finance',
    label: 'Finance',
    type: 'link',
    iconType: 'link',
  },
  {
    id: '/dashboard/inbox/activity-logs',
    label: 'Activity Logs',
    type: 'link',
    iconType: 'link',
  },
];

function getIconForType(type) {
  return typeToIcon[type] || null;
}

const Sidebar = ({ isDrawer }) => {
  const navigate = useNavigate();
  const [openTree, setOpenTree] = React.useState({});
  const [hovered, setHovered] = React.useState(null);
  const [sidebarMode, setSidebarMode] = React.useState('default');

  const handleItemClick = (item) => {
    if (item.label === 'Inbox') {
      setSidebarMode('inbox');
    } else {
      setSidebarMode('default');
    }

    if (item.type === 'tree') {
      setOpenTree((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
    } else {
      navigate(item.id);
    }
  };

  const itemsToRender =
    sidebarMode === 'inbox' ? inboxSidebarItems : sidebarItems;

  return (
    <aside
      className={`bg-white shadow h-full w-64 flex-shrink-0 flex flex-col p-4 ${
        isDrawer ? '' : 'hidden md:flex'
      }`}
    >
      <div className="flex p-4">
        <img src="/brand-logo.png" alt="Logo" className="h-10 w-10" />
      </div>
      <div className="flex flex-col gap-2">
        {itemsToRender.map((item) => (
          <React.Fragment key={item.id}>
            <button
              className={`flex items-center w-full px-4 py-2 rounded transition font-medium text-gray-700 ${
                openTree === item.id || hovered === item.id ? 'text-white' : ''
              }`}
              style={
                openTree === item.id || hovered === item.id
                  ? {
                      background:
                        'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)',
                    }
                  : {}
              }
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {getIconForType(item.type) &&
                React.createElement(getIconForType(item.type), {
                  className: 'mr-3 h-5 w-5',
                })}
              {item.label}
            </button>
            {item.type === 'tree' && openTree[item.id] && (
              <Box sx={{ minWidth: 180, pl: 2 }}>
                <CustomRickTreeView items={item.treeData || []} />
              </Box>
            )}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
