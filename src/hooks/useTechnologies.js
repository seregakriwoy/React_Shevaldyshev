import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение базовых компонентов',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 2,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript',
        status: 'not-started',
        notes: '',
        category: 'backend'
    },
    {
        id: 3,
        title: 'TypeScript Fundamentals',
        description: 'Типизация в JavaScript',
        status: 'in-progress',
        notes: '',
        category: 'frontend'
    },
    {
        id: 4,
        title: 'Express.js',
        description: 'Создание REST API',
        status: 'completed',
        notes: '',
        category: 'backend'
    },
    {
        id: 5,
        title: 'React Hooks',
        description: 'useState, useEffect, useContext',
        status: 'in-progress',
        notes: '',
        category: 'frontend'
    },
    {
        id: 6,
        title: 'MongoDB',
        description: 'NoSQL база данных',
        status: 'not-started',
        notes: '',
        category: 'backend'
    }
];

function useTechnologies() {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

    // Функция для обновления статуса технологии
    const updateStatus = (techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    };

    // Функция для обновления заметок
    const updateNotes = (techId, newNotes) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    // Функция для расчета общего прогресса
    const calculateProgress = () => {
        if (technologies.length === 0) return 0;
        const completed = technologies.filter(tech => tech.status === 'completed').length;
        return Math.round((completed / technologies.length) * 100);
    };

    // Функция для отметки всех как выполненные
    const markAllAsCompleted = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'completed' }))
        );
    };

    // Функция для сброса всех статусов
    const resetAllStatuses = () => {
        setTechnologies(prev =>
            prev.map(tech => ({ ...tech, status: 'not-started' }))
        );
    };

    // Функция для экспорта данных
    const exportData = () => {
        const dataStr = JSON.stringify(technologies, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'technologies-data.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Функция для добавления новой технологии
    const addTechnology = (newTech) => {
        const newId = Math.max(...technologies.map(t => t.id)) + 1;
        setTechnologies(prev => [
            ...prev,
            {
                id: newId,
                ...newTech,
                status: 'not-started',
                notes: ''
            }
        ]);
    };

    return {
        technologies,
        updateStatus,
        updateNotes,
        addTechnology,
        markAllAsCompleted,
        resetAllStatuses,
        exportData,
        progress: calculateProgress()
    };
}

export default useTechnologies;