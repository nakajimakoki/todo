import React, { useEffect, useState } from "react";
import JiraBoard from "./JiraBoard";
import ViewSwitch from "./components/ViewSwitch";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { toastSuccess, toastError } from "./utils/toast";
import { validateTodoInput } from "./utils/validation";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./api/todoService";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingStatus, setEditingStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("すべて");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch {
        toastError("ToDoの取得に失敗しました");
      }
    })();
  }, []);

  const handleAddTodo = async () => {
    const error = validateTodoInput(newTodo);
    if (error) {
      toastError(error);
      return;
    }
    try {
      const created = await createTodo(newTodo);
      setTodos((prev) => [...prev, created]);
      setNewTodo("");
      toastSuccess("ToDoを追加しました");
    } catch {
      toastError("ToDoの追加に失敗しました");
    }
  };

  const handleUpdate = async (todo) => {
    const error = validateTodoInput(editingText);
    if (error) {
      toastError(error);
      return;
    }
    try {
      const updated = await updateTodo(todo.id, {
        ...todo,
        title: editingText,
        status: editingStatus,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      setEditingId(null);
      toastSuccess("ToDoを更新しました");
    } catch {
      toastError("ToDoの更新に失敗しました");
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await deleteTodo(todoId);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      toastSuccess("ToDoを削除しました");
    } catch {
      toastError("ToDoの削除に失敗しました");
    }
  };

  return (
    <div className="app-container">
      {viewMode === "board" ? (
        <>
          <div className="board-header">
            <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
          </div>
          <JiraBoard
            todos={todos}
            onStatusChange={async (todoId, newStatus) => {
              const todo = todos.find((t) => t.id === todoId);
              if (!todo || todo.status === newStatus) return;
              try {
                const updated = await updateTodo(todoId, {
                  ...todo,
                  status: newStatus,
                });
                setTodos((prev) =>
                  prev.map((t) => (t.id === todoId ? updated : t))
                );
                toastSuccess("ステータスを更新しました");
              } catch {
                toastError("ステータスの更新に失敗しました");
              }
            }}
          />
        </>
      ) : (
        <div className="todo-container">
          <div className="todo-header">
            <h1 className="todo-title">ToDo一覧</h1>
            <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
          </div>

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

          <TodoInput
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            handleAddTodo={handleAddTodo}
          />

          <TodoList
            todos={todos}
            filterStatus={filterStatus}
            editingId={editingId}
            editingText={editingText}
            editingStatus={editingStatus}
            setEditingId={setEditingId}
            setEditingText={setEditingText}
            setEditingStatus={setEditingStatus}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
          />
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        theme="light"
      />
    </div>
  );
}

export default App;
