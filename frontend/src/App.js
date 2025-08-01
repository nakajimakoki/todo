// frontend/src/App.js
import React, { useEffect, useState } from "react";
import "./App.css"; // CSSを読み込み
import { ToastContainer } from "react-toastify";
import { toastSuccess, toastError } from "./utils/toast";
import { validateTodoInput } from "./utils/validation";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function App() {
  const [todos, setTodos] = useState([]); // 一覧の状態
  const [newTodo, setNewTodo] = useState(""); // 入力欄用の状態
  const [status, setStatus] = useState(""); // ステータスの状態
  const [editingId, setEditingId] = useState(null); // 編集中のTodo ID
  const [editingText, setEditingText] = useState(""); // 編集用テキスト
  const [editingStatus, setEditingStatus] = useState(""); // 編集用ステータス
  const [filterStatus, setFilterStatus] = useState("すべて"); // ステータスフィルター

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
        body: JSON.stringify({ title: newTodo, status: "未着手" }),
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

  // ステータスを切り替える処理
  const handleStatus = async (todo, newStatus) => {
    const updated = { ...todo, status: newStatus };

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
    } catch (error) {
      console.error(error);
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
    const { id, title } = todo;
    const error = validateTodoInput(editingText);
    if (error) {
      toastError(error);
      return;
    }
    if (editingText === title && editingStatus === todo.status) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editingText, status: editingStatus }),
      });

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }

      const updatedTodo = await response.json();

      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setEditingId(null);
      setEditingText("");
      setEditingStatus("");
      toastSuccess("ToDoを更新しました");
      console.log(`ToDo ID ${id} を更新しました`);
    } catch (error) {
      console.error(error);
      toastError("更新に失敗しました。");
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">ToDo一覧</h1>
      {/* ステータスフィルター */}
      <div className="status-filter-bar">
        {["すべて", "未着手", "進行中", "完了"].map((status) => (
          <button
            key={status}
            className={`status-filter-btn status-filter-btn-${status} ${
              filterStatus === status ? "active" : ""
            }`}
            onClick={() => setFilterStatus(status)}
            type="button"
          >
            {status}
          </button>
        ))}
      </div>
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
          ＋
        </button>
      </div>
      {/* ToDoリスト表示 */}
      {todos.length === 0 ? (
        <p className="todo-empty">現在、登録されているToDoはありません</p>
      ) : (
        <ul className="todo-list">
          {todos
            .filter(
              (todo) =>
                filterStatus === "すべて" || todo.status === filterStatus
            )
            .map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-left">
                  {editingId === todo.id ? (
                    <>
                      {/* 編集モード：ステータス選択（編集用state） */}
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value)}
                        className="todo-status-select"
                      >
                        <option value="未着手">未着手</option>
                        <option value="進行中">進行中</option>
                        <option value="完了">完了</option>
                      </select>

                      {/* タイトル編集用 */}
                      <input
                        type="text"
                        value={editingText}
                        autoFocus
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate(todo);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="todo-edit-input"
                      />
                    </>
                  ) : (
                    <>
                      {/* 通常表示：ステータスバッジ */}
                      <span className={`todo-status status-${todo.status}`}>
                        {todo.status}
                      </span>
                      <span className="todo-title-text">{todo.title}</span>
                    </>
                  )}
                </div>

                <div className="todo-right">
                  {editingId === todo.id ? (
                    <>
                      <button
                        className={`save-button icon-button ${
                          editingText === todo.title &&
                          editingStatus === todo.status
                            ? "unchanged"
                            : "changed"
                        }`}
                        onClick={() => handleUpdate(todo)}
                      >
                        保存
                      </button>
                      <button
                        className="cancel-button icon-button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingText("");
                          setEditingStatus("");
                        }}
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-button icon-button"
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditingText(todo.title);
                          setEditingStatus(todo.status);
                        }}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="delete-button icon-button"
                        onClick={() => handleDelete(todo.id)}
                      >
                        <FiTrash2 />
                      </button>
                      <div className="todo-dates">
                        <div>
                          作成：{" "}
                          {new Date(todo.createdAt).toLocaleString("ja-JP")}
                        </div>
                        <div>
                          更新：{" "}
                          {new Date(todo.updatedAt).toLocaleString("ja-JP")}
                        </div>
                      </div>
                    </>
                  )}
                </div>
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
