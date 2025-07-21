import EventPreviewDialog from '@/components/calendar/EventPreviewDialog';
import { useState, useEffect } from 'react';
import CalendarWrapper from '@/components/calendar/Calendar';
import NewEventDialog from '@/components/calendar/NewEventDialog';
import getEventsUserList from './helpers/getEventsUserList';
import getUserEvents from './helpers/getUserEvents';
import createEvent from './helpers/createEvent';
import getEvent from './helpers/getEvent';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';

const CalendarPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const handleShowEvent = async (event) => {
    const res = await getEvent(event.id);
    setIsOpen(true);
    setEvent(res);
  };

  const getUsersEvents = async (userId) => {
    try {
      const events = await getUserEvents(userId);
      const mappedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        start: moment(event.start_time).toDate(),
        end: moment(event.end_time).toDate(),
        priority: event.priority,
      }));
      setEvents(mappedEvents);
    } catch (err) {
      console.error('Error fetching user events:', err);
    }
  };

  const handleCreateEvent = async (data) => {
    try {
      const res = await createEvent(data);
      console.log(res);
    } catch (err) {
      console.error(err?.message || 'Failed to create event');
    }
  };

  useEffect(() => {
    setSelectedUser(params.id || 1);
    getEventsUserList().then((usersData) => {
      setUsers(usersData);
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    navigate(`/dashboard/calendar/${selectedUser}`);
    getUsersEvents(selectedUser);
  }, [selectedUser]);

  return (
    <div className="h-full w-full">
      <CalendarWrapper
        events={events}
        setEvents={setEvents}
        handleShowEvent={handleShowEvent}
        NewEventDialog={NewEventDialog}
        open={open}
        setOpen={setOpen}
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <EventPreviewDialog
        event={event}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <NewEventDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          console.log(data);
          handleCreateEvent(data);
          setOpen(false);
        }}
      />
    </div>
  );
};

export default CalendarPage;
