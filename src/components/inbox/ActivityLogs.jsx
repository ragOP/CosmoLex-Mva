import React from 'react';
import BreadCrumb from '@/components/BreadCrumb';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/api/api_services';
import { toast } from 'sonner';

const fetchActivityLogs = async (slugId) => {
  if (!slugId) return [];
  try {
    const result = await apiService({
      endpoint: `v2/matter/activity-logs/${slugId}`,
      method: 'GET',
    });

    const response = result?.response;
    if (response?.status === true && Array.isArray(response?.data)) {
      return response.data;
    }

    const message = response?.message || 'Failed to fetch activity logs';
    toast.error(message);
    return [];
  } catch (error) {
    toast.error('Failed to fetch activity logs');
    return [];
  }
};

const ActivityLogs = () => {
  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['activityLogs', slugId],
    queryFn: () => fetchActivityLogs(slugId),
  });

  return (
    <div className="p-4">
      <BreadCrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Inbox', href: '/dashboard/inbox/overview' },
          { label: 'Activity Logs' },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-xl font-semibold">Activity Logs</h1>
        {isLoading ? (
          <div className="mt-4">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="mt-4 text-gray-500">No activity found.</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Completed On
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    User
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log, idx) => (
                  <tr key={log.id || idx}>
                    <td className="px-4 py-2 text-sm">{log.completed_on}</td>
                    <td className="px-4 py-2 text-sm">{log.user_name}</td>
                    <td className="px-4 py-2 text-sm">
                      {log.activity_description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
