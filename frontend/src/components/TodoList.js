// components/TodoList.tsx
import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "../types/todo";

type TodoListProps = {
  todos: Todo[];
  filterStatus: "すべて" | Todo["status"];
  editingId: number | null;
  editingText: string;
  editingStatus: Todo["status"];
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingText: React.Dispatch<React.SetStateAction<string>>;
  setEditingStatus: React.Dispatch<React.SetStateAction<Todo["status"]>>;
  handleUpdate: (todo: Todo) => void | Promise<void>;
  handleDelete: (id: number) => void | Promise<void>;
};

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
}: TodoListProps) {
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
