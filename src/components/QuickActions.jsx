import { useState } from 'react';

function QuickActions({ 
    onMarkAllCompleted, 
    onResetAll, 
    onExportData,
    technologies = []
}) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionType, setActionType] = useState('');

    const handleMarkAllCompleted = () => {
        setActionType('markAll');
        setShowConfirm(true);
    };

    const handleResetAll = () => {
        setActionType('resetAll');
        setShowConfirm(true);
    };

    const confirmAction = () => {
        if (actionType === 'markAll') {
            onMarkAllCompleted();
        } else if (actionType === 'resetAll') {
            onResetAll();
        }
        setShowConfirm(false);
    };

    const cancelAction = () => {
        setShowConfirm(false);
    };

    const getCompletedCount = () => {
        return technologies.filter(tech => tech.status === 'completed').length;
    };

    const getInProgressCount = () => {
        return technologies.filter(tech => tech.status === 'in-progress').length;
    };

    return (
        <div className="quick-actions">
            <div className="actions-header">
                <h3>Быстрые действия</h3>
                <div className="actions-stats">
                    <span className="stat-item">
                        ✅ {getCompletedCount()} завершено
                    </span>
                    <span className="stat-item">
                        ⏳ {getInProgressCount()} в процессе
                    </span>
                </div>
            </div>
            
            <div className="actions-buttons">
                <button 
                    className="action-btn mark-all-btn"
                    onClick={handleMarkAllCompleted}
                    title="Отметить все технологии как завершенные"
                >
                    <span className="action-icon">✓</span>
                    <span className="action-text">Завершить все</span>
                </button>
                
                <button 
                    className="action-btn reset-btn"
                    onClick={handleResetAll}
                    title="Сбросить статусы всех технологий"
                >
                    <span className="action-icon">↺</span>
                    <span className="action-text">Сбросить все</span>
                </button>
                
                <button 
                    className="action-btn export-btn"
                    onClick={onExportData}
                    title="Экспортировать данные в JSON файл"
                >
                    <span className="action-icon">📥</span>
                    <span className="action-text">Экспорт данных</span>
                </button>
            </div>

            {/* Модальное окно подтверждения */}
            {showConfirm && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal">
                        <h4>Подтверждение действия</h4>
                        <p>
                            {actionType === 'markAll' 
                                ? 'Вы уверены, что хотите отметить все технологии как завершенные?'
                                : 'Вы уверены, что хотите сбросить статусы всех технологий?'
                            }
                        </p>
                        <div className="confirm-modal-buttons">
                            <button 
                                className="confirm-btn cancel-btn"
                                onClick={cancelAction}
                            >
                                Отмена
                            </button>
                            <button 
                                className="confirm-btn proceed-btn"
                                onClick={confirmAction}
                            >
                                Подтвердить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuickActions;