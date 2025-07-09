import { BookText, LayoutDashboardIcon, File, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CustomRickTreeView from '../custom_tree_view/CustomRickTreeView';

const typeToIcon = {
    file: File,
    folder: Folder,
    tree: BookText,
    link: LayoutDashboardIcon,
};

const sidebarItems = [
    {
        id: '/dashboard',
        label: 'Dashboard',
        type: 'link',
        iconType: 'link',
    },
    {
        id: '/dashboard/analytics',
        label: 'Analytics',
        type: 'link',
        iconType: 'link',
    },
    {
        id: 'matter',
        label: 'Matter',
        type: 'tree',
        iconType: 'tree',
        children: [
            {
                id: '/dashboard/matter/claim-form',
                label: 'Claim Form',
                type: 'folder',
                children: [
                    { id: '/dashboard/matter/claim-form/file1', label: 'File 1', type: 'file' },
                    { id: '/dashboard/matter/claim-form/file2', label: 'File 2', type: 'file' },
                ],
            },
            { id: '/dashboard/matter/policy-application', label: 'Policy Application', type: 'file' },
            { id: '/dashboard/matter/renewal-form', label: 'Renewal Form', type: 'file' },
            { id: '/dashboard/matter/accident-report', label: 'Accident Report', type: 'file' },
            { id: '/dashboard/matter/transfer-ownership', label: 'Transfer of Ownership', type: 'file' },
            { id: '/dashboard/matter/file', label: 'File', type: 'file' },
        ],
    },
    {
        id: '/dashboard/profile',
        label: 'My Profile',
        type: 'link',
        iconType: 'link',
    },
];

function getIconForType(type) {
    return typeToIcon[type] || null;
}

const Sidebar = ({ isDrawer }) => {
    const navigate = useNavigate();
    const [openTree, setOpenTree] = React.useState(null);
    const [hovered, setHovered] = React.useState(null);

    const handleItemClick = (item) => {
        if (item.type === 'tree') {
            setOpenTree(openTree === item.id ? null : item.id);
        } else {
            navigate(item.id);
            setOpenTree(null);
        }
    };

    return (
        <aside className={`bg-white shadow h-full w-64 flex-shrink-0 flex flex-col p-4 ${isDrawer ? '' : 'hidden md:flex'}`}>
            <div className="flex p-4">
                <img src="/brand-logo.png" alt="Logo" className="h-10 w-10" />
            </div>
            <div className="flex flex-col gap-2">
                {sidebarItems.map((item) => (
                    <React.Fragment key={item.id}>

                        <button
                            className={`flex items-center w-full px-4 py-2 rounded transition font-medium text-gray-700 ${openTree === item.id || hovered === item.id ? 'text-white' : ''}`}
                            style={(openTree === item.id || hovered === item.id) ? { background: 'linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)' } : {}}
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => setHovered(item.id)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {getIconForType(item.type) && React.createElement(getIconForType(item.type), { className: 'mr-3 h-5 w-5' })}
                            {item.label}
                        </button>
                        {item.type === 'tree' && openTree === item.id && (
                            <Box sx={{ minWidth: 180, pl: 2 }}>
                                <CustomRickTreeView />

                            </Box>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;




