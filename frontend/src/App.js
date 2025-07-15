// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import './App.css'; // CSSを読み込み

function App() {
  const [todos, setTodos] = useState([]); // ToDo一覧の状態
  const [newTodo, setNewTodo] = useState(''); // ① 入力欄用の状態

  // 初回にToDo一覧を取得
  useEffect(() => {
    fetch('http://localhost:8080/todos')
      .then(res => {
        if (!res.ok) throw new Error('データ取得に失敗しました');
        return res.json(); // JSONとしてパース
      })
      .then(setTodos) // ToDo一覧を状態にセット
      .catch(console.error); // エラー時はコンソールに出力
  }, []);

  // ToDo追加処理
  const handleAddTodo = () => {
    if (!newTodo.trim()) return; // 空白だけなら何もしない

    const todoToAdd = { title: newTodo, completed: false }; // 新規ToDoオブジェクト

    fetch('http://localhost:8080/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoToAdd),
    })
      .then(res => {
        if (!res.ok) throw new Error('追加に失敗しました');
        return res.json(); // サーバーから返されたToDoをJSONで取得
      })
      .then(saved => {
        setTodos(prev => [...prev, saved]); //「今の状態（prev）」を引数として受け取り、それを元に新しい状態を返す（関数型更新）
        setNewTodo(''); // 入力欄をリセット
      })
      .catch(console.error);
  };

  // ToDoの完了状態を切り替える処理
  const handleToggle = (todo) => {
    const updated = { ...todo, completed: !todo.completed }; // completedを反転した新しいToDo

    fetch(`http://localhost:8080/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
      .then(res => {
        if (!res.ok) throw new Error('更新に失敗しました');
        return res.json(); // 更新後のToDoを取得
      })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)) // idが一致したものだけ差し替え
        );
      })
      .catch(console.error); // エラーがあれば表示
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">📝 Todo一覧</h1>

      {/* 入力フォーム */}
      <div className="todo-input-group">
        <input
          type="text"
          placeholder="新しいToDoを入力"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)} // 入力値の更新
          className="todo-input"
        />
        <button
          onClick={handleAddTodo}
          className="todo-add-button"
          disabled={!newTodo.trim()} // 空白のみの入力では無効
        >
          追加
        </button>
      </div>

      {/* ToDoリスト表示 */}
      <ul className="todo-list">
        {todos.map(todo => (
          <div key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed} // 完了状態に応じてチェック
              onChange={() => handleToggle(todo)} // チェック切り替え処理
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;