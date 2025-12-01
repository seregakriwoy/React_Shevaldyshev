import logo from './logo.svg';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import { useState } from 'react';

function App() {
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: 'React Components',
      description: 'Изучение базовых компонентов и их жизненного цикла',
      status: 'not-started'
    },
    {
      id: 2,
      title: 'JSX Syntax',
      description: 'Освоение синтаксиса JSX и работа с выражениями',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'State Management',
      description: 'Работа с состоянием компонентов и хуками',    
      status: 'in-progress'
    },
  ]);

  const [activeFilter, setActiveFilter] = useState('all'); // Состояние для активного фильтра

  // Функция изменения статуса технологии по id
  const updateTechnologyStatus = (id) => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(tech => {
        if (tech.id === id) {
          const statusFlow = ['not-started', 'in-progress', 'completed'];
          const currentIndex = statusFlow.indexOf(tech.status);
          const nextIndex = (currentIndex + 1) % statusFlow.length;
          return { ...tech, status: statusFlow[nextIndex] };
        }
        return tech;
      })
    );
  };

  // Задание 1: Функции для быстрых действий
  const markAllAsCompleted = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const resetAllStatuses = () => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const randomNextTechnology = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTechs.length === 0) {
      alert('Все технологии уже начаты или завершены!');
      return;
    }
    
    const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
    updateTechnologyStatus(randomTech.id);
    alert(`Следующая технология для изучения: "${randomTech.title}"`);
  };

  // Задание 2: Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    switch (activeFilter) {
      case 'not-started':
        return tech.status === 'not-started';
      case 'in-progress':
        return tech.status === 'in-progress';
      case 'completed':
        return tech.status === 'completed';
      default:
        return true; // 'all' - показывать все
    }
  });

  // Функции для фильтрации
  const filterButtons = [
    { key: 'all', label: 'Все технологии' },
    { key: 'not-started', label: 'Не начатые' },
    { key: 'in-progress', label: 'В процессе' },
    { key: 'completed', label: 'Выполненные' }
  ];
return (
      <div className="technologies-container">
        {/* Передаем обновленные технологии в ProgressHeader */}
        <ProgressHeader technologies={technologies} />
        
        {/* Задание 1: Компонент быстрых действий */}
        <QuickActions 
          onMarkAllCompleted={markAllAsCompleted}
          onResetAll={resetAllStatuses}
          onRandomNext={randomNextTechnology}
        />
        
        {/* Задание 2: Фильтрация технологий */}
        <div className="filter-buttons">
          <h2>Фильтр по статусу:</h2>
          <div className="filter-buttons-container">
            {filterButtons.map(button => (
              <button
                key={button.key}
                className={`filter-button ${activeFilter === button.key ? 'filter-button--active' : ''}`}
                onClick={() => setActiveFilter(button.key)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        <h2>Мой прогресс по технологиям ({filteredTechnologies.length})</h2>
        
        <div className="technologies-grid">
          {filteredTechnologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              id={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              onStatusChange={updateTechnologyStatus}
            />
          ))}
        </div>

        {filteredTechnologies.length === 0 && (
          <div className="no-results">
            <p>Нет технологий с выбранным статусом</p>
          </div>
        )}
      </div>
  );
}

export default App;