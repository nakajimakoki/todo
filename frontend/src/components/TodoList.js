// components/TodoList.js
import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({
  todos,
  filterStatus,
  editingId,
  editingText,
  editingStatus,
  setEditingId,
  setEditingText,
  setEditingStatus,
  handleUpdate,
  handleDelete,
}) {
  const filteredTodos = todos.filter(
    (todo) => filterStatus === "すべて" || todo.status === filterStatus
  );

  if (filteredTodos.length === 0) {
    return <p className="todo-empty">現在、登録されているToDoはありません</p>;
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editingId={editingId}
          editingText={editingText}
          editingStatus={editingStatus}
          setEditingId={setEditingId}
          setEditingText={setEditingText}
          setEditingStatus={setEditingStatus}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
