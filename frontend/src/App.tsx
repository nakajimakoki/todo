import React, { useEffect, useState } from "react";
import { Todo } from "./types/todo";
import { ViewMode } from "./types/viewMode";
import { FilterStatus } from "./types/filterStatus";
import { Editing } from "./types/editing";
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
  const [editing, setEditing] = useState<Editing>({ mode: "none" });
  const [filterStatus, setFilterStatus] = useState<FilterStatus>({
    kind: "all",
  });
  const [viewMode, setViewMode] = useState<ViewMode>({ type: "list" });

  // 初期データの取得
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

  // 新規ToDo追加処理
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

  // 更新処理
  const handleUpdate = async (todo: Todo) => {
    if (editing.mode !== "editing") return;
    const error = validateTodoInput(editing.text);
    if (error) {
      toastError(error);
      return;
    }
    if (editing.text === todo.title && editing.status === todo.status) {
      return;
    }
    try {
      const updated = await updateTodo(todo.id, {
        ...todo,
        title: editing.text,
        status: editing.status,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
      setEditing({ mode: "none" });
      toastSuccess("ToDoを更新しました");
    } catch {
      toastError("ToDoの更新に失敗しました");
    }
  };

  // 削除処理
  const handleDelete = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      toastSuccess("ToDoを削除しました");
    } catch {
      toastError("ToDoの削除に失敗しました");
    }
  };

  // ステータス変更処理
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

  // FilterStatus[] 型のオプション定義
  const filterOptions: (FilterStatus & { label: string })[] = [
    { kind: "all", label: "すべて" },
    { kind: "status", value: "未着手", label: "未着手" },
    { kind: "status", value: "進行中", label: "進行中" },
    { kind: "status", value: "完了", label: "完了" },
  ];

  return (
    <div className="app-container">
      {/* 共通ヘッダー */}
      <header className="app-header">
        <h1 className="app-title">Todo管理ツール</h1>
        <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
      </header>

      {/* メインコンテンツ */}
      <main className="app-main">
        {viewMode.type === "board" ? (
          <JiraBoard todos={todos} onStatusChange={handleStatusChange} />
        ) : (
          <>
            <div className="status-filter-bar">
              {filterOptions.map((filter) => {
                const isActive =
                  filterStatus.kind === filter.kind &&
                  (filter.kind === "all"
                    ? true
                    : filterStatus.kind === "status" &&
                      filterStatus.value === filter.value);
                return (
                  <button
                    key={filter.label}
                    className={`status-filter-btn ${isActive ? "active" : ""}`}
                    onClick={() => setFilterStatus(filter)}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <TodoInput
              newTodo={newTodo}
              setNewTodo={setNewTodo}
              handleAddTodo={handleAddTodo}
            />

            <TodoList
              todos={todos}
              filterStatus={filterStatus}
              editing={editing}
              setEditing={setEditing}
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
