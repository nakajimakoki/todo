// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import './App.css'; // CSSを読み込み

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(''); // ① 入力欄用の状態

  useEffect(() => {
    fetch('http://localhost:8080/todos')
      .then(response => {
        if (!response.ok) {
          throw new Error('データ取得に失敗しました!!!!!!!!!!!!!!!');
        }
        return response.json();
      })
      .then(data => setTodos(data))
      .catch(error => console.error(error));
  }, []);

  const handleAddTodo = () => {
    if (!newTodo.trim()) return; // 空文字を追加しない
    const newItem = {
      id: Date.now(), // 一時的に時間でID生成
      title: newTodo,
      completed: false,
    };
    setTodos([...todos, newItem]);
    setNewTodo(''); // 入力欄をリセット
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
      <button onClick={handleAddTodo} className="todo-add-button">
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