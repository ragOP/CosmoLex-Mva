import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getRole } from '@/api/api_services/setup';

export const usePermission = () => {
  const { user } = useSelector((state) => state.auth);

  // Fetch role and permissions using role_id
  const { data: roleData } = useQuery({
    queryKey: ['role-permissions', user?.role_id],
    queryFn: () => getRole(user?.role_id),
    enabled: !!user?.role_id,
    select: (data) => data?.response?.data || null,
  });

  const userPermissions = roleData?.permissions || [];

  const hasPermission = (permissionName) => {
    if (!userPermissions) return false;
    return userPermissions.some(
      (permission) => permission.name === permissionName
    );
  };

  const hasAnyPermission = (permissionNames) => {
    if (!userPermissions) return false;
    return permissionNames.some((permissionName) =>
      userPermissions.some((permission) => permission.name === permissionName)
    );
  };
  const hasAllPermissions = (permissionNames) => {
    if (!userPermissions) return false;
    return permissionNames.every((permissionName) =>
      userPermissions.some((permission) => permission.name === permissionName)
    );
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions,
    isAdmin: user?.role_id === 1,
  };
};
