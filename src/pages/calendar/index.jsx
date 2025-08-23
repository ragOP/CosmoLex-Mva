import EventPreviewDialog from '@/components/calendar/EventPreviewDialog';
import { useState, useEffect } from 'react';
import CalendarWrapper from '@/components/calendar/Calendar';
import NewEventDialog from '@/components/calendar/NewEventDialog';
import createEvent from './helpers/createEvent';
import getEvent from './helpers/getEvent';
import { useMatter } from '@/components/inbox/MatterContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/components/calendar/hooks/useEvent';
import moment from 'moment';

const CalendarPage = () => {
  const navigate = useNavigate();

  // Dialog states
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  // Event states
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // use matter
  const { matter, matterSlug } = useMatter();

  // Use events
  const { events: allEvents, eventsLoading } = useEvents();

  useEffect(() => {
    if (!eventsLoading) {
      const mappedEvents = allEvents.map((event) => ({
        id: event.id,
        title: event.title,
        start: moment(event.start_time).toDate(),
        end: moment(event.end_time).toDate(),
        priority: event.priority,
      }));
      setEvents(mappedEvents);
    }
  }, [allEvents, eventsLoading]);

  const handleShowEvent = async (event) => {
    const res = await getEvent(event.id);
    setIsOpen(true);
    setEvent(res);
  };

  const handleNavigate = (taskId) => {
    if (matterSlug) {
      if (taskId) {
        navigate(
          `/dashboard/inbox/tasks?slugId=${matterSlug}&taskId=${taskId}`,
          {
            replace: false,
          }
        );
      } else {
        navigate(`/dashboard/inbox/tasks?slugId=${matterSlug}`, {
          replace: false,
        });
      }
    } else {
      if (taskId) {
        navigate(`/dashboard/tasks?taskId=${taskId}`, {
          replace: false,
        });
      } else {
        navigate(`/dashboard/tasks`, {
          replace: false,
        });
      }
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

  const handleDateRangeSelect = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  // const {
  // events,
  //   eventsLoading,
  //   createEvent,
  //   updateEvent,
  //   deleteEvent,
  //   deleteReminder,
  //   getEvent,
  //   getEvents,
  //   getEventsUserList,
  //   getUsersEvents,
  //   searchEvent,
  //   uploadEventFile,
  //   deleteEventFile,
  // } = useEvents();

  console.log('events >>>', events);

  return (
    <div className="h-full w-full">
      <CalendarWrapper
        events={events}
        setEvents={setEvents}
        handleShowEvent={handleShowEvent}
        NewEventDialog={NewEventDialog}
        open={open}
        setOpen={setOpen}
        onDateRangeSelect={handleDateRangeSelect}
      />

      <EventPreviewDialog
        event={event}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <NewEventDialog
        open={open}
        onClose={() => setOpen(false)}
        selectedDateRange={selectedDateRange}
      />
    </div>
  );
};

export default CalendarPage;
