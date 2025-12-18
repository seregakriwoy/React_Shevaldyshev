import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useTechnologies from '../hooks/useTechnologies';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { technologies, updateStatus, updateNotes } = useTechnologies();
    const [technology, setTechnology] = useState(null);
    const [noteInput, setNoteInput] = useState('');

    useEffect(() => {
        const tech = technologies.find(t => t.id === parseInt(techId));
        if (tech) {
            setTechnology(tech);
            setNoteInput(tech.notes || '');
        }
    }, [techId, technologies]);

    const handleUpdateStatus = (newStatus) => {
        if (technology) {
            updateStatus(parseInt(techId), newStatus);
            setTechnology({ ...technology, status: newStatus });
        }
    };

    const handleSaveNotes = () => {
        if (technology && noteInput !== technology.notes) {
            updateNotes(parseInt(techId), noteInput);
            setTechnology({ ...technology, notes: noteInput });
        }
    };

    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
            // Удаляем технологию
            const updated = technologies.filter(t => t.id !== parseInt(techId));
            localStorage.setItem('technologies', JSON.stringify(updated));
            navigate('/technologies');
        }
    };

    if (!technology) {
        return (
            <div className="page">
                <div className="page-header">
                    <Link to="/technologies" className="back-link">
                        ← Назад к списку
                    </Link>
                    <h1>Технология не найдена</h1>
                </div>
                <div className="not-found">
                    <p>Технология с ID {techId} не существует.</p>
                    <Link to="/technologies" className="btn btn-primary">
                        Вернуться к списку
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Завершено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return 'Неизвестно';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#4caf50';
            case 'in-progress': return '#ff9800';
            case 'not-started': return '#f44336';
            default: return '#757575';
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <div className="header-actions">
                    <h1>{technology.title}</h1>
                    <div className="action-buttons">
                        <Link 
                            to={`/edit-technology/${techId}`}
                            className="btn btn-outline"
                        >
                            Редактировать
                        </Link>
                        <button 
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </div>

            <div className="technology-detail">
                <div className="detail-main">
                    <div className="detail-section">
                        <div className="section-header">
                            <h2>Основная информация</h2>
                            <div 
                                className="status-badge-large"
                                style={{ backgroundColor: getStatusColor(technology.status) }}
                            >
                                {getStatusText(technology.status)}
                            </div>
                        </div>
                        
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Категория:</span>
                                <span className="info-value category-badge">
                                    {technology.category}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Добавлено:</span>
                                <span className="info-value">
                                    {new Date().toLocaleDateString('ru-RU')}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">ID:</span>
                                <span className="info-value">{technology.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Описание</h3>
                        <p className="description-text">{technology.description}</p>
                    </div>

                    <div className="detail-section">
                        <h3>Изменение статуса</h3>
                        <div className="status-buttons">
                            <button
                                onClick={() => handleUpdateStatus('not-started')}
                                className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
                            >
                                Не начато
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('in-progress')}
                                className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
                            >
                                В процессе
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('completed')}
                                className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
                            >
                                Завершено
                            </button>
                        </div>
                    </div>
                </div>

                <div className="detail-sidebar">
                    <div className="detail-section">
                        <div className="section-header">
                            <h3>Мои заметки</h3>
                            <button 
                                className="btn btn-small"
                                onClick={handleSaveNotes}
                                disabled={noteInput === technology.notes}
                            >
                                Сохранить
                            </button>
                        </div>
                        <textarea
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Записывайте сюда важные моменты..."
                            rows="10"
                            className="notes-textarea"
                        />
                        <div className="notes-info">
                            <span>{noteInput.length} символов</span>
                            {noteInput !== technology.notes && (
                                <span className="unsaved-changes">Есть несохраненные изменения</span>
                            )}
                        </div>
                    </div>

                    {technology.notes && technology.notes.trim() && (
                        <div className="detail-section">
                            <h3>Сохраненные заметки</h3>
                            <div className="saved-notes">
                                <p>{technology.notes}</p>
                            </div>
                        </div>
                    )}

                    <div className="detail-section">
                        <h3>Действия</h3>
                        <div className="action-links">
                            <Link 
                                to={`/edit-technology/${techId}`}
                                className="action-link"
                            >
                                ✎ Редактировать технологию
                            </Link>
                            <button 
                                className="action-link text-danger"
                                onClick={handleDelete}
                            >
                                🗑️ Удалить технологию
                            </button>
                            <Link to="/technologies" className="action-link">
                                ← Вернуться к списку
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;