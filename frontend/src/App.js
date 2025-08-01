// frontend/src/App.js
import React, { useEffect, useState } from "react";
import JiraBoard from "./JiraBoard";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { toastSuccess, toastError } from "./utils/toast";
import { validateTodoInput } from "./utils/validation";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingStatus, setEditingStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("すべて");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("http://localhost:8080/todos");
        if (!res.ok) throw new Error("取得に失敗しました");
        const data = await res.json();
        setTodos(data);
      } catch {
        toastError("ToDoの取得に失敗しました");
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!validateTodoInput(newTodo)) {
      toastError("入力が不正です");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo, status: "未着手" }),
      });
      if (!res.ok) throw new Error("追加に失敗しました");
      const created = await res.json();
      setTodos((prev) => [...prev, created]);
      setNewTodo("");
      toastSuccess("ToDoを追加しました");
    } catch {
      toastError("ToDoの追加に失敗しました");
    }
  };

  const handleUpdate = async (todo) => {
    try {
      const res = await fetch(`http://localhost:8080/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...todo,
          title: editingText,
          status: editingStatus,
        }),
      });
      if (!res.ok) throw new Error("更新に失敗しました");
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      setEditingId(null);
      toastSuccess("ToDoを更新しました");
    } catch {
      toastError("ToDoの更新に失敗しました");
    }
  };

  const handleDelete = async (todoId) => {
    try {
      const res = await fetch(`http://localhost:8080/todos/${todoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("削除に失敗しました");
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      toastSuccess("ToDoを削除しました");
    } catch {
      toastError("ToDoの削除に失敗しました");
    }
  };

  return (
    <div className="app-container">
      {/* ✅ 共通の切り替えボタン */}
      <div className="view-switch-bar">
        <button
          className={`view-switch-btn${viewMode === "list" ? " active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          一覧表示
        </button>
        <button
          className={`view-switch-btn${viewMode === "board" ? " active" : ""}`}
          onClick={() => setViewMode("board")}
        >
          ボード表示
        </button>
      </div>

      {viewMode === "board" ? (
        // ✅ ボード画面
        <JiraBoard
          todos={todos}
          onStatusChange={async (todoId, newStatus) => {
            const todo = todos.find((t) => t.id === todoId);
            if (!todo || todo.status === newStatus) return;
            try {
              const res = await fetch(`http://localhost:8080/todos/${todoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...todo, status: newStatus }),
              });
              if (!res.ok) throw new Error("更新に失敗しました");
              const updated = await res.json();
              setTodos((prev) =>
                prev.map((t) => (t.id === todoId ? updated : t))
              );
              toastSuccess("ステータスを更新しました");
            } catch {
              toastError("ステータスの更新に失敗しました");
            }
          }}
        />
      ) : (
        // ✅ 一覧画面
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
              onChange={(e) => setNewTodo(e.target.value)}
              className="todo-input"
            />
            <button onClick={handleAddTodo} className="todo-add-button">
              ＋
            </button>
          </div>

          {/* ToDoリスト */}
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
                    <div className="todo-item-inner">
                      <div className="todo-left">
                        {editingId === todo.id ? (
                          <>
                            <select
                              value={editingStatus}
                              onChange={(e) => setEditingStatus(e.target.value)}
                              className="todo-status-select"
                            >
                              <option value="未着手">未着手</option>
                              <option value="進行中">進行中</option>
                              <option value="完了">完了</option>
                            </select>
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
                            <span
                              className={`todo-status status-${todo.status}`}
                            >
                              {todo.status}
                            </span>
                            <span className="todo-title-text">
                              {todo.title}
                            </span>
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
                                作成：
                                {new Date(todo.createdAt).toLocaleString(
                                  "ja-JP"
                                )}
                              </div>
                              <div>
                                更新：
                                {new Date(todo.updatedAt).toLocaleString(
                                  "ja-JP"
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
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
