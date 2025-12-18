// src/components/DeadlineForm.jsx
import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  Box,
  Paper,
  Grid,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ru } from 'date-fns/locale';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: { xs: 16, sm: 24 },
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
  },
}));

function DeadlineForm({ technology, onSubmit, onCancel, showNotification }) {
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: null,
    dailyHours: 2,
    priority: 'medium',
    reminders: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'startDate':
        if (!value) {
          newErrors.startDate = 'Дата начала обязательна';
        } else if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          newErrors.startDate = 'Дата начала не может быть в прошлом';
        } else {
          delete newErrors.startDate;
        }
        break;
        
      case 'endDate':
        if (!value) {
          newErrors.endDate = 'Дата окончания обязательна';
        } else if (formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          newErrors.endDate = 'Дата окончания должна быть после даты начала';
        } else {
          delete newErrors.endDate;
        }
        break;
        
      case 'dailyHours':
        if (!value || value < 0.5 || value > 8) {
          newErrors.dailyHours = 'Часы должны быть от 0.5 до 8 в день';
        } else {
          delete newErrors.dailyHours;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    if (touched[name]) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    const isValid = Object.entries(formData).every(([key, value]) => {
      return validateField(key, value);
    });
    
    if (isValid && onSubmit) {
      const studyPlan = {
        ...formData,
        technologyId: technology.id,
        technologyName: technology.title,
        totalHours: calculateTotalHours(),
        createdAt: new Date().toISOString()
      };
      
      onSubmit(studyPlan);
    }
  };

  const calculateTotalHours = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return days * formData.dailyHours;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ru}>
      <StyledDialog
        open={true}
        onClose={onCancel}
        aria-labelledby="deadline-form-title"
        aria-describedby="deadline-form-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle 
          id="deadline-form-title"
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Typography variant="h6">Установить сроки изучения</Typography>
          <IconButton
            aria-label="close"
            onClick={onCancel}
            sx={{
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Настройте план изучения технологии <strong>{technology?.title}</strong>
            </Typography>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Даты */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Сроки изучения
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Дата начала *"
                    value={formData.startDate}
                    onChange={(newValue) => {
                      setFormData(prev => ({ ...prev, startDate: newValue }));
                      if (touched.startDate) {
                        validateField('startDate', newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        onBlur={handleBlur}
                        required
                      />
                    )}
                    minDate={new Date()}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Дата окончания *"
                    value={formData.endDate}
                    onChange={(newValue) => {
                      setFormData(prev => ({ ...prev, endDate: newValue }));
                      if (touched.endDate) {
                        validateField('endDate', newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        onBlur={handleBlur}
                        required
                      />
                    )}
                    minDate={formData.startDate || new Date()}
                  />
                </Grid>
                
                {/* Часы и приоритет */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Интенсивность изучения
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Часов в день *"
                    type="number"
                    name="dailyHours"
                    value={formData.dailyHours}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.dailyHours}
                    helperText={errors.dailyHours}
                    fullWidth
                    inputProps={{
                      min: 0.5,
                      max: 8,
                      step: 0.5,
                    }}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Приоритет</FormLabel>
                    <RadioGroup
                      row
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="low" control={<Radio />} label="Низкий" />
                      <FormControlLabel value="medium" control={<Radio />} label="Средний" />
                      <FormControlLabel value="high" control={<Radio />} label="Высокий" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                {/* Напоминания */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.reminders}
                        onChange={handleChange}
                        name="reminders"
                      />
                    }
                    label="Включить напоминания"
                  />
                </Grid>
                
                {/* Сводка */}
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="h6" gutterBottom>
                      Сводка плана
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Всего дней:
                        </Typography>
                        <Typography variant="body1">
                          {formData.startDate && formData.endDate 
                            ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))
                            : '—'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Всего часов:
                        </Typography>
                        <Typography variant="body1">
                          {calculateTotalHours().toFixed(1)} ч
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
          <Button onClick={onCancel} color="inherit">
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={Object.keys(errors).length > 0}
          >
            Сохранить план
          </Button>
        </DialogActions>
      </StyledDialog>
    </LocalizationProvider>
  );
}

export default DeadlineForm;