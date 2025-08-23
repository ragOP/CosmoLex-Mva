import EventPreviewDialog from '@/components/calendar/EventPreviewDialog';
import { useState, useEffect } from 'react';
import CalendarWrapper from '@/components/calendar/Calendar';
import NewEventDialog from '@/components/calendar/NewEventDialog';
import createEvent from './helpers/createEvent';
import getEvent from './helpers/getEvent';
import { useMatter } from '@/components/inbox/MatterContext';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEvents } from '@/components/calendar/hooks/useEvent';
import moment from 'moment';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dialog states
  const [open, setOpen] = useState(false);

  // Event states
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  // use matter
  // Get matter slug from URL params (assuming notes are matter-specific)
  const matterSlug = searchParams.get('slugId');

  let matter = null;
  if (matterSlug) {
    matter = useMatter();
  }

  // Use events
  const {
    events: allEvents,
    event: singleEvent,
    eventLoading,
    eventsLoading,
  } = useEvents();

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

    if (!eventLoading && singleEvent) {
      setEvent(singleEvent);
      setOpen(true);
    }
  }, [allEvents, eventsLoading, singleEvent, eventLoading]);

  const handleShowEvent = async (event) => {
    handleNavigate(event.id);
  };

  const handleNavigate = (eventId) => {
    if (matterSlug) {
      if (eventId) {
        navigate(
          `/dashboard/inbox/event?slugId=${matterSlug}&eventId=${eventId}`,
          {
            replace: false,
          }
        );
      } else {
        navigate(`/dashboard/inbox/event?slugId=${matterSlug}`, {
          replace: false,
        });
      }
    } else {
      if (eventId) {
        navigate(`/dashboard/event?eventId=${eventId}`, {
          replace: false,
        });
      } else {
        navigate(`/dashboard/event`, {
          replace: false,
        });
      }
    }
  };

  const handleDateRangeSelect = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

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

      {/* <EventPreviewDialog
        event={event}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      /> */}

      <NewEventDialog
        open={open}
        onClose={
          event
            ? () => {
                setOpen(false);
                setEvent(null);
                handleNavigate(null);
              }
            : () => setOpen(false)
        }
        selectedDateRange={selectedDateRange}
        event={event ? event : null}
        mode={event ? 'update' : 'create'}
      />
    </div>
  );
};

export default CalendarPage;
