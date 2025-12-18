import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const navigate = useNavigate();
    
    // Состояния для настроек
    const [settings, setSettings] = useState({
        theme: localStorage.getItem('appTheme') || 'light',
        language: localStorage.getItem('appLanguage') || 'ru',
        notifications: localStorage.getItem('notifications') !== 'false',
        autoSave: localStorage.getItem('autoSave') !== 'false',
        dataRetention: localStorage.getItem('dataRetention') || '30',
        exportFormat: localStorage.getItem('exportFormat') || 'json'
    });

    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showExportConfirm, setShowExportConfirm] = useState(false);
    const [importFile, setImportFile] = useState(null);

    const handleSettingChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        
        // Сохраняем в localStorage
        localStorage.setItem(`app${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
        
        // Применяем тему немедленно
        if (key === 'theme') {
            document.documentElement.setAttribute('data-theme', value);
        }
    };

    const handleResetData = () => {
        if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies');
            localStorage.removeItem('techTrackerData');
            alert('Все данные сброшены. Приложение будет перезагружено.');
            window.location.reload();
        }
    };

    const handleExportData = () => {
        const technologies = JSON.parse(localStorage.getItem('technologies') || '[]');
        const dataStr = JSON.stringify(technologies, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `technologies-backup-${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        setShowExportConfirm(false);
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                // Проверяем структуру данных
                if (Array.isArray(data) && data.every(item => item.title && item.id)) {
                    if (window.confirm(`Найдено ${data.length} технологий. Импортировать?`)) {
                        localStorage.setItem('technologies', JSON.stringify(data));
                        alert('Данные успешно импортированы!');
                        navigate('/technologies');
                    }
                } else {
                    alert('Неверный формат файла. Ожидается массив технологий.');
                }
            } catch (error) {
                alert('Ошибка при чтении файла: ' + error.message);
            }
        };
        reader.readAsText(file);
        setImportFile(null);
    };

    const handleClearCache = () => {
        if (window.confirm('Очистить кэш приложения?')) {
            localStorage.removeItem('technologies');
            localStorage.removeItem('techTrackerData');
            alert('Кэш очищен. Данные о технологиях сохранены.');
        }
    };

    const handleResetSettings = () => {
        if (window.confirm('Сбросить все настройки к значениям по умолчанию?')) {
            localStorage.clear();
            alert('Настройки сброшены. Страница будет перезагружена.');
            window.location.reload();
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Настройки приложения</h1>
                <p>Настройте внешний вид и поведение трекера технологий</p>
            </div>

            <div className="settings-grid">
                {/* Внешний вид */}
                <div className="settings-section">
                    <h3>Внешний вид</h3>
                    <div className="settings-group">
                        <label>Тема оформления</label>
                        <div className="theme-selector">
                            {['light', 'dark', 'auto'].map(theme => (
                                <button
                                    key={theme}
                                    className={`theme-option ${settings.theme === theme ? 'active' : ''}`}
                                    onClick={() => handleSettingChange('theme', theme)}
                                >
                                    <div className={`theme-preview theme-${theme}`}>
                                        <div className="theme-sample"></div>
                                    </div>
                                    <span className="theme-label">
                                        {theme === 'light' ? 'Светлая' :
                                         theme === 'dark' ? 'Темная' : 'Авто'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="settings-group">
                        <label>Язык интерфейса</label>
                        <select
                            value={settings.language}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                            className="settings-select"
                        >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>

                {/* Поведение приложения */}
                <div className="settings-section">
                    <h3>Поведение приложения</h3>
                    
                    <div className="settings-group">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.autoSave}
                                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                            />
                            <span className="slider"></span>
                            <span className="switch-label">Автосохранение</span>
                        </label>
                        <div className="settings-hint">
                            Автоматически сохранять изменения
                        </div>
                    </div>

                    <div className="settings-group">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                            />
                            <span className="slider"></span>
                            <span className="switch-label">Уведомления</span>
                        </label>
                        <div className="settings-hint">
                            Показывать уведомления о действиях
                        </div>
                    </div>

                    <div className="settings-group">
                        <label>Сохранение данных</label>
                        <select
                            value={settings.dataRetention}
                            onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
                            className="settings-select"
                        >
                            <option value="7">7 дней</option>
                            <option value="30">30 дней</option>
                            <option value="90">90 дней</option>
                            <option value="365">1 год</option>
                            <option value="forever">Навсегда</option>
                        </select>
                        <div className="settings-hint">
                            Как долго хранить историю изменений
                        </div>
                    </div>
                </div>

                {/* Управление данными */}
                <div className="settings-section">
                    <h3>Управление данными</h3>
                    
                    <div className="settings-group">
                        <label>Формат экспорта</label>
                        <select
                            value={settings.exportFormat}
                            onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                            className="settings-select"
                        >
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                            <option value="txt">Текстовый файл</option>
                        </select>
                    </div>

                    <div className="data-actions">
                        <button
                            className="btn btn-outline"
                            onClick={() => setShowExportConfirm(true)}
                        >
                            Экспорт данных
                        </button>
                        
                        <label className="btn btn-outline file-input-label">
                            Импорт данных
                            <input
                                type="file"
                                accept=".json,.csv,.txt"
                                onChange={handleImportData}
                                style={{ display: 'none' }}
                            />
                        </label>
                        
                        <button
                            className="btn btn-outline"
                            onClick={handleClearCache}
                        >
                            Очистить кэш
                        </button>
                    </div>
                </div>

                {/* Опасные действия */}
                <div className="settings-section danger-zone">
                    <h3>Опасная зона</h3>
                    <div className="danger-actions">
                        <div className="danger-warning">
                            ⚠️ Эти действия нельзя отменить
                        </div>
                        
                        <button
                            className="btn btn-danger"
                            onClick={handleResetSettings}
                        >
                            Сбросить все настройки
                        </button>
                        
                        <button
                            className="btn btn-danger"
                            onClick={handleResetData}
                        >
                            Удалить все данные
                        </button>
                    </div>
                </div>
            </div>

            {/* Информация о приложении */}
            <div className="app-info">
                <h3>О приложении</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Версия:</span>
                        <span className="info-value">1.0.0</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Разработчик:</span>
                        <span className="info-value">Трекер Технологий</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Лицензия:</span>
                        <span className="info-value">MIT</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Данные:</span>
                        <span className="info-value">
                            {JSON.parse(localStorage.getItem('technologies') || '[]').length} технологий
                        </span>
                    </div>
                </div>
            </div>

            {/* Модальное окно подтверждения экспорта */}
            {showExportConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Экспорт данных</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowExportConfirm(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Вы уверены, что хотите экспортировать все данные о технологиях?</p>
                            <div className="export-options">
                                <div className="export-option">
                                    <input 
                                        type="radio" 
                                        id="export-json" 
                                        name="export-type" 
                                        defaultChecked 
                                    />
                                    <label htmlFor="export-json">JSON формат (рекомендуется)</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-outline"
                                onClick={() => setShowExportConfirm(false)}
                            >
                                Отмена
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={handleExportData}
                            >
                                Экспортировать
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="settings-footer">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/')}
                >
                    Сохранить и выйти
                </button>
            </div>
        </div>
    );
}

export default Settings;