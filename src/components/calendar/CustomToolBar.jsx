import { ChevronDown } from 'lucide-react';
import { Select, MenuItem, Box, Typography } from '@mui/material';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
// import { handleNavigate } from '@/utils/handleNavigate';
import { useNavigate } from 'react-router-dom';
import { setQueryParam } from '@/utils/setQueryParam';
import { useSearchParams } from 'react-router-dom';
import { useMatter } from '@/components/inbox/MatterContext';

const CustomToolBar = ({
  onNavigate,
  onView,
  label,
  view,
  setOpen,
  users = [],
}) => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const slugId = searchParams.get('slugId');

useEffect(() => {
  if (slugId && users.length > 0) {
    setSelectedUser(users[0].id);
  }
}, [slugId, users]);


  return (
    <Box
      className="rbc-toolbar"
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      // p={2}
    >
      {/* Left Group */}
      <Box display="flex" gap={2} alignItems="center" className="w-fit">
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          className="flex flex-row w-fit items-center gap-2"
        >
          {/* <Plus className="w-4 h-4" /> */}
          <span>New Event</span>
        </Button>

        <Select
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setQueryParam(
              'userId',
              e.target.value,
              setSearchParams,
              searchParams
            );
          }}
          displayEmpty
          size="small"
          IconComponent={ChevronDown}
          sx={{ 
            minWidth: 200,
            opacity: slugId ? 0.7 : 1
          }}
        >
          <MenuItem value="" disabled>
           Select User
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Center Group */}
      <Box display="flex" gap={1} alignItems="center">
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            console.log('[Toolbar] Today button clicked');
            onNavigate('TODAY');
          }}
        >
          Today
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            console.log('[Toolbar] Prev button clicked');
            onNavigate('PREV');
          }}
        >
          Back
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            console.log('[Toolbar] Next button clicked');
            onNavigate('NEXT');
          }}
        >
          Next
        </Button>

        <Typography variant="subtitle1" sx={{ ml: 2 }}>
          {label}
        </Typography>
      </Box>

      {/* Right Group */}
      <Box display="flex" gap={1}>
        <Button
          size="small"
          variant={view === 'timeGridWeek' ? 'contained' : 'outlined'}
          onClick={() => onView('timeGridWeek')}
        >
          Week
        </Button>

        <Button
          size="small"
          variant={view === 'timeGridDay' ? 'contained' : 'outlined'}
          onClick={() => onView('timeGridDay')}
        >
          Day
        </Button>

        <Button
          size="small"
          variant={view === 'dayGridMonth' ? 'contained' : 'outlined'}
          onClick={() => onView('dayGridMonth')}
        >
          Month
        </Button>

        <Button
          size="small"
          variant={view === 'listWeek' ? 'contained' : 'outlined'}
          onClick={() => onView('listWeek')}
        >
          Agenda
        </Button>
      </Box>
    </Box>
  );
};

export default CustomToolBar;
