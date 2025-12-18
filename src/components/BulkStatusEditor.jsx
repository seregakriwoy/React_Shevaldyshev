// src/components/BulkStatusEditor.jsx
import { useState, useEffect, useRef } from 'react';

function BulkStatusEditor({ technologies, onSave, onCancel }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [newStatus, setNewStatus] = useState('not-started');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const firstCheckboxRef = useRef(null);

    // Фокусируемся на первом чекбоксе при открытии
    useEffect(() => {
        if (firstCheckboxRef.current) {
            firstCheckboxRef.current.focus();
        }
    }, []);

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(technologies.map(tech => tech.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectTech = (id, checked) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(techId => techId !== id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (selectedIds.length === 0) {
            alert('Выберите хотя бы одну технологию');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (onSave) {
                onSave(selectedIds, newStatus);
            }
            
            alert(`Статус обновлен для ${selectedIds.length} технологий`);
        } catch (error) {
            alert('Ошибка при обновлении статусов: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        // Закрытие по Escape
        if (e.key === 'Escape' && onCancel) {
            onCancel();
        }
        
        // Навигация по таблице
        if (e.key === 'Tab' && e.target.type === 'checkbox') {
            const checkboxes = Array.from(
                document.querySelectorAll('input[type="checkbox"]')
            );
            const currentIndex = checkboxes.indexOf(e.target);
            
            if (e.shiftKey && currentIndex === 1) {
                e.preventDefault();
                checkboxes[0].focus();
            } else if (!e.shiftKey && currentIndex === checkboxes.length - 1) {
                e.preventDefault();
                document.querySelector('.status-select').focus();
            }
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

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Завершено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return status;
        }
    };

    const selectedCount = selectedIds.length;
    const totalCount = technologies.length;

    return (
        <div 
            className="bulk-editor-container"
            role="dialog"
            aria-labelledby="bulk-editor-title"
            aria-describedby="bulk-editor-description"
            onKeyDown={handleKeyDown}
        >
            <div className="bulk-editor">
                <div className="editor-header">
                    <h2 id="bulk-editor-title">Массовое редактирование статусов</h2>
                    <p id="bulk-editor-description" className="editor-description">
                        Выберите технологии и установите для них новый статус
                    </p>
                </div>
                
                <div className="selection-info">
                    <div className="selection-count" role="status" aria-live="polite">
                        Выбрано: <strong>{selectedCount}</strong> из {totalCount}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleSelectAll(selectedCount < totalCount)}
                        className="select-all-btn"
                        aria-label={selectedCount < totalCount ? 
                            'Выбрать все технологии' : 'Снять выделение со всех технологий'}
                    >
                        {selectedCount < totalCount ? 'Выбрать все' : 'Снять выделение'}
                    </button>
                </div>
                
                <div className="technologies-list-container">
                    <div 
                        className="technologies-list"
                        role="table"
                        aria-label="Список технологий для выбора"
                    >
                        <div className="table-header" role="rowgroup">
                            <div className="table-row" role="row">
                                <div 
                                    className="table-cell checkbox-cell" 
                                    role="columnheader"
                                    aria-label="Выбор"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCount === totalCount && totalCount > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        ref={firstCheckboxRef}
                                        aria-label={selectedCount === totalCount ? 
                                            'Снять выделение со всех технологий' : 'Выбрать все технологии'}
                                        tabIndex="0"
                                    />
                                </div>
                                <div className="table-cell" role="columnheader">Технология</div>
                                <div className="table-cell" role="columnheader">Текущий статус</div>
                                <div className="table-cell" role="columnheader">Категория</div>
                            </div>
                        </div>
                        
                        <div className="table-body" role="rowgroup">
                            {technologies.map((tech, index) => (
                                <div 
                                    key={tech.id} 
                                    className="table-row"
                                    role="row"
                                    aria-selected={selectedIds.includes(tech.id)}
                                >
                                    <div className="table-cell checkbox-cell" role="cell">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(tech.id)}
                                            onChange={(e) => handleSelectTech(tech.id, e.target.checked)}
                                            aria-label={`Выбрать ${tech.title}`}
                                            id={`tech-${tech.id}`}
                                            tabIndex="0"
                                        />
                                    </div>
                                    <div className="table-cell" role="cell">
                                        <label htmlFor={`tech-${tech.id}`} className="tech-label">
                                            <strong>{tech.title}</strong>
                                            <span className="tech-description">{tech.description}</span>
                                        </label>
                                    </div>
                                    <div className="table-cell" role="cell">
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(tech.status) }}
                                        >
                                            {getStatusText(tech.status)}
                                        </span>
                                    </div>
                                    <div className="table-cell" role="cell">
                                        <span className="category-badge">{tech.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="status-form">
                    <div className="form-group">
                        <label htmlFor="newStatus" className="form-label">
                            Новый статус для выбранных технологий *
                        </label>
                        <div className="status-options" role="radiogroup" aria-label="Выбор нового статуса">
                            {[
                                { value: 'not-started', label: 'Не начато', color: '#f44336' },
                                { value: 'in-progress', label: 'В процессе', color: '#ff9800' },
                                { value: 'completed', label: 'Завершено', color: '#4caf50' }
                            ].map((status) => (
                                <button
                                    key={status.value}
                                    type="button"
                                    className={`status-option ${newStatus === status.value ? 'selected' : ''}`}
                                    style={{ 
                                        borderColor: status.color,
                                        backgroundColor: newStatus === status.value ? status.color : 'white'
                                    }}
                                    onClick={() => setNewStatus(status.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setNewStatus(status.value);
                                        }
                                    }}
                                    aria-checked={newStatus === status.value}
                                    role="radio"
                                    tabIndex="0"
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Предпросмотр изменений:</label>
                        <div className="preview-changes">
                            <div className="preview-item">
                                <span className="preview-label">Выбрано технологий:</span>
                                <span className="preview-value">{selectedCount}</span>
                            </div>
                            <div className="preview-item">
                                <span className="preview-label">Новый статус:</span>
                                <span 
                                    className="preview-value status-preview"
                                    style={{ backgroundColor: getStatusColor(newStatus) }}
                                >
                                    {getStatusText(newStatus)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div 
                        className="form-actions"
                        role="group"
                        aria-label="Действия формы"
                    >
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-outline cancel-btn"
                            tabIndex="0"
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary submit-btn"
                            tabIndex="0"
                            disabled={selectedCount === 0 || isSubmitting}
                            aria-disabled={selectedCount === 0 || isSubmitting}
                        >
                            {isSubmitting ? 'Сохранение...' : `Применить к ${selectedCount} технологиям`}
                        </button>
                    </div>
                    
                    <div className="form-footer">
                        <p className="form-note" role="note">
                            * Выберите технологии и установите новый статус
                        </p>
                        <p className="form-note" role="note">
                            Используйте Tab для навигации, Space для выбора, Escape для отмены
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BulkStatusEditor;