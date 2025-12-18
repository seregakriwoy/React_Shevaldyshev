import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import ProgressBar from '../components/ProgressBar';
import QuickActions from '../components/QuickActions';

function Home() {
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

    // Последние технологии (макс 6)
    const recentTechnologies = technologies.slice(0, 6);

    // Статистика
    const completedCount = technologies.filter(t => t.status === 'completed').length;
    const inProgressCount = technologies.filter(t => t.status === 'in-progress').length;
    const notStartedCount = technologies.filter(t => t.status === 'not-started').length;

    // Фильтрация для поиска
    const filteredTechnologies = technologies
        .filter(tech => {
            const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                tech.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        })
        .slice(0, 3); // Показываем только 3 для превью

    const categories = ['all', ...new Set(technologies.map(tech => tech.category))];

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Добро пожаловать в Трекер Технологий</h1>
                <p className="hero-subtitle">
                    Отслеживайте прогресс изучения технологий, делайте заметки и достигайте целей
                </p>
                
                <div className="hero-stats">
                    <div className="stat-card">
                        <div className="stat-number">{technologies.length}</div>
                        <div className="stat-label">Всего технологий</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{completedCount}</div>
                        <div className="stat-label">Завершено</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{inProgressCount}</div>
                        <div className="stat-label">В процессе</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{notStartedCount}</div>
                        <div className="stat-label">Не начато</div>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="left-column">
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Общий прогресс</h2>
                            <span className="progress-value">{progress}%</span>
                        </div>
                        <ProgressBar
                            progress={progress}
                            color="#4CAF50"
                            animated={true}
                            height={15}
                        />
                        <div className="progress-details">
                            <div className="progress-item">
                                <span className="progress-label">Завершено:</span>
                                <span className="progress-count">{completedCount}</span>
                            </div>
                            <div className="progress-item">
                                <span className="progress-label">В процессе:</span>
                                <span className="progress-count">{inProgressCount}</span>
                            </div>
                            <div className="progress-item">
                                <span className="progress-label">Не начато:</span>
                                <span className="progress-count">{notStartedCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="section-card">
                        <h2>Быстрые действия</h2>
                        <QuickActions 
                            onMarkAllCompleted={markAllAsCompleted}
                            onResetAll={resetAllStatuses}
                            onExportData={exportData}
                            technologies={technologies}
                        />
                    </div>
                </div>

                <div className="right-column">
                    <div className="section-card">
                        <div className="section-header">
                            <h2>Последние технологии</h2>
                            <Link to="/technologies" className="view-all-link">
                                Все технологии →
                            </Link>
                        </div>
                        
                        <div className="quick-search">
                            <input
                                type="text"
                                placeholder="Поиск технологий..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
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

                        {filteredTechnologies.length > 0 ? (
                            <div className="technologies-list">
                                {filteredTechnologies.map(tech => (
                                    <div key={tech.id} className="tech-preview">
                                        <div className="tech-preview-header">
                                            <h4>{tech.title}</h4>
                                            <span className={`status-badge status-${tech.status}`}>
                                                {tech.status === 'completed' ? '✓' : 
                                                 tech.status === 'in-progress' ? '⏳' : '○'}
                                            </span>
                                        </div>
                                        <p className="tech-preview-desc">{tech.description}</p>
                                        <div className="tech-preview-footer">
                                            <span className="tech-category">{tech.category}</span>
                                            <Link 
                                                to={`/technology/${tech.id}`}
                                                className="tech-detail-link"
                                            >
                                                Подробнее →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Технологий не найдено</p>
                                <Link to="/add-technology" className="btn btn-primary">
                                    Добавить технологию
                                </Link>
                            </div>
                        )}

                        <div className="section-actions">
                            <Link to="/technologies" className="btn btn-outline">
                                Все технологии
                            </Link>
                            <Link to="/add-technology" className="btn btn-primary">
                                + Добавить технологию
                            </Link>
                        </div>
                    </div>

                    <div className="section-card">
                        <h2>Быстрый доступ</h2>
                        <div className="quick-links">
                            <Link to="/technologies" className="quick-link">
                                <div className="quick-link-icon">📚</div>
                                <div className="quick-link-content">
                                    <div className="quick-link-title">Все технологии</div>
                                    <div className="quick-link-desc">{technologies.length} записей</div>
                                </div>
                            </Link>
                            
                            <Link to="/statistics" className="quick-link">
                                <div className="quick-link-icon">📊</div>
                                <div className="quick-link-content">
                                    <div className="quick-link-title">Статистика</div>
                                    <div className="quick-link-desc">Графики и отчеты</div>
                                </div>
                            </Link>
                            
                            <Link to="/add-technology" className="quick-link">
                                <div className="quick-link-icon">➕</div>
                                <div className="quick-link-content">
                                    <div className="quick-link-title">Добавить технологию</div>
                                    <div className="quick-link-desc">Новая запись</div>
                                </div>
                            </Link>
                            
                            <Link to="/settings" className="quick-link">
                                <div className="quick-link-icon">⚙️</div>
                                <div className="quick-link-content">
                                    <div className="quick-link-title">Настройки</div>
                                    <div className="quick-link-desc">Настройте приложение</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;