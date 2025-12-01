import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, onRandomNext }) {
  return (
    <div className="quick-actions">
      <h2>Быстрые действия</h2>
      <div className="quick-actions-buttons">
        <button 
          className="quick-action-button quick-action-button--complete"
          onClick={onMarkAllCompleted}
        >
          ✅ Отметить все как выполненные
        </button>
        
        <button 
          className="quick-action-button quick-action-button--reset"
          onClick={onResetAll}
        >
          🔄 Сбросить все статусы
        </button>
        
        <button 
          className="quick-action-button quick-action-button--random"
          onClick={onRandomNext}
        >
          🎲 Случайный выбор следующей технологии
        </button>
      </div>
    </div>
  );
}

export default QuickActions;