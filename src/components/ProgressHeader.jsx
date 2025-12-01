import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  // Расчет статистики
  const totalCount = technologies.length;
  const completedCount = technologies.filter(tech => tech.status === 'completed').length;
  const inProgressCount = technologies.filter(tech => tech.status === 'in-progress').length;
  const notStartedCount = technologies.filter(tech => tech.status === 'not_started').length;
  
  // Расчет процента выполнения
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  
  // Определение уровня прогресса для стилизации
  const getProgressLevel = () => {
    if (completionPercentage === 0) return 'not-started';
    if (completionPercentage === 100) return 'completed';
    if (completionPercentage >= 50) return 'in-progress';
    return 'low';
  };

  // Сообщения в зависимости от прогресса
  const getProgressMessage = () => {
    if (completionPercentage === 0) return 'Давайте начнем изучение! 🚀';
    if (completionPercentage === 100) return 'Поздравляем! Все технологии изучены! 🎉';
    if (completionPercentage >= 70) return 'Отличный прогресс! Продолжайте в том же духе! 💪';
    if (completionPercentage >= 40) return 'Хорошие результаты! Двигайтесь дальше! 👍';
    return 'Начало положено! Не останавливайтесь! 👏';
  };

  return (
    <div className="progress-header">
      <div className="progress-header__stats">
        <div className="stat-item">
          <span className="stat-number">{totalCount}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number completed">{completedCount}</span>
          <span className="stat-label">Изучено</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number in-progress">{inProgressCount}</span>
          <span className="stat-label">В процессе</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-number not-started">{notStartedCount}</span>
          <span className="stat-label">Осталось</span>
        </div>
      </div>

      <div className="progress-header__main">
        <div className="progress-info">
          <h3>Общий прогресс изучения</h3>
          <p className="progress-message">{getProgressMessage()}</p>
        </div>
        
        <div className="progress-percentage">
          <span className="percentage-value">{completionPercentage}%</span>
        </div>
      </div>

      <div className="progress-header__bar">
        <div className="progress-track">
          <div 
            className={`progress-fill progress-fill--${getProgressLevel()}`}
            style={{width: `${completionPercentage}%` }}
          >
            <div className="progress-glow"></div>
          </div>
        </div>
        
        <div className="progress-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Условный рендеринг для разных состояний */}
      {completionPercentage === 0 && (
        <div className="progress-tip tip-not-started">
          💡 Совет: Начните с первой технологии чтобы сделать первый шаг!
        </div>
      )}
      
      {completionPercentage > 0 && completionPercentage < 100 && (
        <div className="progress-tip tip-in-progress">
          💡 Совет: Сосредоточьтесь на технологии со статусом "В процессе"
        </div>
      )}
      
      {completionPercentage === 100 && (
        <div className="progress-tip tip-completed">
          🎊 Отлично! Вы освоили все технологии! Можете переходить к следующему уровню
        </div>
      )}
    </div>
  );
}

export default ProgressHeader;