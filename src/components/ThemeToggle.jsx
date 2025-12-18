// src/components/ThemeToggle.jsx
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { styled } from '@mui/material/styles';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.warning.main,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 193, 7, 0.1)' 
    : 'rgba(255, 152, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 193, 7, 0.2)' 
      : 'rgba(255, 152, 0, 0.2)',
    transform: 'rotate(15deg)',
  },
  transition: 'all 0.3s ease',
}));

function ThemeToggle({ mode, onToggle }) {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    onToggle();
    
    // Сбрасываем анимацию
    setTimeout(() => setAnimate(false), 300);
  };

  const tooltipTitle = mode === 'light' 
    ? 'Переключить на темную тему' 
    : 'Переключить на светлую тему';

  const icon = mode === 'light' 
    ? <DarkModeIcon fontSize="large" />
    : <LightModeIcon fontSize="large" />;

  return (
    <Tooltip title={tooltipTitle} arrow placement="left">
      <StyledIconButton
        onClick={handleClick}
        aria-label={tooltipTitle}
        sx={{
          animation: animate ? 'spin 0.3s ease-in-out' : 'none',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(180deg)' },
          },
        }}
        size="large"
      >
        {icon}
      </StyledIconButton>
    </Tooltip>
  );
}

export default ThemeToggle;