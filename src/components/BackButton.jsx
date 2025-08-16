import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { ChevronLeft } from 'lucide-react';

const BackButton = ({ 
  to, 
  tooltip = "Back", 
  onClick, 
  className = "",
  size = "small" 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back in history
    }
  };

  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={handleClick}
        className={`bg-white hover:bg-gray-50 border border-gray-200 shadow-sm ${className}`}
        size={size}
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton; 