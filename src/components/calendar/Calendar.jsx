import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import '../../styles/calendar.css';
import CustomToolBar from './CustomToolBar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarWrapper = ({
  events,
  setEvents,
  handleShowEvent,
  setOpen,
  users,
  selectedUser,
  setSelectedUser,
}) => (
  <Calendar
    localizer={localizer}
    events={events}
    components={{
      toolbar: (toolbarProps) => (
        <CustomToolBar
          {...toolbarProps}
          setOpen={setOpen}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      ),
    }}
    toolbar={true}
    onSelectEvent={handleShowEvent}
    onSelectSlot={(slotInfo) => {
      const title = window.prompt('New Event name');
      if (title) {
        setEvents([
          ...events,
          {
            title,
            start: slotInfo.start,
            end: slotInfo.end,
          },
        ]);
      }
    }}
    views={['work_week', 'day', 'week', 'month']}
    startAccessor="start"
    endAccessor="end"
    style={{ height: '100%' }}
  />
);

export default CalendarWrapper;
