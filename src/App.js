// src/App.jsx
import { useState } from 'react';
import useTechnologiesApi from './hooks/useTechnologiesApi';
import RoadmapImporter from './components/RoadmapImporter';
import TechnologyList from './components/TechnologyList';
import TechnologySearch from './components/TechnologySearch';
import ResourceLoader from './components/ResourceLoader';
import './App.css';

function App() {
    const { technologies, loading, error, refetch } = useTechnologiesApi();
    const [selectedTech, setSelectedTech] = useState(null);

    if (loading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
                <p>Загрузка технологий...</p>
                <p className="loading-hint">Используется GitHub API для получения данных</p>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>Трекер изучения технологий</h1>
                <button onClick={refetch} className="refresh-btn">
                    🔄 Обновить
                </button>
            </header>

            {error && (
                <div className="app-error">
                    <p>⚠️ {error}</p>
                    <button onClick={refetch}>Попробовать снова</button>
                    <p className="error-hint">Используются локальные данные</p>
                </div>
            )}

            <main className="app-main">
                <div className="search-section">
                    <TechnologySearch />
                    <RoadmapImporter />
                </div>

                <div className="content-grid">
                    <div className="technologies-column">
                        <h2>Технологии</h2>
                        <TechnologyList 
                            technologies={technologies}
                            onSelectTech={setSelectedTech}
                            selectedTech={selectedTech}
                        />
                    </div>

                    <div className="resources-column">
                        <h2>Ресурсы для изучения</h2>
                        {selectedTech ? (
                            <ResourceLoader 
                                technologyName={selectedTech.title}
                                onResourcesLoaded={(resources) => {
                                    console.log('Resources loaded:', resources);
                                }}
                            />
                        ) : (
                            <div className="select-tech-hint">
                                <p>👈 Выберите технологию слева, чтобы загрузить ресурсы для изучения</p>
                                <p className="hint-details">
                                    Ресурсы загружаются из GitHub API и включают:
                                </p>
                                <ul>
                                    <li>Популярные репозитории</li>
                                    <li>Документацию</li>
                                    <li>Примеры кода</li>
                                    <li>Полезные ссылки</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <p>Данные загружаются из GitHub API • Всего технологий: {technologies.length}</p>
                <p className="footer-note">
                    🔄 Для обновления данных нажмите кнопку "Обновить" в заголовке
                </p>
            </footer>
        </div>
    );
}

export default App;