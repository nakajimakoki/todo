// frontend/src/App.js
import React, { useEffect, useState } from 'react';

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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Todo一覧</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li
            key={todo.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              margin: '10px 0',
              backgroundColor: '#f9f9f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>{todo.title}</span>
            <span style={{ fontSize: '20px' }}>
              {todo.completed ? '✅' : '❌'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;