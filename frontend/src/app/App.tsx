import React, { useState } from "react";
import { ViewMode } from "../types/global";
import { FilterStatus } from "../types/global";
import JiraBoard from "../features/jiraBoard/components/JiraBoard";
import ViewSwitch from "../components/common/ViewSwitch";
import TodoInput from "../features/todos/components/TodoInput";
import TodoList from "../features/todos/components/TodoList";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTodos } from "../features/todos/hooks/useTodos";

function App() {
  const {
    todos,
    newTodo,
    setNewTodo,
    editing,
    setEditing,
    addTodo,
    updateExistingTodo,
    removeTodo,
    changeStatus,
  } = useTodos();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>({
    kind: "all",
  });
  const [viewMode, setViewMode] = useState<ViewMode>({ type: "list" });

  const filterOptions: (FilterStatus & { label: string })[] = [
    { kind: "all", label: "すべて" },
    { kind: "status", value: "未着手", label: "未着手" },
    { kind: "status", value: "進行中", label: "進行中" },
    { kind: "status", value: "完了", label: "完了" },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Todo管理ツール</h1>
        <ViewSwitch viewMode={viewMode} setViewMode={setViewMode} />
      </header>

      <main className="app-main">
        {viewMode.type === "board" ? (
          <JiraBoard todos={todos} onStatusChange={changeStatus} />
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
              handleAddTodo={addTodo}
            />

            <TodoList
              todos={todos}
              filterStatus={filterStatus}
              editing={editing}
              setEditing={setEditing}
              handleUpdate={updateExistingTodo}
              handleDelete={removeTodo}
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
