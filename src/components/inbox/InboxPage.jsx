import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getMatter from '@/pages/matter/intake/helpers/getMatter';
import { MatterProvider } from './MatterContext';

const InboxPage = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(window.location.search);
  const slugId = searchParams.get('slugId');

  const { data: matter } = useQuery({
    queryKey: ['matter', slugId],
    queryFn: () => getMatter({ slug: slugId }),
    enabled: !!slugId,
  });

  console.log("MATTER >>>>", matter);

  React.useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  return (
    <MatterProvider matter={matter}>
      <Outlet />
    </MatterProvider>
  );
};

export default InboxPage;
