export const handleNavigate = (type, key, id, matterSlug, navigate) => {
  console.log('type >>>', type);
  console.log('key >>>', key);
  console.log('id >>>', id);
  console.log('matterSlug >>>', matterSlug);
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
