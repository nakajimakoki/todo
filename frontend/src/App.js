// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import './App.css'; // CSSを読み込み

function App() {
  const [todos, setTodos] = useState([]);

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

  return (
    <div className="todo-container">
      <h1 className="todo-title">📝 Todo一覧</h1>
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