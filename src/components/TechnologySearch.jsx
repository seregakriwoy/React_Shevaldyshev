// src/components/TechnologySearch.jsx
import { useState, useEffect, useCallback } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function TechnologySearch() {
    const { searchTechnologies } = useTechnologiesApi();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    // Debounce функция
    const debouncedSearch = useCallback((value) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(async () => {
            if (value.trim()) {
                setIsSearching(true);
                try {
                    const results = await searchTechnologies(value);
                    setSearchResults(results);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500); // 500ms debounce delay

        setDebounceTimeout(timeout);
    }, [debounceTimeout, searchTechnologies]);

    // Обработчик изменения input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    // Очистка таймера при размонтировании
    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

    // Поиск на GitHub API
    const searchGitHub = async (query) => {
        try {
            const response = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+in:name,description&sort=stars&order=desc&per_page=5`
            );
            
            if (!response.ok) throw new Error('GitHub search failed');
            
            const data = await response.json();
            return data.items.map(repo => ({
                id: repo.id,
                title: repo.name,
                description: repo.description,
                url: repo.html_url,
                stars: repo.stargazers_count,
                language: repo.language
            }));
        } catch (error) {
            console.error('GitHub search error:', error);
            return [];
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
    };

    return (
        <div className="technology-search">
            <div className="search-container">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Поиск технологий..."
                    className="search-input"
                />
                {searchQuery && (
                    <button onClick={clearSearch} className="clear-search">
                        ×
                    </button>
                )}
                {isSearching && (
                    <div className="search-spinner">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>

            {searchResults.length > 0 && (
                <div className="search-results">
                    <div className="results-header">
                        <span>Найдено: {searchResults.length}</span>
                        <button onClick={clearSearch} className="close-results">
                            Скрыть
                        </button>
                    </div>
                    <div className="results-list">
                        {searchResults.map((tech) => (
                            <div key={tech.id} className="search-result-item">
                                <div className="result-content">
                                    <h4>{tech.title}</h4>
                                    <p>{tech.description}</p>
                                    {tech.githubStats && (
                                        <div className="github-stats">
                                            <span className="stars">
                                                ⭐ {tech.githubStats.stars}
                                            </span>
                                            <span className="language">
                                                {tech.githubStats.language}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <a 
                                    href={tech.resources?.[0]} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="result-link"
                                >
                                    Открыть
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {searchQuery && !isSearching && searchResults.length === 0 && (
                <div className="no-results">
                    <p>Ничего не найдено по запросу "{searchQuery}"</p>
                    <button 
                        onClick={() => window.open(`https://github.com/search?q=${searchQuery}`, '_blank')}
                        className="search-on-github"
                    >
                        Поиск на GitHub →
                    </button>
                </div>
            )}
        </div>
    );
}

export default TechnologySearch;