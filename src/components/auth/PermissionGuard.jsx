import React from 'react';
import { usePermission } from '@/utils/usePermission';

const PermissionGuard = ({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermission();

  const hasAccess = () => {
    if (permission) {
      return hasPermission(permission);
    }
    if (permissions.length > 0) {
      return requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }
    return false;
  };
  
  return hasAccess() ? children : fallback;
};

export default PermissionGuard;