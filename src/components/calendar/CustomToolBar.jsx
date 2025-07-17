import { ChevronDown } from "lucide-react";
import { Button, Select, MenuItem, Box, Typography } from "@mui/material";
import { useEffect } from "react";
import moment from "moment";

const CustomToolBar = ({ 
  onNavigate, 
  onView, 
  label, 
  view, 
  setOpen, 
  users, 
  selectedUser, 
  setSelectedUser 
}) => {

  return (
    <Box
      className="rbc-toolbar"
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      p={2}
    >
      {/* Left Group */}
      <Box display="flex" gap={2} alignItems="center">
        <Button variant="contained" onClick={() => setOpen(true)}>
          New Event
        </Button>

        <Select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          displayEmpty
          size="small"
          IconComponent={ChevronDown}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="" disabled>Select User</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Center Group */}
      <Box display="flex" gap={1} alignItems="center">
        <Button size="small" variant="outlined" onClick={() => onNavigate("TODAY")}>Today</Button>
        <Button size="small" variant="outlined" onClick={() => onNavigate("PREV")}>Back</Button>
        <Button size="small" variant="outlined" onClick={() => onNavigate("NEXT")}>Next</Button>
        <Typography variant="subtitle1" sx={{ ml: 2 }}>{label}</Typography>
      </Box>

      {/* Right Group */}
      <Box display="flex" gap={1}>
        <Button
          size="small"
          variant={view === "work_week" ? "contained" : "outlined"}
          onClick={() => onView("work_week")}
        >
          Work Week
        </Button>
        <Button
          size="small"
          variant={view === "day" ? "contained" : "outlined"}
          onClick={() => onView("day")}
        >
          Day
        </Button>
        <Button
          size="small"
          variant={view === "week" ? "contained" : "outlined"}
          onClick={() => onView("week")}
        >
          Week
        </Button>
        <Button
          size="small"
          variant={view === "month" ? "contained" : "outlined"}
          onClick={() => onView("month")}
        >
          Month
        </Button>
      </Box>
    </Box>
  );
};

export default CustomToolBar;
