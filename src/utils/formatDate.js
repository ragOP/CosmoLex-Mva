import format from 'date-fns/format';

const formatDate = (date) => {
  return format(new Date(date), 'PP');
};

export default formatDate;
