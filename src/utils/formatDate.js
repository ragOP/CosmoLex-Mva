import format from 'date-fns/format';

const formatDate = (date) => {
  return format(new Date(date), 'PPpp');
};

export default formatDate;
