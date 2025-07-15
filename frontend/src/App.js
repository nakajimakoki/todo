// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import './App.css'; // CSSを読み込み

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(''); // ① 入力欄用の状態

  // 初回にToDo一覧を取得
  useEffect(() => {
    fetch('http://localhost:8080/todos')
      .then(res => {
        if (!res.ok) throw new Error('データ取得に失敗しました');
        return res.json();
      })
      .then(setTodos)
      .catch(console.error);
  }, []);

  // ToDo追加処理
  const handleAddTodo = () => {
    if (!newTodo.trim()) return;

    const todoToAdd = { title: newTodo, completed: false };

    fetch('http://localhost:8080/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoToAdd),
    })
      .then(res => {
        if (!res.ok) throw new Error('追加に失敗しました');
        return res.json();
      })
      .then(saved => {
        setTodos(prev => [...prev, saved]);
        setNewTodo('');
      })
      .catch(console.error);
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">📝 Todo一覧</h1>

      <div className="todo-input-group">
        <input
          type="text"
          placeholder="新しいToDoを入力"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          className="todo-input"
        />
        <button
          onClick={handleAddTodo}
          className="todo-add-button"
          disabled={!newTodo.trim()}
        >
          追加
        </button>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <span>{todo.title}</span>
            <span className="todo-status">
              {todo.completed ? '✅' : '❌'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;