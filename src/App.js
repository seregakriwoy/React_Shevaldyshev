// src/App.jsx
import { useState } from 'react';
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
import './App.css';

function App() {
    const { technologies, loading, error, refetch, addTechnology } = useTechnologiesApi();
    const [selectedTech, setSelectedTech] = useState(null);
    const [showDeadlineForm, setShowDeadlineForm] = useState(false);
    const [showBulkEditor, setShowBulkEditor] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTechs, setFilteredTechs] = useState([]);

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
        console.log('Study plan saved:', studyPlan);
        
        // Сохраняем в localStorage
        const existingPlans = JSON.parse(localStorage.getItem('studyPlans') || '{}');
        existingPlans[studyPlan.technologyId] = studyPlan;
        localStorage.setItem('studyPlans', JSON.stringify(existingPlans));
        
        setShowDeadlineForm(false);
        alert(`План изучения "${studyPlan.technologyName}" сохранен!`);
        
        // Обновляем технологию с новой информацией о дедлайне
        const updatedTechs = technologies.map(tech => 
            tech.id === studyPlan.technologyId ? { 
                ...tech, 
                deadline: studyPlan.endDate,
                studyPlan: studyPlan 
            } : tech
        );
        
        // Здесь можно обновить глобальное состояние если нужно
        console.log('Updated technologies with deadlines:', updatedTechs);
    };

    // Обработчики для BulkStatusEditor
    const handleBulkSave = (selectedIds, newStatus) => {
        // Обновляем статусы технологий
        const updatedTechs = technologies.map(tech => 
            selectedIds.includes(tech.id) ? { ...tech, status: newStatus } : tech
        );
        
        // Сохраняем в localStorage (в реальном приложении - отправляем на сервер)
        localStorage.setItem('technologies', JSON.stringify(updatedTechs));
        
        // Обновляем состояние через refetch
        refetch();
        
        setShowBulkEditor(false);
        alert(`Статус обновлен для ${selectedIds.length} технологий`);
    };

    // Обработчики для DataManager
    const handleDataImport = async (importedTechnologies) => {
        try {
            // Добавляем каждую импортированную технологию
            for (const tech of importedTechnologies) {
                await addTechnology(tech);
            }
            
            // Обновляем список
            refetch();
            
            return Promise.resolve();
        } catch (error) {
            console.error('Import error:', error);
            throw error;
        }
    };

    const handleDataExport = (exportData) => {
        console.log('Exported data:', exportData);
        // Можно добавить дополнительную логику здесь
    };

    // Обработчики для QuickActions
    const handleMarkAllCompleted = () => {
        const updatedTechs = technologies.map(tech => ({ ...tech, status: 'completed' }));
        localStorage.setItem('technologies', JSON.stringify(updatedTechs));
        refetch();
        alert('Все технологии отмечены как завершенные');
    };

    const handleResetAllStatuses = () => {
        const updatedTechs = technologies.map(tech => ({ ...tech, status: 'not-started' }));
        localStorage.setItem('technologies', JSON.stringify(updatedTechs));
        refetch();
        alert('Статусы всех технологий сброшены');
    };

    const handleExportData = () => {
        // Используем DataManager логику для экспорта
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
    };

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
                <div className="header-controls">
                    <button 
                        onClick={refetch} 
                        className="refresh-btn"
                        aria-label="Обновить данные"
                    >
                        🔄 Обновить
                    </button>
                    <ProgressBar
                        progress={calculateProgress()}
                        label="Общий прогресс"
                        color="#4CAF50"
                        animated={true}
                        height={15}
                    />
                </div>
            </header>

            {error && (
                <div className="app-error" role="alert">
                    <p>⚠️ {error}</p>
                    <button onClick={refetch}>Попробовать снова</button>
                    <p className="error-hint">Используются локальные данные</p>
                </div>
            )}

            <main className="app-main">
                <div className="search-section">
                    <TechnologySearch 
                        onSearchChange={setSearchQuery}
                        technologies={technologies}
                    />
                    <RoadmapImporter />
                </div>

                <div className="management-tools">
                    <div className="tools-section">
                        <QuickActions 
                            onMarkAllCompleted={handleMarkAllCompleted}
                            onResetAll={handleResetAllStatuses}
                            onExportData={handleExportData}
                            technologies={technologies}
                        />
                        
                        <div className="action-buttons">
                            <button 
                                onClick={() => setShowBulkEditor(true)}
                                className="btn btn-outline bulk-edit-btn"
                                aria-label="Открыть массовое редактирование статусов"
                            >
                                ⚙️ Массовое редактирование
                            </button>
                            
                            {selectedTech && (
                                <button 
                                    onClick={() => setShowDeadlineForm(true)}
                                    className="btn btn-primary deadline-btn"
                                    aria-label={`Установить сроки изучения для ${selectedTech.title}`}
                                >
                                    ⏰ Установить сроки
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <DataManager 
                        technologies={technologies}
                        onImport={handleDataImport}
                        onExport={handleDataExport}
                    />
                </div>

                <div className="content-grid">
                    <div className="technologies-column">
                        <div className="section-header">
                            <h2>Технологии ({technologies.length})</h2>
                            <div className="search-info">
                                {searchQuery && (
                                    <span className="search-results">
                                        Найдено: {filteredTechnologies.length}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {filteredTechnologies.length > 0 ? (
                            <TechnologyList 
                                technologies={filteredTechnologies}
                                onSelectTech={setSelectedTech}
                                selectedTech={selectedTech}
                                searchQuery={searchQuery}
                            />
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">🔍</div>
                                <h3>Технологий не найдено</h3>
                                <p>
                                    {searchQuery 
                                        ? `По запросу "${searchQuery}" ничего не найдено`
                                        : 'Технологий пока нет. Используйте импорт для загрузки данных'}
                                </p>
                                <div className="empty-state-actions">
                                    {searchQuery && (
                                        <button 
                                            className="btn btn-outline"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            Очистить поиск
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="resources-column">
                        <div className="section-header">
                            <h2>Ресурсы для изучения</h2>
                            {selectedTech && (
                                <span className="selected-tech">
                                    {selectedTech.title}
                                </span>
                            )}
                        </div>
                        
                        {selectedTech ? (
                            <div className="resource-container">
                                <ResourceLoader 
                                    technologyName={selectedTech.title}
                                    onResourcesLoaded={(resources) => {
                                        console.log('Resources loaded:', resources);
                                    }}
                                />
                                
                                <div className="tech-details">
                                    <h4>Детали технологии</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Категория:</span>
                                            <span className="detail-value">{selectedTech.category}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Статус:</span>
                                            <span className={`detail-value status-${selectedTech.status}`}>
                                                {selectedTech.status === 'completed' ? 'Завершено' :
                                                 selectedTech.status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Сложность:</span>
                                            <span className="detail-value">{selectedTech.difficulty || 'Начинающий'}</span>
                                        </div>
                                        {selectedTech.deadline && (
                                            <div className="detail-item">
                                                <span className="detail-label">Дедлайн:</span>
                                                <span className="detail-value">
                                                    {new Date(selectedTech.deadline).toLocaleDateString('ru-RU')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="select-tech-hint">
                                <div className="hint-icon">👈</div>
                                <h4>Выберите технологию</h4>
                                <p>Выберите технологию из списка слева, чтобы загрузить ресурсы для изучения</p>
                                <div className="hint-tips">
                                    <p className="hint-title">Что вы увидите:</p>
                                    <ul>
                                        <li>Популярные репозитории на GitHub</li>
                                        <li>Официальную документацию</li>
                                        <li>Туториалы и курсы</li>
                                        <li>Примеры кода</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <p>Трекер технологий • {technologies.length} технологий • Прогресс: {calculateProgress()}%</p>
                    <p className="footer-hint">
                        Данные загружаются из GitHub API • Автосохранение в localStorage
                    </p>
                </div>
            </footer>

            {/* Модальные окна */}
            {showDeadlineForm && selectedTech && (
                <DeadlineForm
                    technology={selectedTech}
                    onSubmit={handleSaveDeadline}
                    onCancel={() => setShowDeadlineForm(false)}
                />
            )}
            
            {showBulkEditor && (
                <BulkStatusEditor
                    technologies={technologies}
                    onSave={handleBulkSave}
                    onCancel={() => setShowBulkEditor(false)}
                />
            )}
        </div>
    );
}

export default App;