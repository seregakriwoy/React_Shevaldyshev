// src/components/ResourceLoader.jsx
import { useState, useEffect } from 'react';

function ResourceLoader({ technologyName, onResourcesLoaded }) {
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState([]);
    const [error, setError] = useState(null);

    // Поиск ресурсов на GitHub
    const searchGitHubResources = async (techName) => {
        try {
            setLoading(true);
            setError(null);

            // Ищем репозитории с примерами кода
            const reposResponse = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(techName)}+example+tutorial&sort=stars&per_page=5`
            );
            
            // Ищем issues с меткой "documentation"
            const issuesResponse = await fetch(
                `https://api.github.com/search/issues?q=${encodeURIComponent(techName)}+label:documentation+state:open&sort=updated&per_page=3`
            );
            
            if (!reposResponse.ok || !issuesResponse.ok) {
                throw new Error('GitHub API недоступен');
            }

            const reposData = await reposResponse.json();
            const issuesData = await issuesResponse.json();

            const githubResources = reposData.items.map(repo => ({
                type: 'repository',
                title: repo.name,
                url: repo.html_url,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count
            }));

            const issueResources = issuesData.items.map(issue => ({
                type: 'issue',
                title: issue.title,
                url: issue.html_url,
                description: `Issue #${issue.number}`,
                state: issue.state,
                comments: issue.comments
            }));

            // Добавляем стандартные ресурсы
            const defaultResources = [
                {
                    type: 'documentation',
                    title: 'Официальная документация',
                    url: `https://${techName.toLowerCase()}.org`,
                    description: 'Официальный сайт и документация'
                },
                {
                    type: 'stackoverflow',
                    title: 'Вопросы на StackOverflow',
                    url: `https://stackoverflow.com/questions/tagged/${techName.toLowerCase()}`,
                    description: 'Популярные вопросы и ответы'
                }
            ];

            const allResources = [...githubResources, ...issueResources, ...defaultResources];
            setResources(allResources);

            if (onResourcesLoaded) {
                onResourcesLoaded(allResources);
            }

            return allResources;
        } catch (error) {
            console.error('Error loading resources:', error);
            setError('Не удалось загрузить ресурсы из GitHub');
            
            // Возвращаем моковые данные при ошибке
            const mockResources = getMockResources(techName);
            setResources(mockResources);
            
            if (onResourcesLoaded) {
                onResourcesLoaded(mockResources);
            }
            
            return mockResources;
        } finally {
            setLoading(false);
        }
    };

    const getMockResources = (techName) => {
        return [
            {
                type: 'documentation',
                title: `${techName} Documentation`,
                url: `https://${techName.toLowerCase()}.org`,
                description: 'Официальная документация'
            },
            {
                type: 'tutorial',
                title: `${techName} Tutorial`,
                url: `https://www.youtube.com/results?search_query=${techName}+tutorial`,
                description: 'Видео туториалы на YouTube'
            },
            {
                type: 'course',
                title: `${techName} Course`,
                url: `https://www.udemy.com/courses/search/?q=${techName}`,
                description: 'Курсы на Udemy'
            }
        ];
    };

    useEffect(() => {
        if (technologyName) {
            searchGitHubResources(technologyName);
        }
    }, [technologyName]);

    const reloadResources = () => {
        if (technologyName) {
            searchGitHubResources(technologyName);
        }
    };

    if (loading) {
        return (
            <div className="resource-loader loading">
                <div className="loader-spinner"></div>
                <p>Загрузка ресурсов из GitHub...</p>
            </div>
        );
    }

    return (
        <div className="resource-loader">
            <div className="loader-header">
                <h4>Ресурсы для изучения {technologyName}</h4>
                <button 
                    onClick={reloadResources} 
                    className="reload-button"
                    title="Обновить ресурсы"
                >
                    🔄
                </button>
            </div>

            {error && (
                <div className="resource-error">
                    <p>{error}</p>
                    <p className="error-hint">Используем локальные ресурсы</p>
                </div>
            )}

            <div className="resources-list">
                {resources.map((resource, index) => (
                    <div key={index} className="resource-item">
                        <div className="resource-type">{getResourceTypeIcon(resource.type)}</div>
                        <div className="resource-content">
                            <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="resource-title"
                            >
                                {resource.title}
                            </a>
                            <p className="resource-description">{resource.description}</p>
                            {resource.stars && (
                                <span className="resource-stars">⭐ {resource.stars}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="loader-footer">
                <a 
                    href={`https://github.com/search?q=${technologyName}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="github-search-link"
                >
                    🔍 Искать больше на GitHub
                </a>
            </div>
        </div>
    );
}

// Вспомогательная функция для иконок типов ресурсов
const getResourceTypeIcon = (type) => {
    const icons = {
        repository: '📁',
        issue: '📝',
        documentation: '📚',
        tutorial: '🎥',
        course: '🎓',
        stackoverflow: '❓',
        video: '📹',
        article: '📄'
    };
    return icons[type] || '🔗';
};

export default ResourceLoader;