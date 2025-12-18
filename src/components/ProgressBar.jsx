function ProgressBar({ 
    progress, 
    label = "Прогресс", 
    color = "#4CAF50", 
    animated = true,
    height = 20,
    showPercentage = true
}) {
    return (
        <div className="progress-bar-container">
            <div className="progress-bar-header">
                <span className="progress-bar-label">{label}</span>
                {showPercentage && (
                    <span className="progress-bar-percentage">{progress}%</span>
                )}
            </div>
            
            <div 
                className="progress-bar-track" 
                style={{ height: `${height}px` }}
            >
                <div 
                    className={`progress-bar-fill ${animated ? 'animated' : ''}`}
                    style={{ 
                        width: `${progress}%`,
                        backgroundColor: color
                    }}
                />
            </div>
            
            <div className="progress-bar-stats">
                <span className="progress-bar-text">
                    Прогресс: {progress}% завершено
                </span>
            </div>
        </div>
    );
}

export default ProgressBar;