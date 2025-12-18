import { useState } from 'react';
import TechnologyNotes from './TechnologyNotes';
import TechnologyModal from './TechnologyModal';

function TechnologyCard({ technology, onStatusChange, onNotesChange }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            default: return 'Неизвестно';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'frontend': return '#2196f3';
            case 'backend': return '#ff5722';
            case 'database': return '#9c27b0';
            case 'devops': return '#00bcd4';
            default: return '#757575';
        }
    };

    return (
        <>
            <div className="technology-card">
                <div className="card-header">
                    <div className="card-title-section">
                        <h3>{technology.title}</h3>
                        <span 
                            className="category-badge"
                            style={{ backgroundColor: getCategoryColor(technology.category) }}
                        >
                            {technology.category}
                        </span>
                    </div>
                    <div 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(technology.status) }}
                    >
                        {getStatusText(technology.status)}
                    </div>
                </div>
                
                <p className="description">{technology.description}</p>
                
                <div className="card-controls">
                    <div className="status-controls">
                        <button 
                            onClick={() => onStatusChange(technology.id, 'not-started')}
                            className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
                            title="Не начато"
                        >
                            ○
                        </button>
                        <button 
                            onClick={() => onStatusChange(technology.id, 'in-progress')}
                            className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
                            title="В процессе"
                        >
                            ⏳
                        </button>
                        <button 
                            onClick={() => onStatusChange(technology.id, 'completed')}
                            className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
                            title="Завершено"
                        >
                            ✓
                        </button>
                    </div>
                    
                    <button 
                        className="edit-btn"
                        onClick={() => setIsModalOpen(true)}
                        title="Редактировать"
                    >
                        ✎
                    </button>
                </div>

                <TechnologyNotes 
                    notes={technology.notes}
                    onNotesChange={onNotesChange}
                    techId={technology.id}
                />
            </div>

            <TechnologyModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                technology={technology}
                onStatusChange={onStatusChange}
                onNotesChange={onNotesChange}
            />
        </>
    );
}

export default TechnologyCard;