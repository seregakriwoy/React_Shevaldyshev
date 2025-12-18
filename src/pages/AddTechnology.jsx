import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';

function AddTechnology() {
    const navigate = useNavigate();
    const { addTechnology } = useTechnologies();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        notes: ''
    });

    const categories = ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            alert('Пожалуйста, введите название технологии');
            return;
        }

        if (!formData.description.trim()) {
            alert('Пожалуйста, введите описание технологии');
            return;
        }

        addTechnology(formData);
        
        // Показать уведомление об успехе
        alert('Технология успешно добавлена!');
        
        // Перенаправить на список технологий
        navigate('/technologies');
    };

    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            category: 'frontend',
            notes: ''
        });
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добавить новую технологию</h1>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="technology-form">
                    <div className="form-section">
                        <h3>Основная информация</h3>
                        
                        <div className="form-group">
                            <label htmlFor="title">
                                Название технологии *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Например: React, Node.js, Docker"
                                required
                                className="form-input"
                            />
                            <div className="form-hint">
                                Укажите название технологии, которое вы хотите изучить
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Описание *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Опишите, что это за технология и что вы планируете изучить..."
                                rows="4"
                                required
                                className="form-textarea"
                            />
                            <div className="form-hint">
                                Опишите цели изучения и ключевые аспекты технологии
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">
                                Категория
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-select"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'frontend' ? 'Frontend' :
                                         category === 'backend' ? 'Backend' :
                                         category === 'database' ? 'Базы данных' :
                                         category === 'devops' ? 'DevOps' :
                                         category === 'mobile' ? 'Мобильная разработка' : 'Другое'}
                                    </option>
                                ))}
                            </select>
                            <div className="form-hint">
                                Выберите категорию для лучшей организации
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Дополнительная информация</h3>
                        
                        <div className="form-group">
                            <label htmlFor="notes">
                                Предварительные заметки
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Можете добавить начальные заметки, ссылки на ресурсы или план изучения..."
                                rows="6"
                                className="form-textarea"
                            />
                            <div className="form-hint">
                                {formData.notes.length} символов
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Предпросмотр</h3>
                        <div className="form-preview">
                            <div className="preview-card">
                                <div className="preview-header">
                                    <h4>{formData.title || 'Название технологии'}</h4>
                                    <span className="preview-status">Не начато</span>
                                </div>
                                <p className="preview-description">
                                    {formData.description || 'Описание технологии появится здесь'}
                                </p>
                                <div className="preview-footer">
                                    <span className="preview-category">
                                        {formData.category === 'frontend' ? 'Frontend' :
                                         formData.category === 'backend' ? 'Backend' :
                                         formData.category === 'database' ? 'Базы данных' :
                                         formData.category === 'devops' ? 'DevOps' :
                                         formData.category === 'mobile' ? 'Мобильная разработка' : 'Другое'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline"
                        >
                            Очистить форму
                        </button>
                        
                        <div className="action-buttons">
                            <button
                                type="button"
                                onClick={() => navigate('/technologies')}
                                className="btn btn-outline"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Добавить технологию
                            </button>
                        </div>
                    </div>

                    <div className="form-footer">
                        <p className="form-note">
                            * Поля, обязательные для заполнения
                        </p>
                        <p className="form-note">
                            После добавления вы сможете отслеживать прогресс изучения,
                            добавлять заметки и изменять статус технологии.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTechnology;