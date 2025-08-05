import React, { useEffect, useState } from "react";
import { Todo } from "./types/todo";
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
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [editingStatus, setEditingStatus] = useState<Todo["status"]>("未着手");
  const [filterStatus, setFilterStatus] = useState<"すべて" | Todo["status"]>(
    "すべて"
  );
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

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

  const handleUpdate = async (todo: Todo) => {
    const error = validateTodoInput(editingText);
    if (error) {
      toastError(error);
      return;
    }
    if (editingText === todo.title && editingStatus === todo.status) {
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

  const handleDelete = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      toastSuccess("ToDoを削除しました");
    } catch {
      toastError("ToDoの削除に失敗しました");
    }
  };

  const handleStatusChange = async (
    todoId: number,
    newStatus: Todo["status"]
  ) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo || todo.status === newStatus) return;
    try {
      const updated = await updateTodo(todoId, {
        ...todo,
        status: newStatus,
      });
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)));
      toastSuccess("ステータスを更新しました");
    } catch {
      toastError("ステータスの更新に失敗しました");
    }
  };
  return (
    <div className="app-container">
      {/* 共通ヘッダー */}
      <header className="app-header">
        <h1 className="app-title">Todo管理ツール</h1>
        <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
      </header>

      <main className="app-main">
        {viewMode === "board" ? (
          <JiraBoard todos={todos} onStatusChange={handleStatusChange} />
        ) : (
          <>
            <div className="status-filter-bar">
              {["すべて", "未着手", "進行中", "完了"].map((status) => (
                <button
                  key={status}
                  className={`status-filter-btn ${
                    filterStatus === status ? "active" : ""
                  }`}
                  onClick={() =>
                    setFilterStatus(status as "すべて" | Todo["status"])
                  }
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
          </>
        )}
      </main>

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
