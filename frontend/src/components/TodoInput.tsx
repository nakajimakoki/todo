// components/TodoInput.tsx
import React from "react";

type TodoInputProps = {
  newTodo: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: () => void;
};

export default function TodoInput({
  newTodo,
  setNewTodo,
  handleAddTodo,
}: TodoInputProps) {
  return (
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
  );
}
