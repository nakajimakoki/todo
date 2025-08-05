// components/TodoItem.tsx
import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Todo } from "../types/todo";

type TodoItemProps = {
  todo: Todo;
  editingId: number | null;
  editingText: string;
  editingStatus: Todo["status"];
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingText: React.Dispatch<React.SetStateAction<string>>;
  setEditingStatus: React.Dispatch<React.SetStateAction<Todo["status"]>>;
  handleUpdate: (todo: Todo) => void | Promise<void>;
  handleDelete: (id: number) => void | Promise<void>;
};

export default function TodoItem({
  todo,
  editingId,
  editingText,
  editingStatus,
  setEditingId,
  setEditingText,
  setEditingStatus,
  handleUpdate,
  handleDelete,
}: TodoItemProps) {
  return (
    <li key={todo.id} className={`todo-item`}>
      <div className="todo-item-inner">
        <div className="todo-left">
          {editingId === todo.id ? (
            <>
              <select
                value={editingStatus}
                onChange={(e) => setEditingStatus(e.target.value as Todo["status"])}
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
              <span className={`todo-status status-${todo.status}`}>
                {todo.status}
              </span>
              <span className="todo-title-text">{todo.title}</span>
            </>
          )}
        </div>
        <div className="todo-right">
          {editingId === todo.id ? (
            <>
              <button
                className={`save-button icon-button ${
                  editingText === todo.title && editingStatus === todo.status
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
                  作成：{new Date(todo.createdAt).toLocaleString("ja-JP")}
                </div>
                <div>
                  更新：{new Date(todo.updatedAt).toLocaleString("ja-JP")}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
}