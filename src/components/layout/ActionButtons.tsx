import React from 'react';

export const ActionButtons: React.FC = () => {
  return (
    <div className="action-bar">
      <div className="inner-container">
        <button className="btn btn-primary" onClick={() => alert('Сохранено (демо)')}>
          Сохранить
        </button>
        <button className="btn" onClick={() => alert('Акцепт (демо)')}>
          Акцепт
        </button>
        <button className="btn" onClick={() => alert('Сформировать заключение (демо)')}>
          Сформировать заключение
        </button>
        <button className="btn" onClick={() => alert('Отложить (демо)')}>
          Отложить
        </button>
        <button className="btn" onClick={() => alert('Просмотр фин. отчётности (демо)')}>
          Просмотр фин. отчётности
        </button>
        <button className="btn" onClick={() => alert('Добавление фин. отчётности (демо)')}>
          Добавление фин. отчётности
        </button>
        <button className="btn btn-danger" onClick={() => alert('Закрыть (демо)')}>
          Закрыть
        </button>
      </div>
    </div>
  );
};
