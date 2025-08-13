import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import '../../styles/calendar.css';
import CustomToolBar from './CustomToolBar';

const CalendarWrapper = ({
  events,
  setEvents,
  handleShowEvent,
  setOpen,
  users,
  selectedUser,
  setSelectedUser,
  onDateRangeSelect,
}) => {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = React.useState('dayGridMonth');

  // Convert events to FullCalendar format
  const fullCalendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    priority: event.priority,
    extendedProps: {
      priority: event.priority,
    }
  }));

  // Handle date range selection
  const handleDateSelect = (selectInfo) => {
    const { start, end } = selectInfo;
    
    // If onDateRangeSelect callback exists, use it
    if (onDateRangeSelect) {
      onDateRangeSelect({ start, end });
    }
    
    // Open the new event dialog
    setOpen(true);
    
    // Unselect the date range
    selectInfo.view.calendar.unselect();
  };

  // Handle event click
  const handleEventClick = (clickInfo) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      handleShowEvent(event);
    }
  };

  // Handle event drop (drag and drop events)
  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;
    const updatedEvent = {
      ...event,
      start: event.start,
      end: event.end,
    };
    
    // Update the event in the events array
    setEvents(prevEvents => 
      prevEvents.map(e => e.id === event.id ? updatedEvent : e)
    );
  };

  // Handle event resize
  const handleEventResize = (resizeInfo) => {
    const { event } = resizeInfo;
    const updatedEvent = {
      ...event,
      start: event.start,
      end: event.end,
    };
    
    // Update the event in the events array
    setEvents(prevEvents => 
      prevEvents.map(e => e.id === event.id ? updatedEvent : e)
    );
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
            setOpen={setOpen}
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            calendarRef={calendarRef}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </div>
        
        {/* FullCalendar */}
        <div className="relative h-[calc(100%-88px)] px-6 pb-6 overflow-hidden">
          <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={false} // We're using custom toolbar
          initialView="dayGridMonth"
          views={{
            dayGridMonth: { titleFormat: { month: 'long', year: 'numeric' } },
            timeGridWeek: { titleFormat: { month: 'short', day: 'numeric', year: 'numeric' } },
            timeGridDay: { titleFormat: { month: 'long', day: 'numeric', year: 'numeric' } },
            listWeek: { titleFormat: { month: 'long', year: 'numeric' } },
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={fullCalendarEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
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
            meridiem: 'short'
          }}
          dayHeaderFormat={{
            weekday: 'short'
          }}
          // Custom styling
          eventClassNames={(arg) => {
            const classes = ['custom-event'];
            if (arg.event.extendedProps.priority === 'high') {
              classes.push('high-priority');
            } else if (arg.event.extendedProps.priority === 'medium') {
              classes.push('medium-priority');
            } else if (arg.event.extendedProps.priority === 'low') {
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
