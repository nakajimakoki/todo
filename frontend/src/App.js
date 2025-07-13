// frontend/src/App.js
import React, { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/todos')
      .then(response => {
        if (!response.ok) {
          throw new Error('データ取得に失敗しました!!!!!!!!!!!!!!!);
        }
        return response.json();
      })
      .then(data => setTodos(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Todo一覧</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;