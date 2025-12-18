function TechnologyModal({ isOpen, onClose, technology, onStatusChange, onNotesChange }) {
    if (!isOpen) return null;

    const handleStatusChange = (status) => {
        onStatusChange(technology.id, status);
    };

    const handleNotesChange = (e) => {
        onNotesChange(technology.id, e.target.value);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{technology.title}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <div className="modal-section">
                        <h4>Описание:</h4>
                        <p>{technology.description}</p>
                    </div>
                    
                    <div className="modal-section">
                        <h4>Категория:</h4>
                        <span className="modal-category">{technology.category}</span>
                    </div>
                    
                    <div className="modal-section">
                        <h4>Статус:</h4>
                        <div className="modal-status-controls">
                            <button 
                                onClick={() => handleStatusChange('not-started')}
                                className={`modal-status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
                            >
                                Не начато
                            </button>
                            <button 
                                onClick={() => handleStatusChange('in-progress')}
                                className={`modal-status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
                            >
                                В процессе
                            </button>
                            <button 
                                onClick={() => handleStatusChange('completed')}
                                className={`modal-status-btn ${technology.status === 'completed' ? 'active' : ''}`}
                            >
                                Завершено
                            </button>
                        </div>
                    </div>
                    
                    <div className="modal-section">
                        <h4>Заметки:</h4>
                        <textarea
                            value={technology.notes}
                            onChange={handleNotesChange}
                            placeholder="Добавьте подробные заметки..."
                            rows="5"
                            className="modal-textarea"
                        />
                        <div className="modal-notes-info">
                            {technology.notes.length} символов
                        </div>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button className="modal-btn save-btn" onClick={onClose}>
                        Сохранить и закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TechnologyModal;