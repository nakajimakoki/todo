// frontend/src/App.js
import React, { useEffect, useState } from "react";
import "./App.css"; // CSSを読み込み
import { ToastContainer } from "react-toastify";
import { toastSuccess, toastError } from "./utils/toast";
import { validateTodoInput } from "./utils/validation";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [todos, setTodos] = useState([]); // 一覧の状態
  const [newTodo, setNewTodo] = useState(""); // 入力欄用の状態
  const [editingId, setEditingId] = useState(null); // 編集中のTodo ID
  const [editingText, setEditingText] = useState(""); // 編集用テキスト

  // 初回に一覧を取得
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("http://localhost:8080/todos");
        if (!res.ok) throw new Error("データの取得に失敗しました。");
        const data = await res.json();
        setTodos(data);
        console.log("ToDo一覧を取得しました。", data);
      } catch (err) {
        console.error("ToDoの取得に失敗しました:", err);
        toastError("ToDoの取得に失敗しました。");
      }
    };
    fetchTodos();
  }, []);

  // Todo追加処理
  const handleAddTodo = async () => {
    const error = validateTodoInput(newTodo);
    if (error) {
      toastError(error);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo, completed: false }),
      });

      if (!res.ok) throw new Error("追加に失敗しました。");

      const saved = await res.json();
      setTodos((prev) => [...prev, saved]);
      setNewTodo("");
      toastSuccess("Todoを追加しました。");
      console.log("追加成功", saved);
    } catch (error) {
      console.error(error);
      toastError("Todoの追加に失敗しました。");
    }
  };

  // 完了状態を切り替える処理（取り消し線）
  const handleToggle = async (todo) => {
    const updated = { ...todo, completed: !todo.completed }; // completedを反転した新しいオブジェクト

    try {
      const res = await fetch(`http://localhost:8080/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }

      const updatedTodo = await res.json();

      setTodos(
        (prev) => prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)) // idが一致したものだけ差し替え
      );
      console.log(
        `ToDo ID ${todo.id} の完了状態を ${
          updated.completed ? "完了" : "未完了"
        } に変更`
      );
    } catch (error) {
      console.error(error);
      toastError("完了状態の更新に失敗しました");
    }
  };

  // 削除処理
  const handleDelete = async (id) => {
    const confirmed = window.confirm("削除してもよろしいですか？");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("削除に失敗しました。");
      }

      // 削除成功時：対象のオブジェクトをstateから除外
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toastSuccess("ToDoを削除しました");
      console.log(`ToDo ID ${id}を削除しました。`);
    } catch (error) {
      console.error(error);
      toastError("削除に失敗しました。");
    }
  };

  // 編集処理
  const handleUpdate = async (todo) => {
    const { id, completed } = todo;
    const error = validateTodoInput(editingText);
    if (error) {
      toastError(error);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editingText, completed }),
      });

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }

      const updatedTodo = await response.json();

      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setEditingId(null);
      setEditingText("");
      toastSuccess("ToDoを更新しました");
      console.log(`ToDo ID ${id} を更新しました`);
    } catch (error) {
      console.error(error);
      toastError("更新に失敗しました。");
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">Todo一覧</h1>
      {/* 入力フォーム */}
      <div className="todo-input-group">
        <input
          type="text"
          placeholder="新しいToDoを入力"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)} // 入力値の更新
          className="todo-input"
        />
        <button onClick={handleAddTodo} className="todo-add-button">
          追加
        </button>
      </div>
      {/* ToDoリスト表示 */}
      {todos.length === 0 ? (
        <p className="todo-empty">現在、登録されているToDoはありません</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdate(todo);
                      }
                    }}
                  />
                  <button onClick={() => handleUpdate(todo)}>保存</button>
                  <button onClick={() => setEditingId(null)}>キャンセル</button>
                </>
              ) : (
                <>
                  {/* 左側：チェック＋タイトル */}
                  <div className="todo-left">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                    />
                    <span
                      className="todo-title"
                      style={{
                        textDecoration: todo.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {todo.title}
                    </span>
                  </div>

                  {/* 右側：編集・削除ボタン・更新日時 */}
                  <div className="todo-right">
                    <button
                      className="edit-button"
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditingText(todo.title);
                      }}
                    >
                      編集
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(todo.id)}
                    >
                      削除
                    </button>
                    <span className="todo-updated-at">
                      更新: {new Date(todo.createdAt).toLocaleString("ja-JP")}
                    </span>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
