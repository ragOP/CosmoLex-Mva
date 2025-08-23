import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getMatter from '@/pages/matter/intake/helpers/getMatter';
import getMatterMeta from '@/pages/matter/intake/helpers/getMatterMeta';
import { MatterProvider } from './MatterContext';

const InboxPage = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(window.location.search);
  const slugId = searchParams.get('slugId');
  console.log('slugId >>>', slugId);

  const { data: matter } = useQuery({
    queryKey: ['matters', slugId],
    queryFn: () => getMatter({ slug: slugId }),
    enabled: !!slugId,
  });
  const { data: matterMeta } = useQuery({
    queryKey: ['matterMeta', slugId],
    queryFn: () => getMatterMeta({ slug: slugId }),
  });

  React.useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  return (
    <MatterProvider matter={matter} matterMeta={matterMeta} matterSlug={slugId}>
      <Outlet />
    </MatterProvider>
  );
};

export default InboxPage;
