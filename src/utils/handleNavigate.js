export const handleNavigate = (type, key, id, matterSlug, navigate) => {
  if (matterSlug) {
    if (id) {
      navigate(`/dashboard/inbox/${type}?slugId=${matterSlug}&${key}Id=${id}`, {
        replace: false,
      });
    } else {
      navigate(`/dashboard/inbox/${type}?slugId=${matterSlug}`, {
        replace: false,
      });
    }
  } else {
    if (id) {
      navigate(`/dashboard/${type}?${key}Id=${id}`, {
        replace: false,
      });
    } else {
      navigate(`/dashboard/${type}`, {
        replace: false,
      });
    }
  }
};
