import { useState } from 'react';
import useTechnologies from './hooks/useTechnologies';
import ProgressBar from './components/ProgressBar';
import TechnologyCard from './components/TechnologyCard';
import QuickActions from './components/QuickActions';
import './App.css';

function App() {
    const { 
        technologies, 
        updateStatus, 
        updateNotes, 
        progress,
        markAllAsCompleted,
        resetAllStatuses,
        exportData
    } = useTechnologies();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Фильтрация технологий
    const filteredTechnologies = technologies.filter(tech => {
        const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            tech.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    // Получение уникальных категорий
    const categories = ['all', ...new Set(technologies.map(tech => tech.category))];

    return (
        <div className="app">
            <header className="app-header">
                <h1>Трекер изучения технологий</h1>
                <p>Отслеживайте прогресс изучения технологий React и не только</p>
                <ProgressBar
                    progress={progress}
                    label="Общий прогресс"
                    color="#4CAF50"
                    animated={true}
                    height={20}
                />
            </header>

            <main className="app-main">
                <div className="controls-section">
                    <QuickActions 
                        onMarkAllCompleted={markAllAsCompleted}
                        onResetAll={resetAllStatuses}
                        onExportData={exportData}
                        technologies={technologies}
                    />

                    <div className="filters-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Поиск технологий..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon">🔍</span>
                        </div>

                        <div className="category-filters">
                            <label>Категория:</label>
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="category-select"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'Все категории' : category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="results-info">
                        <span className="results-count">
                            Найдено: <strong>{filteredTechnologies.length}</strong> из {technologies.length}
                        </span>
                        <span className="progress-info">
                            Прогресс: <strong>{progress}%</strong>
                        </span>
                    </div>
                </div>

                <div className="technologies-grid">
                    {filteredTechnologies.map(tech => (
                        <TechnologyCard
                            key={tech.id}
                            technology={tech}
                            onStatusChange={updateStatus}
                            onNotesChange={updateNotes}
                        />
                    ))}
                </div>

                {filteredTechnologies.length === 0 && (
                    <div className="no-results">
                        <p>По вашему запросу ничего не найдено</p>
                        <button 
                            className="clear-filters-btn"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                        >
                            Сбросить фильтры
                        </button>
                    </div>
                )}
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <p>Трекер технологий • {technologies.length} технологий • Прогресс: {progress}%</p>
                    <p className="footer-hint">
                        Данные автоматически сохраняются в вашем браузере
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;