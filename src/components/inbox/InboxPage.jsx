import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import getMatter from '@/pages/matter/intake/helpers/getMatter';

const InboxPage = () => {
  const location = useLocation();
  const { slug } = useParams();

  const { data: matter } = useQuery({
    queryKey: ['matter', slug],
    queryFn: () => getMatter({ slug }),
    enabled: !!slug,
  });

  React.useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  return (
    <main className="flex-1 overflow-auto no-scrollbar">
      <Outlet matter={matter} />
    </main>
  );
};

export default InboxPage;
