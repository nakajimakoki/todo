import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "../types/todo";
import { FilterStatus } from "../types/filterStatus";
import { Editing } from "../types/editing";

type TodoListProps = {
  todos: Todo[];
  filterStatus: FilterStatus;
  editing: Editing;
  setEditing: React.Dispatch<React.SetStateAction<Editing>>;
  handleUpdate: (todo: Todo) => void | Promise<void>;
  handleDelete: (id: number) => void | Promise<void>;
};

export default function TodoList({
  todos,
  filterStatus,
  editing,
  setEditing,
  handleUpdate,
  handleDelete,
}: TodoListProps) {
  // フィルター適用
  const filteredTodos = React.useMemo(() => {
    return todos.filter((todo) => {
      if (filterStatus.kind === "all") return true;
      return todo.status === filterStatus.value;
    });
  }, [todos, filterStatus]);

  if (filteredTodos.length === 0) {
    return <p className="todo-empty">現在、登録されているToDoはありません</p>;
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={editing}
          setEditing={setEditing}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
