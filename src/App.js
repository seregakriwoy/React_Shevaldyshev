import { useState, useEffect } from 'react';
import './App.css';
import TechnologyNotes from './components/TechnologyNotes';

function App() {
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: 'React Components',
      description: 'Изучение базовых компонентов',
      status: 'not-started',
      notes: ''
    },
    {
      id: 2,
      title: 'React Hooks',
      description: 'useState, useEffect, useContext',
      status: 'in-progress',
      notes: ''
    },
    {
      id: 3,
      title: 'React Router',
      description: 'Навигация в React приложениях',
      status: 'completed',
      notes: ''
    },
    {
      id: 4,
      title: 'Redux Toolkit',
      description: 'Управление состоянием приложения',
      status: 'not-started',
      notes: ''
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCount, setFilteredCount] = useState(technologies.length);

  // Загружаем данные из localStorage при первом рендере
  useEffect(() => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      try {
        setTechnologies(JSON.parse(saved));
        console.log('Данные загружены из localStorage');
      } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error);
      }
    }
  }, []);

  // Сохраняем технологии в localStorage при любом изменении
  useEffect(() => {
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    console.log('Данные сохранены в localStorage');
  }, [technologies]);

  // Функция обновления заметок
  const updateTechnologyNotes = (techId, newNotes) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция изменения статуса
  const updateTechnologyStatus = (techId, newStatus) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Фильтрация технологий по поисковому запросу
  const filteredTechnologies = technologies.filter(tech => {
    const query = searchQuery.toLowerCase();
    return (
      tech.title.toLowerCase().includes(query) ||
      tech.description.toLowerCase().includes(query)
    );
  });

  // Обновляем счетчик найденных результатов
  useEffect(() => {
    setFilteredCount(filteredTechnologies.length);
  }, [filteredTechnologies]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#ff9800';
      case 'not-started': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      case 'not-started': return 'Не начато';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Трекер технологий React</h1>
        <p>Отслеживайте прогресс изучения технологий React</p>
      </header>

      <div className="search-section">
        <input
          type="text"
          placeholder="Поиск по названию или описанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="search-results">
          Найдено технологий: <strong>{filteredCount}</strong>
        </div>
      </div>

      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <div key={tech.id} className="technology-card">
            <div className="card-header">
              <h3>{tech.title}</h3>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(tech.status) }}>
                {getStatusText(tech.status)}
              </div>
            </div>
            
            <p className="description">{tech.description}</p>
            
            <div className="status-controls">
              <button 
                onClick={() => updateTechnologyStatus(tech.id, 'not-started')}
                className={`status-btn ${tech.status === 'not-started' ? 'active' : ''}`}
              >
                Не начато
              </button>
              <button 
                onClick={() => updateTechnologyStatus(tech.id, 'in-progress')}
                className={`status-btn ${tech.status === 'in-progress' ? 'active' : ''}`}
              >
                В процессе
              </button>
              <button 
                onClick={() => updateTechnologyStatus(tech.id, 'completed')}
                className={`status-btn ${tech.status === 'completed' ? 'active' : ''}`}
              >
                Завершено
              </button>
            </div>

            <TechnologyNotes 
              notes={tech.notes}
              onNotesChange={updateTechnologyNotes}
              techId={tech.id}
            />
          </div>
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="no-results">
          <p>По запросу "{searchQuery}" ничего не найдено</p>
        </div>
      )}

      <footer className="app-footer">
        <p>Всего технологий: {technologies.length} | Сохранено в localStorage</p>
      </footer>
    </div>
  );
}

export default App;