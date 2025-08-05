import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Todo } from "../types/todo";
import { Editing } from "../types/editing";

type TodoItemProps = {
  todo: Todo;
  editing: Editing;
  setEditing: React.Dispatch<React.SetStateAction<Editing>>;
  handleUpdate: (todo: Todo) => void | Promise<void>;
  handleDelete: (id: number) => void | Promise<void>;
};

export default function TodoItem({
  todo,
  editing,
  setEditing,
  handleUpdate,
  handleDelete,
}: TodoItemProps) {
  const isEditing = editing.mode === "editing" && editing.id === todo.id;

  return (
    <li key={todo.id} className="todo-item">
      <div className="todo-header-row">
        <div className="todo-left">
          {isEditing ? (
            <>
              <select
                value={editing.status}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status: e.target.value as Todo["status"],
                  })
                }
                className="todo-status-select"
              >
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
              </select>
              <input
                type="text"
                value={editing.text}
                autoFocus
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    text: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleUpdate(todo);
                  if (e.key === "Escape") setEditing({ mode: "none" });
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
        {!isEditing && (
          <div className="todo-dates">
            <div>作成：{new Date(todo.createdAt).toLocaleString("ja-JP")}</div>
            <div>更新：{new Date(todo.updatedAt).toLocaleString("ja-JP")}</div>
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="todo-footer">
        {isEditing ? (
          <>
            <button
              className={`save-button icon-button ${
                editing.text === todo.title && editing.status === todo.status
                  ? "unchanged"
                  : "changed"
              }`}
              onClick={() => handleUpdate(todo)}
            >
              保存
            </button>
            <button
              className="cancel-button icon-button"
              onClick={() => setEditing({ mode: "none" })}
            >
              キャンセル
            </button>
          </>
        ) : (
          <>
            <button
              className="edit-button icon-button"
              onClick={() =>
                setEditing({
                  mode: "editing",
                  id: todo.id,
                  text: todo.title,
                  status: todo.status,
                })
              }
            >
              <FiEdit2 />
            </button>
            <button
              className="delete-button icon-button"
              onClick={() => handleDelete(todo.id)}
            >
              <FiTrash2 />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
