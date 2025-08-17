// Reusbale meta field component for all apis

const getMetaOptions = ({ metaField, metaObj = {} }) => {
  const meta = metaObj[metaField];
  return meta || [];
};

export default getMetaOptions;
