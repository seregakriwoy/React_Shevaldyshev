import './TechnologyCard.css';

function TechnologyCard({ title, description, status }) {

    const progressWidths = {
        'completed': '100%',
        'in-progress': '50%',
        'not-started': '0%'
    };

    const statusIcons = {
        'completed': '✅',
        'in-progress': '🔄',
        'not-started': '⭕️'
    };

    const metaIcons = {
        'completed': '📚',
        'in-progress': '✍️',
        'not-started': '📖'
    };

    return (
        <div className={`technology - card technology-card--${status}`}>
            <h3 className="technology-card__title">
                <span className="status-icon">
                    {statusIcons[status]}
                </span>
                {title}
            </h3>

            <p className="technology-card__description">{description}</p>

            <div className="progress-indicator">
                <div className="progress-bar">
                    <div
                        className={`progress-fill progress-fill--${status}`}
                        style={{ width: progressWidths[status] }}
                    ></div>
                </div>
                <span className="progress-text">
                    {progressWidths[status]}
                </span>
            </div >

            <div className="technology-card__meta">
                <small>Прогресс изучения</small>
                <span className="status-icon">
                    {metaIcons[status]}
                </span>
            </div>
        </div >
    );
}

export default TechnologyCard;