import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '@/api/api_services/dashboard';
import { useSearchParams } from 'react-router-dom';

export const useDashboard = () => {
  const [searchParams] = useSearchParams();
  const filerParams = Object.fromEntries(searchParams.entries());
  if (!filerParams.filter) {
    filerParams.filter = 'all';
  }
  const { data: dashboardSummary = [], isLoading: dashboardSummaryLoading } =
    useQuery({
      queryKey: ['dashboardSummary', filerParams],
      queryFn: () => getDashboardSummary(filerParams),
    });
  return { dashboardSummary, dashboardSummaryLoading };
};
