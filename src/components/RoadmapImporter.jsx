// src/components/RoadmapImporter.jsx
import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function RoadmapImporter() {
    const { addTechnology } = useTechnologiesApi();
    const [importing, setImporting] = useState(false);
    const [importStatus, setImportStatus] = useState(null);
    const [error, setError] = useState(null); // Добавляем состояние для ошибок

    const GITHUB_API = 'https://api.github.com';

    // Получить популярные репозитории по теме
    const fetchGitHubRepos = async (topic) => {
        try {
            const response = await fetch(
                `${GITHUB_API}/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=5`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data = await response.json();
            return data.items;
        } catch (error) {
            console.error('GitHub API error:', error);
            setError(error.message); // Устанавливаем ошибку
            throw error;
        }
    };

    // Импорт дорожной карты из GitHub
    const handleImportRoadmap = async (roadmapType) => {
        try {
            setImporting(true);
            setImportStatus({ type: 'loading', message: 'Загрузка данных из GitHub...' });
            setError(null); // Сбрасываем ошибку перед началом импорта

            let topics = [];
            let roadmapName = '';

            switch (roadmapType) {
                case 'frontend':
                    topics = ['react', 'vue', 'angular', 'javascript', 'typescript'];
                    roadmapName = 'Frontend Developer Roadmap';
                    break;
                case 'backend':
                    topics = ['nodejs', 'express', 'python', 'java', 'spring-boot'];
                    roadmapName = 'Backend Developer Roadmap';
                    break;
                case 'fullstack':
                    topics = ['mern', 'mean', 'fullstack', 'javascript', 'mongodb'];
                    roadmapName = 'FullStack Roadmap';
                    break;
                default:
                    topics = ['web-development', 'programming', 'tutorial'];
                    roadmapName = 'General Development Roadmap';
            }

            let importedCount = 0;
            const errors = [];

            // Получаем репозитории по каждой теме
            for (const topic of topics) {
                try {
                    const repos = await fetchGitHubRepos(topic);
                    
                    for (const repo of repos) {
                        try {
                            const techData = {
                                title: repo.name,
                                description: repo.description || `GitHub репозиторий: ${repo.name}`,
                                category: roadmapType,
                                difficulty: repo.stargazers_count > 1000 ? 'intermediate' : 'beginner',
                                resources: [repo.html_url],
                                githubStats: {
                                    stars: repo.stargazers_count,
                                    forks: repo.forks_count,
                                    language: repo.language,
                                    url: repo.html_url
                                }
                            };

                            await addTechnology(techData);
                            importedCount++;

                            // Задержка, чтобы не перегружать API
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                        } catch (error) {
                            errors.push(`Ошибка при импорте ${repo.name}: ${error.message}`);
                        }
                    }
                } catch (error) {
                    errors.push(`Ошибка при загрузке темы ${topic}: ${error.message}`);
                }
            }

            if (importedCount > 0) {
                setImportStatus({
                    type: 'success',
                    message: `Успешно импортировано ${importedCount} технологий из ${roadmapName}!`
                });
            } else {
                setImportStatus({
                    type: 'error',
                    message: 'Не удалось импортировать технологии. Используем пример данных.'
                });
                // Используем примерные данные, если API не сработал
                await importExampleData(roadmapType);
            }

            if (errors.length > 0) {
                setError(`Частичные ошибки: ${errors.join(', ')}`);
            }

        } catch (err) {
            setImportStatus({
                type: 'error',
                message: `Ошибка импорта: ${err.message}`
            });
            setError(err.message);
            // Используем примерные данные в случае ошибки
            await importExampleData(roadmapType);
        } finally {
            setImporting(false);
            // Очищаем статус через 5 секунд
            setTimeout(() => setImportStatus(null), 5000);
        }
    };

    // Импорт примерных данных (если API не работает)
    const importExampleData = async (roadmapType) => {
        const exampleTechs = {
            frontend: [
                {
                    title: 'React',
                    description: 'Библиотека для создания пользовательских интерфейсов',
                    category: 'frontend',
                    difficulty: 'beginner',
                    resources: ['https://react.dev']
                },
                {
                    title: 'Vue.js',
                    description: 'Прогрессивный фреймворк для создания UI',
                    category: 'frontend',
                    difficulty: 'beginner',
                    resources: ['https://vuejs.org']
                }
            ],
            backend: [
                {
                    title: 'Node.js',
                    description: 'Среда выполнения JavaScript на сервере',
                    category: 'backend',
                    difficulty: 'intermediate',
                    resources: ['https://nodejs.org']
                },
                {
                    title: 'Express.js',
                    description: 'Веб-фреймворк для Node.js',
                    category: 'backend',
                    difficulty: 'intermediate',
                    resources: ['https://expressjs.com']
                }
            ]
        };

        const techs = exampleTechs[roadmapType] || exampleTechs.frontend;
        
        for (const tech of techs) {
            await addTechnology(tech);
        }
    };

    const handleExampleImport = () => {
        handleImportRoadmap('frontend');
    };

    return (
        <div className="roadmap-importer">
            <h3>Импорт дорожной карты из GitHub</h3>
            <p className="importer-description">
                Загружает популярные репозитории с GitHub по выбранной теме
            </p>

            {importStatus && (
                <div className={`import-status ${importStatus.type}`}>
                    {importStatus.message}
                </div>
            )}

            <div className="import-actions">
                <button
                    onClick={handleExampleImport}
                    disabled={importing}
                    className="import-button"
                >
                    {importing ? 'Импорт...' : 'Импорт пример дорожной карты'}
                </button>

                <div className="roadmap-options">
                    <button
                        onClick={() => handleImportRoadmap('frontend')}
                        disabled={importing}
                        className="roadmap-option"
                    >
                        Frontend Roadmap
                    </button>
                    <button
                        onClick={() => handleImportRoadmap('backend')}
                        disabled={importing}
                        className="roadmap-option"
                    >
                        Backend Roadmap
                    </button>
                    <button
                        onClick={() => handleImportRoadmap('fullstack')}
                        disabled={importing}
                        className="roadmap-option"
                    >
                        FullStack Roadmap
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
}

export default RoadmapImporter;