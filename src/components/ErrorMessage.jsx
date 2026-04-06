import React from 'react';

export default function ErrorMessage({ onRetry }) {
  return (
    <div className="text-center" style={{ padding: '20px 0' }}>
      <p>Произошла ошибка при загрузке данных. Проверьте подключение к сети.</p>
      {onRetry && (
        <button className="btn btn-outline-primary" onClick={onRetry}>
          Повторить запрос
        </button>
      )}
    </div>
  );
}