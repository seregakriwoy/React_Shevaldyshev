import logo from './logo.svg';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
  const technologies = [
    { id: 1, title: 'React Components', description: 'Изучение базовых компонентов и их жизненного цикла', status: 'completed'},
    { id: 2, title: 'JSX Syntax', description: 'Освоение синтаксиса JSX и работа с выражениями', status: 'in-progress' },
    { id: 3, title: 'State Management', description: 'Работа с состоянием компонентов и хуками', status: 'not_started' },
  ];

  return (      
      <div className="technologies-container">
        {/* Интеграция ProgressHeader с передачей technologies через props */}
        <ProgressHeader technologies={technologies} />
        
        <h2>Мой прогресс по технологиям</h2>
        <div className="technologies-grid">
          {technologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
            />
          ))}
        </div>
      </div>
  );
}

export default App;