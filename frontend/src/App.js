// frontend/src/App.js
import React, { useEffect, useState } from "react";
import "./App.css"; // CSSを読み込み

function App() {
  const [todos, setTodos] = useState([]); // 一覧の状態
  const [newTodo, setNewTodo] = useState(""); // 入力欄用の状態
  const [editingId, setEditingId] = useState(null); // 編集中のTodo ID
  const [editingText, setEditingText] = useState(""); // 編集用テキスト

  // 初回に一覧を取得
  useEffect(() => {
    fetch("http://localhost:8080/todos")
      .then((res) => {
        if (!res.ok) throw new Error("データ取得に失敗しました");
        return res.json(); // JSONとしてパース
      })
      .then(setTodos) // 一覧を状態にセット
      .catch(console.error); // エラー時はコンソールに出力
  }, []);

  // Todo追加処理
  const handleAddTodo = () => {
    if (!newTodo.trim()) return; // 空白だけなら何もしない

    const todoToAdd = { title: newTodo, completed: false }; // 新規オブジェクト

    fetch("http://localhost:8080/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoToAdd),
    })
      .then((res) => {
        if (!res.ok) throw new Error("追加に失敗しました");
        return res.json(); // サーバーから返されたオブジェクトをJSONで取得
      })
      .then((saved) => {
        setTodos((prev) => [...prev, saved]); //「今の状態（prev）」を引数として受け取り、それを元に新しい状態を返す（関数型更新）
        setNewTodo(""); // 入力欄をリセット
      })
      .catch(console.error);
  };

  // 完了状態を切り替える処理（取り消し線）
  const handleToggle = (todo) => {
    const updated = { ...todo, completed: !todo.completed }; // completedを反転した新しいオブジェクト

    fetch(`http://localhost:8080/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) throw new Error("更新に失敗しました");
        return res.json(); // 更新後のオブジェクトを取得
      })
      .then((updatedTodo) => {
        setTodos(
          (prev) => prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)) // idが一致したものだけ差し替え
        );
      })
      .catch(console.error); // エラーがあれば表示
  };

  // 削除処理
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("削除に失敗しました");
        // 削除成功時：対象のオブジェクトをstateから除外
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      })
      .catch(console.error);
  };

  // 編集処理
  const handleUpdate = (id) => {
    fetch(`http://localhost:8080/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editingText,
        completed: todos.find((t) => t.id === id).completed,
      }),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
        setEditingId(null);
        setEditingText("");
      });
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
          onChange={(e) => setNewTodo(e.target.value)} // 入力値の更新
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
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => handleUpdate(todo.id)}>保存</button>
                <button onClick={() => setEditingId(null)}>キャンセル</button>
              </>
            ) : (
              <>
                <span>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                  />
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      marginLeft: "8px",
                    }}
                  >
                    {todo.title}
                  </span>
                </span>
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditingText(todo.title);
                  }}
                >
                  編集
                </button>
                <button onClick={() => handleDelete(todo.id)}>削除</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
