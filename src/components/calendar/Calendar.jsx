import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import '../../styles/calendar.css';
import CustomToolBar from './CustomToolBar';
import { addDays } from 'date-fns';

const CalendarWrapper = ({
  slug = null,
  eventsMeta = {},
  events,
  setEvents,
  handleShowEvent,
  setOpen,
  onDateRangeSelect,
  handleEventDragStart,
  handleUpdateEventTime,
}) => {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = React.useState('dayGridMonth');

  const [label, setLabel] = React.useState('');

  // Convert events to FullCalendar format
  const fullCalendarEvents = events.map((event) => {
    // Get priority name from eventsMeta
    let priorityName = 'medium'; // default

    if (eventsMeta?.event_priority && event.priority_id) {
      const priorityObj = eventsMeta.event_priority.find(
        (p) => p.id === event.priority_id
      );
      priorityName = priorityObj?.name?.toLowerCase() || 'medium';
    } else if (event.priority) {
      // Fallback: use the priority field directly if it exists
      priorityName = event.priority.toLowerCase();
    }

    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      priority: priorityName,
      extendedProps: {
        priority: priorityName,
        priority_id: event.priority_id,
      },
    };
  });

  // Handle date range selection
  const handleDateSelect = (selectInfo) => {
    const { start, end } = selectInfo;

    const result = addDays(new Date(end), -1);

    // If onDateRangeSelect callback exists, use it
    if (onDateRangeSelect) {
      onDateRangeSelect({ start, end: result });
    }

    // Open the new event dialog
    setOpen(true);

    // Unselect the date range
    selectInfo.view.calendar.unselect();
  };

  // Handle event click
  const handleEventClick = (clickInfo) => {
    const event = events.find((e) => e.id === parseInt(clickInfo?.event?.id));
    if (event) {
      handleShowEvent(event);
    }
  };

  // Handle event drop (drag and drop events)
  const handleEventDropInternal = async (dropInfo) => {
    const { event } = dropInfo;

    try {
      // Format dates for API
      const timeData = {
        start_time: event.start.toISOString().slice(0, 19).replace('T', ' '),
        end_time: event.end
          ? event.end.toISOString().slice(0, 19).replace('T', ' ')
          : event.start.toISOString().slice(0, 19).replace('T', ' '),
      };

      // Call the API to update event time
      if (handleUpdateEventTime) {
        await handleUpdateEventTime({ eventId: parseInt(event.id), timeData });
      }

      // Update local state
      const updatedEvent = {
        ...event,
        start: event.start,
        end: event.end,
      };

      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.id === parseInt(event.id) ? updatedEvent : e))
      );
    } catch (error) {
      console.error('Failed to update event time:', error);
      // Revert the event position on error
      dropInfo.revert();
    }
  };

  // Handle event resize
  const handleEventResize = async (resizeInfo) => {
    const { event } = resizeInfo;

    try {
      // Format dates for API
      const timeData = {
        start_time: event.start.toISOString().slice(0, 19).replace('T', ' '),
        end_time: event.end
          ? event.end.toISOString().slice(0, 19).replace('T', ' ')
          : event.start.toISOString().slice(0, 19).replace('T', ' '),
      };

      // Call the API to update event time
      if (handleUpdateEventTime) {
        await handleUpdateEventTime({ eventId: parseInt(event.id), timeData });
      }

      // Update local state
      const updatedEvent = {
        ...event,
        start: event.start,
        end: event.end,
      };

      setEvents((prevEvents) =>
        prevEvents.map((e) => (e.id === parseInt(event.id) ? updatedEvent : e))
      );
    } catch (error) {
      console.error('Failed to resize event:', error);
      // Revert the event size on error
      resizeInfo.revert();
    }
  };

  const handleDatesSet = (arg) => {
    console.log('[handleDatesSet] new title:', arg.view.title);
    setLabel(arg.view.title);
    setCurrentView(arg.view.type); // 🔑 update state when FC changes view
  };
  const handleNavigate = (action) => {
    console.log('[handleNavigate] called with:', action);

    const calendarApi = calendarRef.current?.getApi();
    console.log('[handleNavigate] calendarApi:', calendarApi);

    if (!calendarApi) return;

    if (action === 'TODAY') {
      console.log('[handleNavigate] going to TODAY');
      calendarApi.today();
    } else if (action === 'NEXT') {
      console.log('[handleNavigate] going to NEXT');
      calendarApi.next();
    } else if (action === 'PREV') {
      console.log('[handleNavigate] going to PREV');
      calendarApi.prev();
    }

    console.log('[handleNavigate] new date range:', calendarApi.view?.title);
  };

  const handleViewChange = (view) => {
    console.log('[handleViewChange] called with:', view);
    const calendarApi = calendarRef.current?.getApi();
    console.log('[handleViewChange] calendarApi:', calendarApi);

    if (calendarApi) {
      console.log('[handleViewChange] attempting to change view to:', view);
      calendarApi.changeView(view);
      console.log(
        '[handleViewChange] active view after change:',
        calendarApi.view.type
      );

      // 🔑 keep React state in sync with FullCalendar
      setCurrentView(calendarApi.view.type);
    }
  };

  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-gradient-to-br from-white/90 via-white/80 to-blue-50/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-blue-400/10 rounded-full blur-2xl"></div>

        {/* Custom Toolbar */}
        <div className="relative px-6 pt-4 pb-2 border-b border-white/20 bg-gradient-to-r from-white/40 to-transparent backdrop-blur-sm">
          <CustomToolBar
            slug={slug}
            users={eventsMeta?.calendar_list || []}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            label={label}
            view={currentView}
            setOpen={setOpen}
          />
        </div>

        {/* FullCalendar */}
        <div className="relative h-[calc(100%-88px)] px-6 pb-6 overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={false} // We're using custom toolbar
            initialView="dayGridMonth"
            views={{
              dayGridMonth: { titleFormat: { month: 'long', year: 'numeric' } },
              timeGridWeek: {
                titleFormat: {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                },
              },
              timeGridDay: {
                titleFormat: { month: 'long', day: 'numeric', year: 'numeric' },
              },
              listWeek: { titleFormat: { month: 'long', year: 'numeric' } },
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            w
            weekends={true}
            events={fullCalendarEvents}
            eventDragStart={handleEventDragStart}
            eventDrop={handleEventDropInternal}
            datesSet={handleDatesSet}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventResize={handleEventResize}
            height="100%"
            selectConstraint={{
              start: '00:00',
              end: '24:00',
            }}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            allDaySlot={true}
            slotDuration="00:30:00"
            slotLabelInterval="01:00"
            expandRows={true}
            nowIndicator={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '09:00',
              endTime: '17:00',
            }}
            eventDisplay="block"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short',
            }}
            dayHeaderFormat={{
              weekday: 'short',
            }}
            // Custom styling
            eventClassNames={(arg) => {
              const classes = ['custom-event'];
              const priority = arg.event.extendedProps.priority;

              if (priority === 'critical' || priority === 'urgent') {
                classes.push('critical-priority');
              } else if (priority === 'high') {
                classes.push('high-priority');
              } else if (
                priority === 'medium' ||
                priority === 'normal' ||
                priority === 'standard'
              ) {
                classes.push('medium-priority');
              } else if (priority === 'low' || priority === 'lowest') {
                classes.push('low-priority');
              } else {
                // Default to medium priority if priority is not recognized
                classes.push('medium-priority');
              }
              return classes;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarWrapper;
