import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        id="todo-input"
        type="text"
        className="todo-input"
        placeholder="새로운 할 일을 입력하세요..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button id="todo-add-btn" type="submit" className="btn btn-primary">
        추가
      </button>
    </form>
  );
}
