// src/components/DataManager.jsx
import { useState, useRef } from 'react';

function DataManager({ technologies, onImport, onExport }) {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importError, setImportError] = useState(null);
    const [importSuccess, setImportSuccess] = useState(null);
    const fileInputRef = useRef(null);

    const validateTechnology = (tech) => {
        const requiredFields = ['id', 'title', 'category', 'status'];
        const optionalFields = ['description', 'notes', 'resources', 'createdAt'];
        
        // Проверяем обязательные поля
        for (const field of requiredFields) {
            if (!tech.hasOwnProperty(field)) {
                return { valid: false, error: `Отсутствует обязательное поле: ${field}` };
            }
            
            if (field === 'id' && (typeof tech.id !== 'number' || tech.id <= 0)) {
                return { valid: false, error: 'Некорректный ID' };
            }
            
            if (field === 'title' && (typeof tech.title !== 'string' || tech.title.trim().length === 0)) {
                return { valid: false, error: 'Некорректное название' };
            }
            
            if (field === 'status' && !['not-started', 'in-progress', 'completed'].includes(tech.status)) {
                return { valid: false, error: 'Некорректный статус' };
            }
        }
        
        // Проверяем типы данных для опциональных полей
        if (tech.description && typeof tech.description !== 'string') {
            return { valid: false, error: 'Некорректное описание' };
        }
        
        if (tech.notes && typeof tech.notes !== 'string') {
            return { valid: false, error: 'Некорректные заметки' };
        }
        
        if (tech.resources && (!Array.isArray(tech.resources) || !tech.resources.every(r => typeof r === 'string'))) {
            return { valid: false, error: 'Некорректные ресурсы' };
        }
        
        if (tech.createdAt && isNaN(Date.parse(tech.createdAt))) {
            return { valid: false, error: 'Некорректная дата создания' };
        }
        
        return { valid: true };
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            setImportError(null);
            
            // Создаем структуру данных для экспорта
            const exportData = {
                version: '1.0.0',
                exportedAt: new Date().toISOString(),
                technologies: technologies.map(tech => ({
                    id: tech.id,
                    title: tech.title,
                    description: tech.description || '',
                    category: tech.category,
                    status: tech.status,
                    notes: tech.notes || '',
                    resources: tech.resources || [],
                    difficulty: tech.difficulty || 'beginner',
                    createdAt: tech.createdAt || new Date().toISOString(),
                    lastModified: new Date().toISOString()
                })),
                metadata: {
                    totalTechnologies: technologies.length,
                    completed: technologies.filter(t => t.status === 'completed').length,
                    inProgress: technologies.filter(t => t.status === 'in-progress').length,
                    notStarted: technologies.filter(t => t.status === 'not-started').length
                }
            };

            // Валидация перед экспортом
            for (const tech of exportData.technologies) {
                const validation = validateTechnology(tech);
                if (!validation.valid) {
                    throw new Error(`Ошибка валидации технологии "${tech.title}": ${validation.error}`);
                }
            }

            // Создаем JSON строку с отступами
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Проверяем, что JSON валидный
            JSON.parse(jsonString);
            
            // Создаем Blob и ссылку для скачивания
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `technologies-export-${new Date().toISOString().split('T')[0]}.json`;
            
            // Добавляем accessibility атрибуты
            link.setAttribute('aria-label', 'Скачать файл экспорта данных технологий');
            link.setAttribute('role', 'button');
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Освобождаем URL
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            // Показываем успешное сообщение
            setImportSuccess({
                type: 'export',
                message: `Успешно экспортировано ${technologies.length} технологий`
            });
            
            setTimeout(() => setImportSuccess(null), 5000);
            
            if (onExport) {
                onExport(exportData);
            }
            
        } catch (error) {
            console.error('Export error:', error);
            setImportError(`Ошибка экспорта: ${error.message}`);
            
            setTimeout(() => setImportError(null), 5000);
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            setIsImporting(true);
            setImportError(null);
            setImportSuccess(null);
            
            // Проверяем тип файла
            if (!file.name.endsWith('.json')) {
                throw new Error('Файл должен быть в формате JSON');
            }
            
            // Читаем файл
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const content = e.target.result;
                    
                    // Парсим JSON
                    let parsedData;
                    try {
                        parsedData = JSON.parse(content);
                    } catch (parseError) {
                        throw new Error('Неверный формат JSON файла');
                    }
                    
                    // Валидация структуры данных
                    if (!parsedData.technologies || !Array.isArray(parsedData.technologies)) {
                        throw new Error('Файл должен содержать массив technologies');
                    }
                    
                    // Валидируем каждую технологию
                    const validTechnologies = [];
                    const validationErrors = [];
                    
                    for (let i = 0; i < parsedData.technologies.length; i++) {
                        const tech = parsedData.technologies[i];
                        const validation = validateTechnology(tech);
                        
                        if (validation.valid) {
                            validTechnologies.push(tech);
                        } else {
                            validationErrors.push({
                                index: i,
                                title: tech.title || `Элемент ${i}`,
                                error: validation.error
                            });
                        }
                    }
                    
                    if (validTechnologies.length === 0) {
                        throw new Error('Не найдено валидных технологий для импорта');
                    }
                    
                    // Показываем предупреждение если есть ошибки валидации
                    if (validationErrors.length > 0) {
                        const errorMessage = `Найдено ${validationErrors.length} ошибок в данных. ` +
                                           `Будет импортировано ${validTechnologies.length} валидных технологий.`;
                        
                        if (!window.confirm(errorMessage + '\n\nПродолжить импорт?')) {
                            setIsImporting(false);
                            return;
                        }
                    }
                    
                    // Импортируем данные
                    if (onImport) {
                        const result = await onImport(validTechnologies);
                        
                        setImportSuccess({
                            type: 'import',
                            message: `Успешно импортировано ${validTechnologies.length} технологий`,
                            details: validationErrors.length > 0 ? 
                                `(пропущено ${validationErrors.length} с ошибками)` : ''
                        });
                        
                        // Показываем детали ошибок если есть
                        if (validationErrors.length > 0) {
                            console.warn('Validation errors:', validationErrors);
                        }
                    }
                    
                    // Сбрасываем input файла
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    
                } catch (error) {
                    setImportError(`Ошибка импорта: ${error.message}`);
                } finally {
                    setIsImporting(false);
                    
                    // Очищаем сообщения через 5 секунд
                    setTimeout(() => {
                        setImportError(null);
                        setImportSuccess(null);
                    }, 5000);
                }
            };
            
            reader.onerror = () => {
                setImportError('Ошибка чтения файла');
                setIsImporting(false);
            };
            
            reader.readAsText(file);
            
        } catch (error) {
            setImportError(`Ошибка: ${error.message}`);
            setIsImporting(false);
        }
    };

    const handleExampleExport = () => {
        const exampleData = {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            technologies: [
                {
                    id: 1,
                    title: 'Пример технологии',
                    description: 'Это пример технологии для импорта',
                    category: 'frontend',
                    status: 'not-started',
                    notes: 'Пример заметки',
                    resources: ['https://example.com'],
                    difficulty: 'beginner',
                    createdAt: new Date().toISOString()
                }
            ]
        };
        
        const jsonString = JSON.stringify(exampleData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'example-import-template.json';
        link.setAttribute('aria-label', 'Скачать пример файла для импорта');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const handleKeyDown = (e) => {
        // Навигация по кнопкам
        if (e.key === 'Tab' && e.target.className.includes('export-btn') && !e.shiftKey) {
            e.preventDefault();
            fileInputRef.current?.focus();
        }
        
        if (e.key === 'Tab' && e.target === fileInputRef.current && e.shiftKey) {
            e.preventDefault();
            document.querySelector('.export-btn').focus();
        }
    };

    return (
        <div 
            className="data-manager"
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Управление данными"
        >
            <h3>Экспорт и импорт данных</h3>
            
            {importError && (
                <div 
                    className="error-message alert"
                    role="alert"
                    aria-live="assertive"
                >
                    ⚠️ {importError}
                </div>
            )}
            
            {importSuccess && (
                <div 
                    className="success-message alert"
                    role="status"
                    aria-live="polite"
                >
                    ✅ {importSuccess.message} {importSuccess.details || ''}
                </div>
            )}
            
            <div className="data-actions">
                <div className="export-section">
                    <h4>Экспорт данных</h4>
                    <p className="section-description">
                        Скачайте все ваши технологии в JSON файл
                    </p>
                    <button
                        onClick={handleExport}
                        disabled={isExporting || technologies.length === 0}
                        className="btn btn-primary export-btn"
                        aria-busy={isExporting}
                        aria-describedby="export-description"
                    >
                        {isExporting ? 'Экспорт...' : `Экспорт (${technologies.length})`}
                    </button>
                    <p id="export-description" className="action-hint">
                        Будет создан валидный JSON файл со всеми технологиями
                    </p>
                </div>
                
                <div className="import-section">
                    <h4>Импорт данных</h4>
                    <p className="section-description">
                        Загрузите технологии из JSON файла
                    </p>
                    
                    <div className="import-buttons">
                        <button
                            onClick={handleExampleExport}
                            className="btn btn-outline example-btn"
                            aria-label="Скачать пример файла для импорта"
                        >
                            📋 Пример файла
                        </button>
                        
                        <label className="file-input-label">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                disabled={isImporting}
                                aria-label="Выберите JSON файл для импорта"
                                aria-describedby="import-description"
                                style={{ display: 'none' }}
                            />
                            <span className="btn btn-primary">
                                {isImporting ? 'Импорт...' : 'Выбрать файл'}
                            </span>
                        </label>
                    </div>
                    
                    <p id="import-description" className="action-hint">
                        Поддерживается только JSON формат с валидной структурой
                    </p>
                    
                    <div className="import-requirements">
                        <h5>Требования к файлу:</h5>
                        <ul aria-label="Требования к файлу импорта">
                            <li>Формат JSON с кодировкой UTF-8</li>
                            <li>Обязательные поля: id, title, category, status</li>
                            <li>Статусы: not-started, in-progress, completed</li>
                            <li>ID должны быть положительными числами</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="data-stats">
                <h5>Статистика данных:</h5>
                <div className="stats-grid" role="grid">
                    <div className="stat-item" role="gridcell">
                        <span className="stat-label">Всего технологий:</span>
                        <span className="stat-value">{technologies.length}</span>
                    </div>
                    <div className="stat-item" role="gridcell">
                        <span className="stat-label">Завершено:</span>
                        <span className="stat-value">
                            {technologies.filter(t => t.status === 'completed').length}
                        </span>
                    </div>
                    <div className="stat-item" role="gridcell">
                        <span className="stat-label">В процессе:</span>
                        <span className="stat-value">
                            {technologies.filter(t => t.status === 'in-progress').length}
                        </span>
                    </div>
                    <div className="stat-item" role="gridcell">
                        <span className="stat-label">Не начато:</span>
                        <span className="stat-value">
                            {technologies.filter(t => t.status === 'not-started').length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataManager;