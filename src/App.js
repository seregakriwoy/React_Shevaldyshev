// src/App.jsx
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import useTechnologiesApi from './hooks/useTechnologiesApi';
import RoadmapImporter from './components/RoadmapImporter';
import TechnologyList from './components/TechnologyList';
import TechnologySearch from './components/TechnologySearch';
import ResourceLoader from './components/ResourceLoader';
import DeadlineForm from './components/DeadlineForm';
import BulkStatusEditor from './components/BulkStatusEditor';
import DataManager from './components/DataManager';
import ProgressBar from './components/ProgressBar';
import QuickActions from './components/QuickActions';
import NotificationSnackbar from './components/NotificationSnackbar';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

// Создаем тему Material-UI
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode
          primary: {
            main: '#667eea',
            light: '#a3b3ff',
            dark: '#4c5cb8',
          },
          secondary: {
            main: '#764ba2',
            light: '#a67bd5',
            dark: '#4a2b6e',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#333333',
            secondary: '#666666',
          },
          error: {
            main: '#f44336',
            light: '#ff7961',
            dark: '#ba000d',
          },
          success: {
            main: '#4caf50',
            light: '#80e27e',
            dark: '#087f23',
          },
          warning: {
            main: '#ff9800',
            light: '#ffc947',
            dark: '#c66900',
          },
          info: {
            main: '#2196f3',
            light: '#6ec6ff',
            dark: '#0069c0',
          },
        }
      : {
          // Dark mode
          primary: {
            main: '#a3b3ff',
            light: '#d5e3ff',
            dark: '#7384d8',
          },
          secondary: {
            main: '#a67bd5',
            light: '#d8a9ff',
            dark: '#754fa3',
          },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
          },
          error: {
            main: '#f44336',
            light: '#ff7961',
            dark: '#ba000d',
          },
          success: {
            main: '#4caf50',
            light: '#80e27e',
            dark: '#087f23',
          },
          warning: {
            main: '#ff9800',
            light: '#ffc947',
            dark: '#c66900',
          },
          info: {
            main: '#2196f3',
            light: '#6ec6ff',
            dark: '#0069c0',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.8rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Стилизованные компоненты
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
}));

const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
  },
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

function App() {
  const [mode, setMode] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });
  
  const { technologies, loading, error, refetch, addTechnology } = useTechnologiesApi();
  const [selectedTech, setSelectedTech] = useState(null);
  const [showDeadlineForm, setShowDeadlineForm] = useState(false);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'info',
  });

  // Создаем тему на основе выбранного режима
  const theme = createTheme(getDesignTokens(mode));

  // Сохраняем тему в localStorage
  useEffect(() => {
    localStorage.setItem('appTheme', mode);
    // Применяем тему к body для кастомных стилей
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  // Показываем уведомления
  const showNotification = (message, type = 'info') => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Расчет прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(t => t.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    return tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tech.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Обработчики для DeadlineForm
  const handleSaveDeadline = (studyPlan) => {
    const existingPlans = JSON.parse(localStorage.getItem('studyPlans') || '{}');
    existingPlans[studyPlan.technologyId] = studyPlan;
    localStorage.setItem('studyPlans', JSON.stringify(existingPlans));
    
    setShowDeadlineForm(false);
    showNotification(`План изучения "${studyPlan.technologyName}" сохранен!`, 'success');
  };

  // Обработчики для BulkStatusEditor
  const handleBulkSave = (selectedIds, newStatus) => {
    const updatedTechs = technologies.map(tech => 
      selectedIds.includes(tech.id) ? { ...tech, status: newStatus } : tech
    );
    
    localStorage.setItem('technologies', JSON.stringify(updatedTechs));
    refetch();
    setShowBulkEditor(false);
    showNotification(`Статус обновлен для ${selectedIds.length} технологий`, 'success');
  };

  // Обработчики для DataManager
  const handleDataImport = async (importedTechnologies) => {
    try {
      for (const tech of importedTechnologies) {
        await addTechnology(tech);
      }
      refetch();
      showNotification(`Импортировано ${importedTechnologies.length} технологий`, 'success');
      return Promise.resolve();
    } catch (error) {
      showNotification(`Ошибка импорта: ${error.message}`, 'error');
      throw error;
    }
  };

  const handleDataExport = (exportData) => {
    showNotification(`Экспортировано ${exportData.technologies.length} технологий`, 'success');
  };

  // Обработчики для QuickActions
  const handleMarkAllCompleted = () => {
    const updatedTechs = technologies.map(tech => ({ ...tech, status: 'completed' }));
    localStorage.setItem('technologies', JSON.stringify(updatedTechs));
    refetch();
    showNotification('Все технологии отмечены как завершенные', 'success');
  };

  const handleResetAllStatuses = () => {
    const updatedTechs = technologies.map(tech => ({ ...tech, status: 'not-started' }));
    localStorage.setItem('technologies', JSON.stringify(updatedTechs));
    refetch();
    showNotification('Статусы всех технологий сброшены', 'warning');
  };

  const handleExportData = () => {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      technologies: technologies,
      metadata: {
        totalTechnologies: technologies.length,
        completed: technologies.filter(t => t.status === 'completed').length,
        inProgress: technologies.filter(t => t.status === 'in-progress').length,
        notStarted: technologies.filter(t => t.status === 'not-started').length
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `technologies-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
    showNotification('Данные успешно экспортированы', 'success');
  };

  // Переключение темы
  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    showNotification(`Тема изменена на ${mode === 'light' ? 'тёмную' : 'светлую'}`, 'info');
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              border: `5px solid ${theme.palette.primary.light}`,
              borderTop: `5px solid ${theme.palette.primary.main}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              mb: 3,
            }}
          />
          <Typography variant="h6" color="text.primary">
            Загрузка технологий...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Используется GitHub API для получения данных
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledContainer maxWidth="xl">
        {/* Хедер */}
        <HeaderPaper elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h1" sx={{ color: 'white' }}>
              Трекер изучения технологий
            </Typography>
            <ThemeToggle mode={mode} onToggle={toggleTheme} />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ProgressBar
              progress={calculateProgress()}
              label="Общий прогресс"
              color={theme.palette.success.main}
              animated={true}
              height={20}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {error && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.error.light,
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    padding: '8px 12px',
                    borderRadius: 1,
                  }}
                >
                  ⚠️ Используются локальные данные
                </Typography>
              )}
            </Box>
          </Box>
        </HeaderPaper>

        {/* Основной контент */}
        <Grid container spacing={3}>
          {/* Поиск и импорт */}
          <Grid item xs={12} md={8}>
            <ContentPaper elevation={2}>
              <TechnologySearch 
                onSearchChange={setSearchQuery}
                technologies={technologies}
              />
            </ContentPaper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <ContentPaper elevation={2}>
              <RoadmapImporter 
                onImportSuccess={() => showNotification('Дорожная карта успешно импортирована', 'success')}
                onImportError={(msg) => showNotification(`Ошибка импорта: ${msg}`, 'error')}
              />
            </ContentPaper>
          </Grid>

          {/* Быстрые действия */}
          <Grid item xs={12}>
            <ContentPaper elevation={2}>
              <QuickActions 
                onMarkAllCompleted={handleMarkAllCompleted}
                onResetAll={handleResetAllStatuses}
                onExportData={handleExportData}
                technologies={technologies}
                showNotification={showNotification}
              />
            </ContentPaper>
          </Grid>

          {/* Инструменты управления */}
          <Grid item xs={12}>
            <ContentPaper elevation={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h3">Управление данными</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <button
                    onClick={() => setShowBulkEditor(true)}
                    className="bulk-edit-btn"
                    style={{
                      background: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
                      color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
                      border: `2px solid ${theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light}`,
                    }}
                  >
                    ⚙️ Массовое редактирование
                  </button>
                  
                  {selectedTech && (
                    <button
                      onClick={() => setShowDeadlineForm(true)}
                      className="deadline-btn"
                      style={{
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                        color: 'white',
                      }}
                    >
                      ⏰ Установить сроки
                    </button>
                  )}
                </Box>
              </Box>
              
              <DataManager 
                technologies={technologies}
                onImport={handleDataImport}
                onExport={handleDataExport}
              />
            </ContentPaper>
          </Grid>

          {/* Список технологий */}
          <Grid item xs={12} md={6}>
            <ContentPaper elevation={2} sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h3">
                  Технологии ({technologies.length})
                </Typography>
                {searchQuery && (
                  <Typography variant="body2" color="text.secondary">
                    Найдено: {filteredTechnologies.length}
                  </Typography>
                )}
              </Box>
              
              {filteredTechnologies.length > 0 ? (
                <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <TechnologyList 
                    technologies={filteredTechnologies}
                    onSelectTech={setSelectedTech}
                    selectedTech={selectedTech}
                    searchQuery={searchQuery}
                    theme={theme}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    🔍 Технологий не найдено
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ mb: 3, maxWidth: '400px' }}>
                    {searchQuery 
                      ? `По запросу "${searchQuery}" ничего не найдено`
                      : 'Технологий пока нет. Используйте импорт для загрузки данных'}
                  </Typography>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        background: theme.palette.primary.main,
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Очистить поиск
                    </button>
                  )}
                </Box>
              )}
            </ContentPaper>
          </Grid>

          {/* Ресурсы */}
          <Grid item xs={12} md={6}>
            <ContentPaper elevation={2} sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h3">
                  Ресурсы для изучения
                </Typography>
                {selectedTech && (
                  <Typography 
                    variant="subtitle1"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                    }}
                  >
                    {selectedTech.title}
                  </Typography>
                )}
              </Box>
              
              {selectedTech ? (
                <Box>
                  <ResourceLoader 
                    technologyName={selectedTech.title}
                    onResourcesLoaded={(resources) => {
                      showNotification(`Загружено ${resources.length} ресурсов`, 'info');
                    }}
                  />
                  
                  <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Детали технологии
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Категория:</Typography>
                        <Typography variant="body1">{selectedTech.category}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Статус:</Typography>
                        <Typography 
                          variant="body1"
                          sx={{
                            color: selectedTech.status === 'completed' ? 'success.main' :
                                   selectedTech.status === 'in-progress' ? 'warning.main' : 'error.main'
                          }}
                        >
                          {selectedTech.status === 'completed' ? 'Завершено' :
                           selectedTech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Сложность:</Typography>
                        <Typography variant="body1">{selectedTech.difficulty || 'Начинающий'}</Typography>
                      </Grid>
                      {selectedTech.deadline && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Дедлайн:</Typography>
                          <Typography variant="body1">
                            {new Date(selectedTech.deadline).toLocaleDateString('ru-RU')}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    👈 Выберите технологию
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, maxWidth: '400px' }}>
                    Выберите технологию из списка слева, чтобы загрузить ресурсы для изучения
                  </Typography>
                  <Box sx={{ textAlign: 'left', maxWidth: '400px' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Что вы увидите:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: theme.palette.text.secondary }}>
                      <li>Популярные репозитории на GitHub</li>
                      <li>Официальную документацию</li>
                      <li>Туториалы и курсы</li>
                      <li>Примеры кода</li>
                    </ul>
                  </Box>
                </Box>
              )}
            </ContentPaper>
          </Grid>
        </Grid>

        {/* Футер */}
        <Paper 
          elevation={2} 
          sx={{ 
            mt: 4, 
            p: 3, 
            textAlign: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <Typography variant="body1" color="text.primary">
            Трекер технологий • {technologies.length} технологий • Прогресс: {calculateProgress()}%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Данные загружаются из GitHub API • Автосохранение в localStorage
          </Typography>
        </Paper>
      </StyledContainer>

      {/* Модальные окна */}
      {showDeadlineForm && selectedTech && (
        <DeadlineForm
          technology={selectedTech}
          onSubmit={handleSaveDeadline}
          onCancel={() => setShowDeadlineForm(false)}
          showNotification={showNotification}
        />
      )}
      
      {showBulkEditor && (
        <BulkStatusEditor
          technologies={technologies}
          onSave={handleBulkSave}
          onCancel={() => setShowBulkEditor(false)}
          showNotification={showNotification}
        />
      )}

      {/* Компонент уведомлений */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </ThemeProvider>
  );
}

export default App;