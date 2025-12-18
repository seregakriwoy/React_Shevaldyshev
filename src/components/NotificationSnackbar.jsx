// src/components/NotificationSnackbar.jsx
import { forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: theme.shadows[3],
  '& .MuiAlert-icon': {
    fontSize: '1.5rem',
    alignItems: 'center',
  },
  '& .MuiAlert-message': {
    padding: '8px 0',
    fontSize: '0.95rem',
  },
  '& .MuiAlert-action': {
    padding: '8px 0 8px 8px',
    alignItems: 'center',
  },
}));

const NotificationSnackbar = forwardRef(({ 
  open, 
  message, 
  type = 'info', 
  onClose, 
  autoHideDuration = 6000,
  position = { vertical: 'bottom', horizontal: 'center' }
}, ref) => {
  
  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon fontSize="inherit" />;
      case 'error':
        return <ErrorIcon fontSize="inherit" />;
      case 'warning':
        return <WarningIcon fontSize="inherit" />;
      case 'info':
        return <InfoIcon fontSize="inherit" />;
      default:
        return <InfoIcon fontSize="inherit" />;
    }
  };

  const getSeverity = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
      sx={{ ml: 1 }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      ref={ref}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={position}
      sx={{
        '& .MuiSnackbar-root': {
          maxWidth: { xs: '90%', sm: '400px', md: '500px' },
        },
      }}
    >
      <StyledAlert
        severity={getSeverity()}
        icon={getAlertIcon()}
        action={action}
        variant="filled"
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '400px', md: '500px' },
          '& .MuiAlert-action': {
            alignItems: 'flex-start',
          },
        }}
        aria-live="polite"
        aria-atomic="true"
        role="alert"
      >
        {message}
      </StyledAlert>
    </Snackbar>
  );
});

NotificationSnackbar.displayName = 'NotificationSnackbar';

export default NotificationSnackbar;