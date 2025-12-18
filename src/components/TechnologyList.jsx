// src/components/TechnologyList.jsx
function TechnologyList({ technologies, onSelectTech, selectedTech }) {
    return (
        <div className="technology-list">
            {technologies.length === 0 ? (
                <div className="empty-state">
                    <p>Технологий пока нет.</p>
                    <p>Используйте импорт для загрузки данных из GitHub</p>
                </div>
            ) : (
                <div className="technologies-grid">
                    {technologies.map(tech => (
                        <div 
                            key={tech.id} 
                            className={`technology-item ${selectedTech?.id === tech.id ? 'selected' : ''}`}
                            onClick={() => onSelectTech(tech)}
                        >
                            <div className="tech-header">
                                <h3>{tech.title}</h3>
                                {tech.githubStats && (
                                    <span className="github-badge">
                                        ⭐ {tech.githubStats.stars}
                                    </span>
                                )}
                            </div>
                            <p>{tech.description}</p>
                            <div className="tech-meta">
                                <span className={`category category-${tech.category}`}>
                                    {tech.category}
                                </span>
                                <span className={`difficulty difficulty-${tech.difficulty}`}>
                                    {tech.difficulty === 'beginner' ? 'Начинающий' : 
                                     tech.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                                </span>
                            </div>
                            {tech.githubStats && (
                                <div className="github-info">
                                    <span>Язык: {tech.githubStats.language || 'N/A'}</span>
                                    {tech.githubStats.url && (
                                        <a 
                                            href={tech.githubStats.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="github-link"
                                        >
                                            GitHub →
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TechnologyList;