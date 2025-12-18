// src/components/DeadlineForm.jsx
import { useState, useEffect, useRef } from 'react';

function DeadlineForm({ technology, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        dailyHours: 2,
        priority: 'medium',
        reminders: true
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const firstInputRef = useRef(null);

    // Фокусируемся на первом поле при открытии формы
    useEffect(() => {
        if (firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, []);

    // Валидация в реальном времени
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        
        switch (name) {
            case 'startDate':
                if (!value) {
                    newErrors.startDate = 'Дата начала обязательна';
                } else if (new Date(value) < new Date().toISOString().split('T')[0]) {
                    newErrors.startDate = 'Дата начала не может быть в прошлом';
                } else {
                    delete newErrors.startDate;
                }
                break;
                
            case 'endDate':
                if (!value) {
                    newErrors.endDate = 'Дата окончания обязательна';
                } else if (formData.startDate && new Date(value) <= new Date(formData.startDate)) {
                    newErrors.endDate = 'Дата окончания должна быть после даты начала';
                } else {
                    delete newErrors.endDate;
                }
                break;
                
            case 'dailyHours':
                if (!value || value < 0.5 || value > 8) {
                    newErrors.dailyHours = 'Часы должны быть от 0.5 до 8 в день';
                } else {
                    delete newErrors.dailyHours;
                }
                break;
                
            default:
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: fieldValue
        }));
        
        // Валидация при изменении
        if (touched[name]) {
            validateField(name, fieldValue);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Помечаем все поля как "тронутые" для показа всех ошибок
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        
        // Валидируем все поля
        const isValid = Object.entries(formData).every(([key, value]) => {
            return validateField(key, value);
        });
        
        if (isValid && onSubmit) {
            const studyPlan = {
                ...formData,
                technologyId: technology.id,
                technologyName: technology.title,
                totalHours: calculateTotalHours(),
                createdAt: new Date().toISOString()
            };
            
            onSubmit(studyPlan);
        }
    };

    const calculateTotalHours = () => {
        if (!formData.startDate || !formData.endDate) return 0;
        
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        return days * formData.dailyHours;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return '#4caf50';
            case 'medium': return '#ff9800';
            case 'high': return '#f44336';
            default: return '#757575';
        }
    };

    const handleKeyDown = (e) => {
        // Закрытие формы по Escape
        if (e.key === 'Escape' && onCancel) {
            onCancel();
        }
        
        // Навигация между полями формы
        if (e.key === 'Tab' && !e.shiftKey && e.target.name === 'reminders') {
            e.preventDefault();
            document.querySelector('.form-actions .submit-btn').focus();
        }
    };

    return (
        <div 
            className="deadline-form-container"
            role="dialog"
            aria-labelledby="deadline-form-title"
            aria-describedby="deadline-form-description"
        >
            <div className="deadline-form">
                <div className="form-header">
                    <h2 id="deadline-form-title">Установить сроки изучения</h2>
                    <p id="deadline-form-description" className="form-description">
                        Настройте план изучения технологии <strong>{technology?.title}</strong>
                    </p>
                </div>
                
                <form 
                    onSubmit={handleSubmit}
                    onKeyDown={handleKeyDown}
                    noValidate
                    aria-label="Форма установки сроков изучения"
                >
                    <div className="form-section">
                        <h3>Сроки изучения</h3>
                        
                        <div className="form-group">
                            <label htmlFor="startDate">
                                Дата начала *
                            </label>
                            <input
                                ref={firstInputRef}
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-input ${errors.startDate ? 'error' : ''}`}
                                aria-required="true"
                                aria-invalid={!!errors.startDate}
                                aria-describedby={errors.startDate ? 'startDate-error' : undefined}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                            {errors.startDate && touched.startDate && (
                                <div 
                                    id="startDate-error" 
                                    className="error-message"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    ⚠️ {errors.startDate}
                                </div>
                            )}
                            <div className="form-hint">
                                Дата, когда вы планируете начать изучение
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="endDate">
                                Дата окончания *
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-input ${errors.endDate ? 'error' : ''}`}
                                aria-required="true"
                                aria-invalid={!!errors.endDate}
                                aria-describedby={errors.endDate ? 'endDate-error' : undefined}
                                min={formData.startDate || new Date().toISOString().split('T')[0]}
                                required
                            />
                            {errors.endDate && touched.endDate && (
                                <div 
                                    id="endDate-error" 
                                    className="error-message"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    ⚠️ {errors.endDate}
                                </div>
                            )}
                            <div className="form-hint">
                                Дата, когда вы планируете завершить изучение
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h3>Интенсивность изучения</h3>
                        
                        <div className="form-group">
                            <label htmlFor="dailyHours">
                                Часов в день *
                            </label>
                            <input
                                type="number"
                                id="dailyHours"
                                name="dailyHours"
                                value={formData.dailyHours}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-input ${errors.dailyHours ? 'error' : ''}`}
                                min="0.5"
                                max="8"
                                step="0.5"
                                aria-required="true"
                                aria-invalid={!!errors.dailyHours}
                                aria-describedby={errors.dailyHours ? 'dailyHours-error' : undefined}
                                required
                            />
                            {errors.dailyHours && touched.dailyHours && (
                                <div 
                                    id="dailyHours-error" 
                                    className="error-message"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    ⚠️ {errors.dailyHours}
                                </div>
                            )}
                            <div className="form-hint">
                                Сколько часов в день вы готовы уделять изучению (0.5-8 часов)
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="priority">
                                Приоритет
                            </label>
                            <div className="priority-buttons" role="radiogroup" aria-label="Уровень приоритета">
                                {['low', 'medium', 'high'].map((priority) => (
                                    <button
                                        key={priority}
                                        type="button"
                                        className={`priority-btn ${formData.priority === priority ? 'selected' : ''}`}
                                        style={{ 
                                            borderColor: getPriorityColor(priority),
                                            backgroundColor: formData.priority === priority ? getPriorityColor(priority) : 'white'
                                        }}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, priority }));
                                            if (touched.priority) {
                                                validateField('priority', priority);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setFormData(prev => ({ ...prev, priority }));
                                            }
                                        }}
                                        aria-checked={formData.priority === priority}
                                        role="radio"
                                        tabIndex={formData.priority === priority ? 0 : -1}
                                    >
                                        {priority === 'low' ? 'Низкий' : 
                                         priority === 'medium' ? 'Средний' : 'Высокий'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="reminders"
                                    checked={formData.reminders}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    aria-describedby="reminders-hint"
                                />
                                <span className="checkbox-custom"></span>
                                Включить напоминания
                            </label>
                            <div id="reminders-hint" className="form-hint">
                                Получать уведомления о прогрессе
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-section">
                        <h3>Сводка плана</h3>
                        <div className="plan-summary">
                            <div className="summary-item">
                                <span className="summary-label">Всего дней:</span>
                                <span className="summary-value">
                                    {formData.startDate && formData.endDate ? 
                                        Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) : 
                                        '—'}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Всего часов:</span>
                                <span className="summary-value">
                                    {calculateTotalHours().toFixed(1)} ч
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Приоритет:</span>
                                <span 
                                    className="summary-value priority-badge"
                                    style={{ backgroundColor: getPriorityColor(formData.priority) }}
                                >
                                    {formData.priority === 'low' ? 'Низкий' : 
                                     formData.priority === 'medium' ? 'Средний' : 'Высокий'}
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
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary submit-btn"
                            tabIndex="0"
                            disabled={Object.keys(errors).length > 0}
                            aria-disabled={Object.keys(errors).length > 0}
                        >
                            Сохранить план
                        </button>
                    </div>
                    
                    <div className="form-footer">
                        <p className="form-note" role="note">
                            * Обязательные поля
                        </p>
                        <p className="form-note" role="note">
                            Нажмите Escape для отмены или Tab для навигации по форме
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeadlineForm;