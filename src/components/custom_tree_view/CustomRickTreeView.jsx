import * as React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import {
    TreeItemCheckbox,
    TreeItemIconContainer,
    TreeItemLabel,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { TreeItemDragAndDropOverlay } from '@mui/x-tree-view/TreeItemDragAndDropOverlay';
import { useTreeItemModel } from '@mui/x-tree-view/hooks';
import { File, FolderArchive, FolderClosed } from 'lucide-react';

function DotIcon() {
    return (
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '70%',
                bgcolor: 'warning.main',
                display: 'inline-block',
                verticalAlign: 'middle',
                zIndex: 1,
                mx: 1,
            }}
        />
    );
}

const TreeItemRoot = styled('li')(({ theme }) => ({
    listStyle: 'none',
    margin: 0,
    padding: 0,
    outline: 0,
    color: theme.palette.grey[400],
    ...theme.applyStyles('light', {
        color: theme.palette.grey[800],
    }),
}));

const TreeItemContent = styled('div')(({ theme }) => ({
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: `calc(${theme.spacing(1)} + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth))`,
    width: '100%',
    boxSizing: 'border-box', // prevent width + padding to overflow
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    flexDirection: 'row-reverse',
    borderRadius: theme.spacing(0.7),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    fontWeight: 500,
    '&[data-expanded]:not([data-focused], [data-selected]) .labelIcon': {
        color: theme.palette.primary.dark,
        ...theme.applyStyles('light', {
            color: theme.palette.primary.main,
        }),
        '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: '16px',
            top: '44px',
            height: 'calc(100% - 48px)',
            width: '1.5px',
            backgroundColor: theme.palette.grey[700],
            ...theme.applyStyles('light', {
                backgroundColor: theme.palette.grey[300],
            }),
        },
    },
    [`&[data-focused], &[data-selected]`]: {
        // backgroundColor: "#a5b4fc",
        color: theme.palette.primary.contrastText,
        background: "linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)",
        ...theme.applyStyles('light', {
            // backgroundColor: "#a5b4fc",
            background: "linear-gradient(180deg, #4648AB 0%, rgba(70, 72, 171, 0.7) 100%)"
        }),
    },
    '&:not([data-focused], [data-selected]):hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: 'white',
        ...theme.applyStyles('light', {
            color: theme.palette.primary.main,
        }),
    },
}));

const CustomCollapse = styled(Collapse)({
    padding: 0,
});

const AnimatedCollapse = animated(CustomCollapse);

function TransitionComponent(props) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
        },
    });

    return <AnimatedCollapse style={style} {...props} />;
}

const TreeItemLabelText = styled(Typography)({
    color: 'inherit',
    fontFamily: 'Inter',
    fontWeight: 500,
});

function CustomLabel({ icon: Icon, expandable, children, ...other }) {
    return (
        <TreeItemLabel
            {...other}
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {Icon && (
                <Box
                    component={Icon}
                    className="labelIcon"
                    color="inherit"
                    sx={{ mr: 1, height: "1rem", width: "1rem" }}
                />
            )}

            <TreeItemLabelText variant="body2">{children}</TreeItemLabelText>
            {expandable && <DotIcon />}
        </TreeItemLabel>
    );
}

const getIconFromFileType = (fileType) => {
    switch (fileType) {
        case 'folder':
            return FolderArchive;
        case 'file':
            return File;
        default:
            return File;
    }
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
        getContextProviderProps,
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,
        getLabelProps,
        getGroupTransitionProps,
        getDragAndDropOverlayProps,
        status,
    } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

    const item = useTreeItemModel(itemId);

    let icon;
    if (status.expandable) {
        icon = FolderClosed;
    } else if (item.fileType) {
        icon = getIconFromFileType(item.fileType);
    }

    return (
        <TreeItemProvider {...getContextProviderProps()}>
            <TreeItemRoot {...getRootProps(other)}>
                <TreeItemContent {...getContentProps()}>
                    <TreeItemIconContainer {...getIconContainerProps()}>
                        <TreeItemIcon status={status} />
                    </TreeItemIconContainer>
                    <TreeItemCheckbox {...getCheckboxProps()} />
                    <CustomLabel
                        {...getLabelProps({
                            icon,
                            expandable: status.expandable && status.expanded,
                        })}
                    />
                    <TreeItemDragAndDropOverlay {...getDragAndDropOverlayProps()} />
                </TreeItemContent>
                {children && <TransitionComponent {...getGroupTransitionProps()} />}
            </TreeItemRoot>
        </TreeItemProvider>
    );
});

export default function CustomRickTreeView({ items }) {
    return (
        <RichTreeView
            items={items}
            defaultExpandedItems={[]}
            defaultSelectedItems=""
            sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            slots={{ item: CustomTreeItem }}
            itemChildrenIndentation={24}
        />
    );
};  