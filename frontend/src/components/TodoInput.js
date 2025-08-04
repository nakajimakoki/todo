// components/TodoInput.js
import React from "react";

export default function TodoInput({ newTodo, setNewTodo, handleAddTodo }) {
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
