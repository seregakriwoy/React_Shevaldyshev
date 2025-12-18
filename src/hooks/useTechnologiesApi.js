// src/hooks/useTechnologiesApi.js
import { useState, useEffect, useCallback } from 'react';

const GITHUB_API = 'https://api.github.com';

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Моковые данные для примера (если API не работает)
    const mockTechnologies = [
        {
            id: 1,
            title: 'React',
            description: 'Библиотека для создания пользовательских интерфейсов',
            category: 'frontend',
            difficulty: 'beginner',
            resources: ['https://react.dev', 'https://ru.reactjs.org']
        },
        {
            id: 2,
            title: 'Node.js',
            description: 'Среда выполнения JavaScript на сервере',
            category: 'backend',
            difficulty: 'intermediate',
            resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/']
        },
        {
            id: 3,
            title: 'TypeScript',
            description: 'Типизированное надмножество JavaScript',
            category: 'language',
            difficulty: 'intermediate',
            resources: ['https://www.typescriptlang.org']
        }
    ];

    // Загрузка технологий из GitHub API
    const fetchTechnologies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Пробуем получить данные из GitHub API
            const response = await fetch(
                `${GITHUB_API}/search/repositories?q=topic:react+topic:javascript+topic:nodejs&sort=stars&order=desc&per_page=10`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                // Если API недоступен, используем моковые данные
                console.log('GitHub API недоступен, используем моковые данные');
                setTechnologies(mockTechnologies);
                return;
            }

            const data = await response.json();
            
            // Преобразуем репозитории GitHub в формат технологий
            const techFromGitHub = data.items.map((repo, index) => ({
                id: repo.id || index + 100,
                title: repo.name,
                description: repo.description || `GitHub репозиторий: ${repo.name}`,
                category: this.getCategoryFromTopics(repo.topics),
                difficulty: this.getDifficultyFromStars(repo.stargazers_count),
                resources: [repo.html_url],
                githubStats: {
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    language: repo.language,
                    updatedAt: repo.updated_at
                },
                createdAt: repo.created_at
            }));

            // Объединяем с моковыми данными
            const allTechnologies = [...mockTechnologies, ...techFromGitHub];
            setTechnologies(allTechnologies);
            
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            setError('Не удалось загрузить технологии. Используем локальные данные.');
            setTechnologies(mockTechnologies);
        } finally {
            setLoading(false);
        }
    }, []);

    // Добавление новой технологии
    const addTechnology = useCallback(async (techData) => {
        try {
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 500));

            const newTech = {
                id: Date.now(),
                ...techData,
                createdAt: new Date().toISOString()
            };

            setTechnologies(prev => [...prev, newTech]);
            return newTech;
        } catch (err) {
            throw new Error('Не удалось добавить технологию');
        }
    }, []);

    // Вспомогательные функции
    const getCategoryFromTopics = (topics) => {
        if (!topics) return 'other';
        if (topics.includes('react') || topics.includes('frontend')) return 'frontend';
        if (topics.includes('node') || topics.includes('backend')) return 'backend';
        if (topics.includes('typescript') || topics.includes('javascript')) return 'language';
        return 'other';
    };

    const getDifficultyFromStars = (stars) => {
        if (stars > 10000) return 'advanced';
        if (stars > 1000) return 'intermediate';
        return 'beginner';
    };

    // Загружаем технологии при монтировании
    useEffect(() => {
        fetchTechnologies();
    }, [fetchTechnologies]);

    return {
        technologies,
        loading,
        error,
        refetch: fetchTechnologies,
        addTechnology
    };
}

export default useTechnologiesApi;