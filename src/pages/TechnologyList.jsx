import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyCard from '../components/TechnologyCard';
import useTechnologies from '../hooks/useTechnologies';

function TechnologyList() {
    const { 
        technologies, 
        updateStatus, 
        updateNotes 
    } = useTechnologies();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('title');

    // Фильтрация технологий
    const filteredTechnologies = technologies
        .filter(tech => {
            const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                tech.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
            const matchesStatus = selectedStatus === 'all' || tech.status === selectedStatus;
            
            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'status':
                    const statusOrder = { 'not-started': 0, 'in-progress': 1, 'completed': 2 };
                    return statusOrder[a.status] - statusOrder[b.status];
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

    // Получение уникальных категорий
    const categories = ['all', ...new Set(technologies.map(tech => tech.category))];
    const statuses = ['all', 'not-started', 'in-progress', 'completed'];

    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">
                    + Добавить технологию
                </Link>
            </div>

            <div className="filters-panel">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск по названию или описанию..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label>Категория:</label>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'Все категории' : category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Статус:</label>
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="filter-select"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'Все статусы' : 
                                     status === 'completed' ? 'Завершено' :
                                     status === 'in-progress' ? 'В процессе' : 'Не начато'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Сортировка:</label>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="title">По названию</option>
                            <option value="status">По статусу</option>
                            <option value="category">По категории</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="results-info">
                <span className="results-count">
                    Найдено технологий: <strong>{filteredTechnologies.length}</strong> из {technologies.length}
                </span>
                <span className="filters-hint">
                    {selectedCategory !== 'all' && `Категория: ${selectedCategory} `}
                    {selectedStatus !== 'all' && `Статус: ${selectedStatus}`}
                </span>
            </div>

            {filteredTechnologies.length > 0 ? (
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
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h3>Технологий не найдено</h3>
                    <p>
                        {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' 
                            ? 'Попробуйте изменить параметры поиска'
                            : 'Добавьте свою первую технологию для отслеживания'
                        }
                    </p>
                    <div className="empty-state-actions">
                        {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
                            <button 
                                className="btn btn-outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setSelectedStatus('all');
                                }}
                            >
                                Сбросить фильтры
                            </button>
                        )}
                        <Link to="/add-technology" className="btn btn-primary">
                            Добавить технологию
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TechnologyList;