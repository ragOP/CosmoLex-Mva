import { useState, useEffect } from 'react';
import CalendarWrapper from '@/components/calendar/Calendar';
import NewEventDialog from '@/components/calendar/NewEventDialog';
import { useMatter } from '@/components/inbox/MatterContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEvents } from '@/components/calendar/hooks/useEvent';
import moment from 'moment';
import isArrayWithValues from '@/utils/isArrayWithValues';
import DeleteEventDialog from '@/components/calendar/components/deleteEventDialog';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Dialog states
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Event states
  const [event, setEvent] = useState(null);
  // const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
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
    eventsMeta,
    events,
    event: singleEvent,
    eventLoading,
    eventsLoading,
    handleDeleteEvent,
    isDeleting,
  } = useEvents();

  useEffect(() => {
    if (!eventsLoading && isArrayWithValues(events)) {
      const mappedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        start: moment(event.start_time).toDate(),
        end: moment(event.end_time).toDate(),
        priority: event.priority,
      }));
      setAllEvents(mappedEvents);
    }

    if (!eventLoading && singleEvent) {
      setEvent(singleEvent);
      setOpen(true);
    }
  }, [events, eventsLoading, singleEvent, eventLoading]);

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
        slug={matterSlug}
        eventsMeta={eventsMeta}
        events={allEvents}
        setEvents={setAllEvents}
        handleShowEvent={handleShowEvent}
        NewEventDialog={NewEventDialog}
        open={open}
        setOpen={setOpen}
        onDateRangeSelect={handleDateRangeSelect}
      />

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
        onDelete={() => setShowDeleteConfirm(true)}
        showDeleteConfirm={showDeleteConfirm}
      />

      <DeleteEventDialog
        event={event ? event : null}
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          handleDeleteEvent(event.id);
          setShowDeleteConfirm(false);
          setOpen(false);
          handleNavigate(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CalendarPage;
