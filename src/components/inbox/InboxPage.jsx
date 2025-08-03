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
    // <div className="flex h-screen bg-[#F5F5FA] overflow-auto no-scrollbar">
    //   {/* <Sidebar /> */}
    //   <div className="flex-1 flex flex-col">
    //     <Navbar />
    <main className="flex-1 overflow-auto no-scrollbar">
      <Outlet matter={matter} />
    </main>
    //   </div>
    // </div>
  );
};

export default InboxPage;
