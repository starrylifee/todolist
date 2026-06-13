import { useState } from 'react';

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') handleCancelEdit();
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-checkbox-wrapper">
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
        />
        <label htmlFor={`todo-check-${todo.id}`} className="todo-checkbox-label"></label>
      </div>

      {isEditing ? (
        <div className="todo-edit-wrapper">
          <input
            id={`todo-edit-${todo.id}`}
            type="text"
            className="todo-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button className="btn btn-sm btn-primary" onClick={handleSaveEdit}>
            저장
          </button>
          <button className="btn btn-sm btn-ghost" onClick={handleCancelEdit}>
            취소
          </button>
        </div>
      ) : (
        <>
          <span className="todo-title" onDoubleClick={() => setIsEditing(true)}>
            {todo.title}
          </span>
          <div className="todo-actions">
            <button
              id={`todo-edit-btn-${todo.id}`}
              className="btn btn-icon"
              onClick={() => setIsEditing(true)}
              title="수정"
            >
              ✏️
            </button>
            <button
              id={`todo-delete-btn-${todo.id}`}
              className="btn btn-icon btn-danger"
              onClick={() => onDelete(todo.id)}
              title="삭제"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </li>
  );
}
